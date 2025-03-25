"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/interceptor/interceptor";
import { Constants } from "@/utils/constant";
import { getAllUser } from "../api/taskAssignApi";

interface AddBoardProps {
  onClose: () => void;
  onSave: (data: any) => void;
  isEdit: Boolean;
  editId: number | null;
}

export default function AddTask({
  onClose,
  onSave,
  isEdit,
  editId,
}: AddBoardProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [user, setUsers] = useState([]);

  const onSubmit = async (data: any) => {
    onSave(data);
  };

  const handleClose = () => {
    onClose();
  };

  // useEffect(() => {
  //   console.log(editId, "isEdit", isEdit);
  //   if (isEdit) {
  //     let data = apiRequest(`${Constants.API_URL}/tasks/${editId}`, "get");
  //     data
  //       .then((board) => {
  //         setValue("title", board.response.title);
  //         setValue("description", board.response.description);
  //       })
  //       .catch((error) => console.log(error));
  //   }
  // }, [editId]);

  useEffect(() => {
    const getAllUsers = async () => {
      const user = await getAllUser();
      setUsers(user.response);
    };

    getAllUsers();
  }, []);
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            {"Title"}
          </label>
          <input
            type="text"
            placeholder="Enter title"
            id="title"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="text-red-400 text-xs">
              {errors?.title!.message as string}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            {"Description"}
          </label>
          <input
            type="text"
            placeholder="Enter description"
            id="description"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <p className="text-red-400 text-xs">
              {errors?.description!.message as string}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="assignTo"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            {"Assign To"}
          </label>
          <select
            id="assignTo"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            {...register("assignTo", {
              required: "Assignment is required",
            })}
          >
            {user?.map((u: any) => {
              return (
                <option value={u.id} key={u.id}>
                  {u.firstname}
                </option>
              );
            })}
          </select>
          {errors.description && (
            <p className="text-red-400 text-xs">
              {errors?.description!.message as string}
            </p>
          )}
        </div>
        <div className="flex flex-1/2 justify-end">
          <div className="mx-0.5">
            <button
              className=" bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save
            </button>
          </div>
          <div className="mx-0.5">
            <button
              className=" bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
