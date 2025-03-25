"use client";
import { apiRequest } from "@/interceptor/interceptor";
import { listTextColor, textColor } from "@/utils/color";
import React, { lazy, useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import Modal from "./modal";
import AddTask from "./addTask";
import { Task } from "./task";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/react-query";
import { ColumnProps } from "@/types/column";
import { ItemType } from "@/types/enum";
import { addNewTaskToList } from "../api/taskApi";
import { AiOutlinePlus } from "react-icons/ai";
import { text } from "stream/consumers";
import { useTheme } from "next-themes";
import { assignTask } from "../api/taskAssignApi";
import { useSocket } from "@/context/socketContext";

export const Column: React.FC<ColumnProps> = ({
  column,
  moveTask,
  moveColumn,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Task");
  const [editId, setEditId] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const { theme } = useTheme();
  const { socket, notifications } = useSocket();
  // Modal handling
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const calculateNewPosition = (
    item: any,
    monitor: any,
    node: HTMLElement | null
  ) => {
    const dragIndex = column.tasks.findIndex(
      (task: any) => task.id === item.task.id
    );

    if (item.columnId === column.id && node) {
      const hoverBoundingRect = node.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (hoverClientY < hoverMiddleY) {
        return dragIndex; // Place above
      }
      return Math.min(dragIndex + 1, column.tasks.length - 1); // Place below
    }

    return column.tasks.length;
  };

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemType.COLUMN,
    item: { columnId: column.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, dropTask] = useDrop({
    accept: ItemType.TASK,
    drop: (item: any, monitor) => {
      const node = monitor.getDropResult(); // Get the drop target node
      const newPosition = calculateNewPosition(item, monitor, node as any);
      moveTask(item.task.id, item.columnId, column.id, newPosition);
    },
  });

  const [, dropColumn] = useDrop({
    accept: ItemType.COLUMN,
    hover: (draggedItem: any) => {
      // if (draggedItem.columnId !== column.id) {
      moveColumn(draggedItem.columnId, column.id);
      // draggedItem.columnId = column.id;
      // }
    },
  });

  const addNewTask = (newBoard: any) => {
    addTask.mutate(newBoard);
  };

  const addTask = useMutation({
    mutationFn: async (task: any) => {
      let newtask: any = {
        title: task.title,
        description: task.description,
        position:
          (column.tasks.length > 0 &&
            +column.tasks[column.tasks.length - 1].position + 1) ||
          0,
      };

      const response = await addNewTaskToList(column.id, newtask);
      let assign = {
        taskId: response.id,
        toUser: +task.assignTo,
        byUser: 1,
      };
       await assignTask(assign);
    
      setIsModalOpen(false);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list"], exact: true });
      setIsModalOpen(false);
    },
  });

  return (
    <div
      ref={(node) => preview(dropColumn(dropTask(node))) as any}
      className={`card-space w-xs md:w-sm p-4 bg-gray-200 min-h-[300px] border-2 border-gray-300 rounded ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex justify-between">
        <div
          ref={drag as unknown as React.Ref<HTMLDivElement>}
          className="cursor-grab"
        >
          <h2 className={`${listTextColor(theme)} text-sm font-bold mb-2`}>
            {column.name
              ? column.name.replace(/\b\w/g, (char) => char.toUpperCase())
              : ""}
          </h2>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="mb-2 p-1 bg-green-700 border-0 py-1 px-1 focus:outline-none hover:bg-green-700 text-white rounded text-xs"
        >
          <AiOutlinePlus />
        </button>
      </div>
      <div ref={dropTask as unknown as React.Ref<HTMLDivElement>}>
        {column.tasks.length > 0 ? (
          column.tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              moveTask={moveTask}
              columnId={column.id}
            />
          ))
        ) : (
          <div className="text-center text-gray-500">Drop tasks here</div>
        )}
      </div>
      <Modal modalTitle={"Add Task"} isOpen={isModalOpen} onClose={closeModal}>
        <AddTask
          onClose={() => setIsModalOpen(false)}
          onSave={addNewTask}
          isEdit={editId !== null}
          editId={editId}
        />
      </Modal>
    </div>
  );
};
