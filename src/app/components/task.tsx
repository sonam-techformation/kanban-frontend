"use client";
import queryClient from "@/lib/react-query";
import { ItemType } from "@/types/enum";
import { TaskProps } from "@/types/task";
import { useMutation } from "@tanstack/react-query";
import { useDrag } from "react-dnd";
import { deleteTaskFromList, editTaskInList } from "../api/taskApi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { listTextColor } from "@/utils/color";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import Button from "./button";
import DialogBox from "./dialog";
import { useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import Modal from "./modal";
import AddTask from "./addTask";
import { updateAssignTask } from "../api/taskAssignApi";
export const Task: React.FC<TaskProps> = ({
  task,
  moveTask,
  columnId,
  boardOwnerId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Board");
  const [editId, setEditId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>(0);
  const { theme } = useTheme();
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.TASK,
    item: { task, columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const deleteTasks = useMutation({
    mutationFn: async (id: any) => {
      await deleteTaskFromList(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list"], exact: true });
      toast.success("Task deleted successfully");
    },
  });

  // In your dashboard component
  const deleteBoardClicked = (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const deleteBoardConfirmed = () => {
    deleteTasks.mutate(deleteId);
    setIsDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  // Modal handling
  const openModal = (id: number | null = null, title: string = "Edit Task") => {
    setModalTitle(title);
    setEditId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const editTask = async (data: any) => {
    editTasks.mutate(data);
  };

  const editTasks = useMutation({
    mutationFn: async (data: any) => {
      const res = await editTaskInList(editId || null, data);
      let updateAssign = {
        byUser: localStorage.getItem("userId"),
        toUser: data.assignTo,
      };
      const res1 = await updateAssignTask(editId || null, updateAssign);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list"], exact: true });
      setIsModalOpen(false);
    },
  });

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={`p-2 bg-white shadow rounded mb-2 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex justify-between items-center content-center">
        <div>
          <p className={`${listTextColor(theme)} font-bold text-sm`}>
            {task.title
              ? task.title.replace(/\b\w/g, (char) => char.toUpperCase())
              : ""}
          </p>
          <p className={`${listTextColor(theme)} font-normal text-xs`}>
            {task.description}
          </p>
        </div>
        <div className="flex">
          {task.assignTo && (
            <span
              className="text-xs mx-2 bg-indigo-700 text-white rounded-4xl  px-2 py-1  focus:outline-none hover:bg-indigo-800"
              title={task.assignTo}
            >
              {task.assignTo.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="mx-1">
            <Button
              type="button"
              className="bg-indigo-700 border-0 py-1 px-1 focus:outline-none hover:bg-indigo-700 text-white rounded text-xs"
              icon={<MdModeEditOutline />}
              onClick={() => openModal(task.id, "Edit Task")}
            ></Button>
          </div>
          <div>
            <Button
              type="button"
              onClick={() => deleteBoardClicked(task.id)}
              className="bg-red-700 border-0 py-1 px-1 focus:outline-none hover:bg-red-700 text-white rounded text-xs"
              icon={<RiDeleteBin5Fill />}
            ></Button>
          </div>
        </div>
      </div>
      <Modal modalTitle={"Edit Task"} isOpen={isModalOpen} onClose={closeModal}>
        <AddTask
          onClose={() => setIsModalOpen(false)}
          isEdit={editId !== null}
          editId={editId}
          onSave={editTask}
          boardOwnerId={boardOwnerId}
        />
      </Modal>

      <DialogBox
        isOpen={isDeleteDialogOpen}
        onConfirm={deleteBoardConfirmed}
        onCancel={handleCancelDelete}
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
};
