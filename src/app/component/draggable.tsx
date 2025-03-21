"use client";
import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Column } from "./column";
import { apiRequest } from "@/interceptor/interceptor";
import { Constants } from "@/utils/constant";

// Main App Component
export default function Draggable({ initialData }: any) {
  const [columns, setColumns] = useState(initialData);

  useEffect(() => {
    setColumns(initialData);
  }, [initialData]);

  const reorderLists = async (boardId: number, listOrder: number[]) => {
    try {
      const response = apiRequest(
        `${Constants.API_URL}/boards/${boardId}/lists/order`,
        "patch",
        { listOrder } as any
      );
    } catch (error) {
      console.log(error);
    }
  };

  const moveTask = async (
    taskId: number,
    fromColumnId: number,
    toColumnId: number,
    newPosition: number
  ) => {
    // Optimistic UI update: Update the columns in the frontend first
    setColumns((prevColumns: any) => {
      const updatedColumns = prevColumns.map(
        (column: { id: number; tasks: any[] }) => {
          if (column.id === fromColumnId) {
            // Remove task from the source column
            const updatedTasks = column.tasks.filter(
              (task) => task.id !== taskId
            );
            return { ...column, tasks: updatedTasks };
          }
          if (column.id === toColumnId) {
            // Find the task in the source column and add it to the target column
            const taskToMove = prevColumns
              .find((col: { id: number }) => col.id === fromColumnId)!
              .tasks.find((task: { id: number }) => task.id === taskId);
            return { ...column, tasks: [...column.tasks, taskToMove] };
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

    try {
      // Call backend to move the task in the database
      const response = await apiRequest(
        `${Constants.API_URL}/tasks/${taskId}/move`,
        "PATCH",
        reorderData as any
      );
    } catch (error) {
      console.log("Error moving task:", error);
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
    await reorderLists(columns[0].board_id, columnOrder);
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="column-container flex gap-4 p-4">
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
