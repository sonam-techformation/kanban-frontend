"use client";
import React, { useEffect, useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Column } from "./column";
import { reOrderList } from "../api/listApi";
import { moveTaskList } from "../api/taskApi";
import { useSocket } from "@/context/socketContext";

export default function Draggable({ initialData }: any) {
  const [columns, setColumns] = useState(initialData);
  const { socket, subscribeToTaskMoved, unsubscribeFromTaskMoved } =
    useSocket();

  useEffect(() => {
    setColumns(initialData);
  }, [initialData]);

  const handleTaskMoved = useCallback((data: any) => {
    console.log("Task moved (real-time):", data);
    setColumns((prevColumns: any) => {
      // Create a deep copy of the current columns
      const updatedColumns = JSON.parse(JSON.stringify(prevColumns));

      // Find the source and target columns
      const fromColumn = updatedColumns.find(
        (col: any) => col.id === data.fromColumnId
      );
      const toColumn = updatedColumns.find(
        (col: any) => col.id === data.toColumnId
      );

      if (fromColumn && toColumn) {
        // Handle reordering within the same column
        if (data.fromColumnId === data.toColumnId) {
          const taskIndex = fromColumn.tasks.findIndex(
            (task: any) => task.id === data.taskId
          );
          if (taskIndex !== -1) {
            // Remove the task from its current position
            const [taskToMove] = fromColumn.tasks.splice(taskIndex, 1);
            // Insert the task at the new position
            fromColumn.tasks.splice(data.newPosition, 0, taskToMove);
          }
        } else {
          // Handle moving between columns
          const taskIndex = fromColumn.tasks.findIndex(
            (task: any) => task.id === data.taskId
          );
          if (taskIndex !== -1) {
            // Remove the task from the source column
            const [taskToMove] = fromColumn.tasks.splice(taskIndex, 1);
            // Add the task to the target column at the new position
            toColumn.tasks.splice(data.newPosition, 0, taskToMove);
          }
        }
      }

      return updatedColumns;
    });
  }, []);

  useEffect(() => {
    subscribeToTaskMoved(handleTaskMoved);
    return () => {
      unsubscribeFromTaskMoved();
    };
  }, [subscribeToTaskMoved, unsubscribeFromTaskMoved, handleTaskMoved]);

  const moveTask = async (
    taskId: number,
    fromColumnId: number,
    toColumnId: number,
    newPosition: number
  ) => {
    setColumns((prevColumns: any) => {
      const updatedColumns = prevColumns.map(
        (column: { id: number; tasks: any[] }) => {
          if (column.id === fromColumnId && column.id === toColumnId) {
            // Handle reordering within the same column
            const tasks = [...column.tasks];
            const currentIndex = tasks.findIndex((task) => task.id === taskId);

            if (currentIndex !== -1) {
              // Remove the task from its current position
              const [taskToMove] = tasks.splice(currentIndex, 1);
              // Insert the task at the new position
              tasks.splice(newPosition, 0, taskToMove);
              return { ...column, tasks };
            }
          } else if (column.id === fromColumnId) {
            // Remove task from the source column
            const updatedTasks = column.tasks.filter(
              (task) => task.id !== taskId
            );
            return { ...column, tasks: updatedTasks };
          } else if (column.id === toColumnId) {
            // Find the task in the source column
            const taskToMove = prevColumns
              .find((col: { id: number }) => col.id === fromColumnId)!
              .tasks.find((task: { id: number }) => task.id === taskId);

            // Add the task to the target column at the new position
            const tasks = [...column.tasks];
            tasks.splice(newPosition, 0, taskToMove);
            return { ...column, tasks };
          }
          return column;
        }
      );
      return updatedColumns;
    });

    // Prepare data for the backend API
    const reorderData = {
      toListId: toColumnId,
      newPosition: newPosition,
    };

    // Call the API to move the task
    const res = await moveTaskList(taskId, reorderData);

    // If the API call is successful and the socket is available, emit a WebSocket event
    if (res && socket) {
      socket.emit("moveTask", {
        taskId,
        fromColumnId,
        toColumnId,
        newPosition,
      });
    }
  };

  const moveColumn = async (fromColumnId: number, toColumnId: number) => {
    // Swap the columns in the UI state
    setColumns((prevColumns: any) => {
      const updatedColumns = [...prevColumns];
      const fromIndex = updatedColumns.findIndex(
        (col) => col.id === fromColumnId
      );
      const toIndex = updatedColumns.findIndex((col) => col.id === toColumnId);
      // Swap columns
      const [movedColumn] = updatedColumns.splice(fromIndex, 1);
      updatedColumns.splice(toIndex, 0, movedColumn);
      return updatedColumns;
    });

    // Call backend to reorder columns (lists)
    const columnOrder = columns.map((col: any) => col.id);
    await reOrderList(columns[0].board_id, columnOrder);
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-wrap gap-4 p-4 justify-center ">
          {columns.map((column: any) => (
            <Column
              key={column.id}
              column={column}
              moveTask={moveTask}
              moveColumn={moveColumn}
            />
          ))}
        </div>
      </DndProvider>
    </>
  );
}
