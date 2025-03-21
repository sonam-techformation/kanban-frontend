"use client";
import { apiRequest } from "@/interceptor/interceptor";
import { Constants } from "@/utils/constant";
import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import Modal from "./modal";
import AddTask from "./addTask";
import { Task } from "./task";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/react-query";
import { ColumnProps } from "@/types/column";
import { ItemType } from "@/types/enum";

// export const Column: React.FC<ColumnProps> = ({
//   column,
//   moveTask,
//   moveColumn,
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalTitle, setModalTitle] = useState("Add Task");
//   const [editId, setEditId] = useState(0);
//   const [isEdit, setIsEdit] = useState(false);
//   // Modal handling
//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };
//   const [{ isDragging }, drag, preview] = useDrag({
//     type: ItemType.COLUMN,
//     item: { columnId: column.id },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   });
//   const [, dropTask] = useDrop({
//     accept: ItemType.TASK,
//     drop: (item: any) => moveTask(item.task.id, item.columnId, column.id),
//   });
//   const [, dropColumn] = useDrop({
//     accept: ItemType.COLUMN,
//     hover: (draggedItem: any) => {
//       if (draggedItem.columnId !== column.id) {
//         moveColumn(draggedItem.columnId, column.id);
//         draggedItem.columnId = column.id;
//       }
//     },
//   });

//   const addNewTask = (newBoard: any) => {
//     addTask.mutate(newBoard);
//   };

//   const addTask = useMutation({
//     mutationFn: async (task: any) => {
//       let newtask: any = {
//         title: task.title,
//         description: task.description,
//         position:
//           (column.tasks.length > 0 &&
//             +column.tasks[column.tasks.length - 1].position + 1) ||
//           0,
//       };
//       const response = await apiRequest(
//         `${Constants.API_URL}/lists/${column.id}/task`,
//         "post",
//         newtask
//       );
//       setIsModalOpen(false);
//       return response;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["list"], exact: true });
//       setIsModalOpen(false);
//     },
//   });

//   return (
//     <div
//       ref={(node) => preview(dropColumn(dropTask(node))) as any}
//       className={`card-space w-1/3 p-4 bg-gray-200 min-h-[300px] border-2 border-gray-300 rounded ${
//         isDragging ? "opacity-50" : ""
//       }`}
//     >
//       <div
//         ref={drag as unknown as React.Ref<HTMLDivElement>}
//         className="cursor-grab"
//       >
//         <h2 className="text-sm font-bold mb-2">{column.name}</h2>
//       </div>
//       <button
//         type="button"
//         onClick={openModal}
//         className="mb-2 p-1 bg-green-700 border-0 py-1 px-1 focus:outline-none hover:bg-green-700 text-white rounded text-xs"
//       >
//         Add Task
//       </button>
//       <div ref={dropTask as unknown as React.Ref<HTMLDivElement>}>
//         {column.tasks.length > 0 ? (
//           column.tasks.map((task) => (
//             <Task
//               key={task.id}
//               task={task}
//               moveTask={moveTask}
//               columnId={column.id}
//             />
//           ))
//         ) : (
//           <div className="text-center text-gray-500">Drop tasks here</div>
//         )}
//       </div>
//       <Modal modalTitle={"Add Task"} isOpen={isModalOpen} onClose={closeModal}>
//         <AddTask
//           onClose={() => setIsModalOpen(false)}
//           onSave={addNewTask}
//           isEdit={editId !== null}
//           editId={editId}
//         />
//       </Modal>
//     </div>
//   );
// };

export const Column: React.FC<ColumnProps> = ({
  column,
  moveTask,
  moveColumn,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Task");
  const [editId, setEditId] = useState(0);
  const [isEdit, setIsEdit] = useState(false);

  // Modal handling
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const calculateNewPosition = (item: any, column: any) => {
    const taskId = item.task.id;
    const draggedTask = item.task;
    const tasksInColumn = column.tasks;

    // If moving to the same column, determine the new position based on the drop index
    if (item.columnId === column.id) {
      // Find the index of the task being dragged
      const draggedIndex = tasksInColumn.findIndex(
        (task: any) => task.id === taskId
      );

      // If the task is being dropped within the same column, calculate the new position
      const taskIds = tasksInColumn.map((task: any) => task.id);
      const newIndex = tasksInColumn.findIndex(
        (task: any) => task.id === taskId
      );

      if (newIndex !== -1) {
        tasksInColumn.splice(newIndex, 1);
      }
      tasksInColumn.push(draggedTask);

      // Return new position in the target column
      return tasksInColumn.length - 1; // Add at the end of the list or calculate based on logic
    }

    // Moving to another column, calculate new position based on number of tasks in the column
    return tasksInColumn.length; // New position is the last position in the target column
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
    drop: (item: any) => {
      // Calculate the new position where the task is dropped
      const newPosition = calculateNewPosition(item, column); // Implement this based on your UI
      moveTask(item.task.id, item.columnId, column.id, newPosition);
    },
  });

  const [, dropColumn] = useDrop({
    accept: ItemType.COLUMN,
    hover: (draggedItem: any) => {
      if (draggedItem.columnId !== column.id) {
        moveColumn(draggedItem.columnId, column.id);
        draggedItem.columnId = column.id;
      }
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
      const response = await apiRequest(
        `${Constants.API_URL}/lists/${column.id}/task`,
        "post",
        newtask
      );
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
      className={`card-space w-1/3 p-4 bg-gray-200 min-h-[300px] border-2 border-gray-300 rounded ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div
        ref={drag as unknown as React.Ref<HTMLDivElement>}
        className="cursor-grab"
      >
        <h2 className="text-sm font-bold mb-2">{column.name}</h2>
      </div>
      <button
        type="button"
        onClick={openModal}
        className="mb-2 p-1 bg-green-700 border-0 py-1 px-1 focus:outline-none hover:bg-green-700 text-white rounded text-xs"
      >
        Add Task
      </button>
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
