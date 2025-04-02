"use client";
import React, { useEffect } from "react";
import { FieldError, useForm } from "react-hook-form";
import { apiRequest } from "@/interceptor/interceptor";
import { Constants } from "@/utils/constant";
import { useTheme } from "next-themes";
import Button from "./button";
import InputController from "./inputController";

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
    control,
    formState: { errors },
  } = useForm();
  const { theme } = useTheme();
  const onSubmit = async (data: any) => {
    console.log(data);
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
  }, [isEdit, editId]);
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <InputController
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            id="name"
            name="name"
            label={labelName}
            control={control}
            type="text"
            placeholder="Enter name"
            required={true}
            rules={{
              required: "Name is required",
            }}
            error={errors.name as FieldError}
          ></InputController>
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
