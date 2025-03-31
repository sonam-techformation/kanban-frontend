"use client";
import React, { useEffect, useState } from "react";
import { FieldError, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { getAllUser, getTaskDetailById } from "../api/taskAssignApi";
import { useTheme } from "next-themes";
import Button from "./button";
import InputController from "./inputController";
import SelectController from "./selectController";

interface AddBoardProps {
  onClose: () => void;
  onSave: (data: any) => void;
  isEdit: Boolean;
  editId: number | null;
  boardOwnerId: number;
}

export default function AddTask({
  onClose,
  onSave,
  isEdit,
  editId,
  boardOwnerId,
}: AddBoardProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [user, setUsers] = useState([]);
  const { theme } = useTheme();
  const onSubmit = async (data: any) => {
    onSave(data);
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    const getAllUsers = async () => {
      const user = await getAllUser(boardOwnerId);
      setUsers(user.response);
    };

    getAllUsers();
  }, []);

  useEffect(() => {
    console.log(editId);
    if (editId) {
      const getTaskDetail = async () => {
        const user = await getTaskDetailById(editId);
        console.log("hjdsfsjfhsd", user, editId);
        setValue("title", user.response.title);
        setValue("description", user.response.description);
        setValue("assignTo", user.response.assignTo);
      };
      getTaskDetail();
    }
  }, [isEdit, editId]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <InputController
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            id="title"
            name="title"
            label={"Title"}
            control={control}
            type="text"
            placeholder="Enter title"
            required={true}
            rules={{
              required: "Title is required",
            }}
            error={errors.title as FieldError}
          ></InputController>
        </div>

        <div className="mb-4">
          <InputController
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            id="description"
            name="description"
            label={"Description"}
            control={control}
            type="text"
            placeholder="Enter description"
            required={true}
            rules={{
              required: "Description is required",
            }}
            error={errors.description as FieldError}
          ></InputController>
        </div>

        <div className="mb-4">
          <SelectController
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            id="assignTo"
            name="assignTo"
            label={"Assign To"}
            control={control}
            options={user}
            required={true}
            rules={{ required: "Assignment is required" }}
            error={errors.assignTo as FieldError}
          />
        </div>
        <div className="flex flex-1/2 justify-end">
          <div className="mx-0.5">
            <Button
              type="submit"
              className=" bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
              text="Save"
            ></Button>
          </div>
          <div className="mx-0.5">
            <Button
              type="button"
              className=" bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
              text="Cancel"
              onClick={handleClose}
            ></Button>
          </div>
        </div>
      </form>
    </div>
  );
}
