"use client";
import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "../api/interceptor";
const API_URL = "http://localhost:3000";

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
  const router = useRouter();

  const onSubmit = async (data: any) => {
    onSave(data);
  };

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (isEdit) {
      let data = apiRequest(`${API_URL}/boards/${editId}`, "get");
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
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
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
              className=" bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              onClick={onSave}
            >
              Save
            </button>
          </div>
          <div className="mx-0.5">
            <button
              className=" bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
