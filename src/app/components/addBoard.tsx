"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { apiRequest } from "@/interceptor/interceptor";
import { Constants } from "@/utils/constant";
import { useTheme } from "next-themes";

interface AddBoardProps {
  onClose: () => void;
  onSave: (data: any) => void;
  isEdit: Boolean;
  editId: number | null;
  labelName: string;
}

export default function AddBoard({
  onClose,
  onSave,
  isEdit,
  editId,
  labelName,
}: AddBoardProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { theme } = useTheme();
  const onSubmit = async (data: any) => {
    onSave(data);
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (isEdit) {
      let data = apiRequest(`${Constants.API_URL}/boards/${editId}`, "get");
      data
        .then((board) => {
          setValue("name", board.response.name);
        })
        .catch((error) => console.log(error));
    }
  }, []);
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="name" className="block  text-sm font-bold mb-2">
            {labelName}
          </label>
          <input
            type="text"
            placeholder="Enter name"
            id="name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            {...register("name", { required: "Name is required" })}
          />
          {errors.firstname && (
            <p className="text-red-400 text-xs">
              {errors?.firstname!.message as string}
            </p>
          )}
        </div>
        <div className="flex flex-1/2 justify-end">
          <div className="mx-0.5">
            <button
              className=" bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              onClick={onSave}
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
