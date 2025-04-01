"use client";
import React, { useEffect, useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Column } from "./column";
import { debouncedReOrderList } from "../api/listApi";
import { moveTaskList } from "../api/taskApi";
import { useSocket } from "@/context/socketContext";
import { useNetworkStatus } from "@/hooks/usenetworkStatus";
import { offlineDB } from "@/lib/offlineDB";

export default function Draggable({ initialData }: any) {
  const [columns, setColumns] = useState(initialData);
  const { socket, subscribeToTaskMoved, unsubscribeFromTaskMoved } =
    useSocket();
  const isOnline = useNetworkStatus();

  // Load initial data and apply offline changes
  useEffect(() => {
    const loadOfflineState = async () => {
      const [offlineTasks, offlineColumnOrder] = await Promise.all([
        offlineDB.getAllTasks(),
        offlineDB.getColumnOrder(),
      ]);

      let updatedColumns = initialData;

      // Apply offline column order if exists
      if (offlineColumnOrder) {
        updatedColumns = [...initialData].sort(
          (a, b) =>
            offlineColumnOrder.indexOf(a.id) - offlineColumnOrder.indexOf(b.id)
        );
      }

      // Apply offline task changes
      if (offlineTasks.length > 0) {
        updatedColumns = updatedColumns.map((col: any) => ({
          ...col,
          tasks: col.tasks.map(
            (task: any) => offlineTasks.find((ot) => ot.id === task.id) || task
          ),
        }));
      }

      setColumns(updatedColumns);
    };

    loadOfflineState();
  }, [initialData]);

  // Handle real-time task movement from other clients
  const handleTaskMoved = useCallback((data: any) => {
    setColumns((prevColumns: any) => {
      const updatedColumns = JSON.parse(JSON.stringify(prevColumns));
      const fromColumn = updatedColumns.find(
        (col: any) => col.id === data.fromColumnId
      );
      const toColumn = updatedColumns.find(
        (col: any) => col.id === data.toColumnId
      );

      if (fromColumn && toColumn) {
        if (data.fromColumnId === data.toColumnId) {
          // Same column movement
          const taskIndex = fromColumn.tasks.findIndex(
            (task: any) => task.id === data.taskId
          );
          if (taskIndex !== -1) {
            const [taskToMove] = fromColumn.tasks.splice(taskIndex, 1);
            fromColumn.tasks.splice(data.newPosition, 0, taskToMove);
          }
        } else {
          // Cross-column movement
          const taskIndex = fromColumn.tasks.findIndex(
            (task: any) => task.id === data.taskId
          );
          if (taskIndex !== -1) {
            const [taskToMove] = fromColumn.tasks.splice(taskIndex, 1);
            toColumn.tasks.splice(data.newPosition, 0, taskToMove);
          }
        }
      }
      return updatedColumns;
    });
  }, []);

  useEffect(() => {
    subscribeToTaskMoved(handleTaskMoved);
    return () => unsubscribeFromTaskMoved();
  }, [handleTaskMoved, subscribeToTaskMoved, unsubscribeFromTaskMoved]);

  // Move task with offline support
  const moveTask = async (
    taskId: number,
    fromColumnId: number,
    toColumnId: number,
    newPosition: number
  ) => {
    // Optimistic UI update
    setColumns((prevColumns: any[]) => {
      const updatedColumns = prevColumns.map((column: any) => {
        if (column.id === fromColumnId && column.id === toColumnId) {
          // Same column reordering
          const tasks = [...column.tasks];
          const currentIndex = tasks.findIndex((task) => task.id === taskId);
          if (currentIndex !== -1) {
            const [taskToMove] = tasks.splice(currentIndex, 1);
            tasks.splice(newPosition, 0, taskToMove);
            return { ...column, tasks };
          }
        } else if (column.id === fromColumnId) {
          // Remove from source column
          return {
            ...column,
            tasks: column.tasks.filter(
              (task: { id: number }) => task.id !== taskId
            ),
          };
        } else if (column.id === toColumnId) {
          // Add to target column
          const taskToMove = prevColumns
            .find((col: any) => col.id === fromColumnId)
            ?.tasks.find((task: any) => task.id === taskId);
          if (taskToMove) {
            const tasks = [...column.tasks];
            tasks.splice(newPosition, 0, {
              ...taskToMove,
              listId: toColumnId,
            });
            return { ...column, tasks };
          }
        }
        return column;
      });
      return updatedColumns;
    });

    // Save to offline storage
    const taskToUpdate = columns
      .find((col: any) => col.id === fromColumnId)
      ?.tasks.find((task: any) => task.id === taskId);

    if (taskToUpdate) {
      await offlineDB.updateTask({
        ...taskToUpdate,
        listId: toColumnId,
        position: newPosition,
      });
    }

    // Sync with server if online
    if (isOnline) {
      try {
        const res = await moveTaskList(taskId, {
          toListId: toColumnId,
          newPosition,
        });

        if (res && socket) {
          socket.emit("moveTask", {
            taskId,
            fromColumnId,
            toColumnId,
            newPosition,
          });
        }
      } catch (error) {
        console.error("Failed to sync task move:", error);
        await offlineDB.addPendingOperation({
          type: "MOVE_TASK",
          taskId,
          fromColumnId,
          toColumnId,
          newPosition,
          timestamp: new Date().toISOString(),
        });
      }
    } else {
      // Queue for sync when back online
      await offlineDB.addPendingOperation({
        type: "MOVE_TASK",
        taskId,
        fromColumnId,
        toColumnId,
        newPosition,
        timestamp: new Date().toISOString(),
      });
    }
  };

  // Move column with offline support
  const moveColumn = async (fromColumnId: number, toColumnId: number) => {
    // Optimistic UI update
    setColumns((prevColumns: any) => {
      const newColumns = [...prevColumns];
      const fromIndex = newColumns.findIndex((c) => c.id === fromColumnId);
      const toIndex = newColumns.findIndex((c) => c.id === toColumnId);

      const [movedColumn] = newColumns.splice(fromIndex, 1);
      newColumns.splice(toIndex, 0, movedColumn);
      return newColumns;
    });

    // Save new column order to offline storage
    const newColumnOrder = columns.map((c: any) => c.id);
    await offlineDB.saveColumnOrder(newColumnOrder);

    // Sync with server if online
    if (isOnline) {
      try {
        await debouncedReOrderList(columns[0].board_id, newColumnOrder);
      } catch (error) {
        console.error("Failed to sync column move:", error);
        await offlineDB.addPendingOperation({
          type: "MOVE_COLUMN",
          boardId: columns[0].board_id,
          newOrder: newColumnOrder,
          timestamp: new Date().toISOString(),
        });
      }
    } else {
      // Queue for sync when back online
      await offlineDB.addPendingOperation({
        type: "MOVE_COLUMN",
        boardId: columns[0].board_id,
        newOrder: newColumnOrder,
        timestamp: new Date().toISOString(),
      });
    }
  };

  // Sync pending operations when coming online
  useEffect(() => {
    if (!isOnline) return;

    const syncOperations = async () => {
      const pendingOps = await offlineDB.getPendingOperations();

      for (const op of pendingOps) {
        try {
          if (op.type === "MOVE_TASK") {
            const res = await moveTaskList(op.taskId, {
              toListId: op.toColumnId,
              newPosition: op.newPosition,
            });

            if (res && socket) {
              socket.emit("moveTask", {
                taskId: op.taskId,
                fromColumnId: op.fromColumnId,
                toColumnId: op.toColumnId,
                newPosition: op.newPosition,
              });
            }
          } else if (op.type === "MOVE_COLUMN") {
            await debouncedReOrderList(op.boardId, op.newOrder);
          }
          await offlineDB.clearOperation(op.id);
        } catch (error) {
          console.error("Failed to sync operation:", op, error);
        }
      }
    };

    syncOperations();
  }, [isOnline, socket]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-wrap gap-4 p-4 justify-center">
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
  );
}
