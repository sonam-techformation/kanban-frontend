"use client";
import Navbar from "../../../components/navbar";
import React, { lazy, Suspense, Usable, useState } from "react";
import Modal from "@/app/components/modal";
import AddBoard from "@/app/components/addBoard";
import { useMutation, useQuery } from "@tanstack/react-query";
import Draggable from "@/app/components/draggable";
import queryClient from "@/lib/react-query";
import { paramProps } from "@/types/param";
import { addList, getList } from "@/app/api/listApi";
import { AiOutlinePlus } from "react-icons/ai";
import { bgColor, borderColor, secondaryBgColor } from "@/utils/color";
import { useTheme } from "next-themes";

const LazyChildComponent = lazy(() => import("../../../components/draggable"));
export default function List({ params }: paramProps) {
  const { id } = React.use(params as unknown as Usable<{ id: number }>);

  const {
    data: list,
    error,
    isLoading,
  } = useQuery<any[], Error>({
    queryKey: ["list"],
    queryFn: () => getList(id),
  });
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Board List");

  const [editId, setEditId] = useState(0);
  const [isEdit, setIsEdit] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Mutation to create or update a board
  const addNewListToBoard = useMutation({
    mutationFn: async (newBoard: any) => {
      let newList: any = {
        name: newBoard.name,
        position:
          (list && list.length > 0 && +list[list.length - 1].position + 1) || 0,
      };
      const response = await addList(id, newList);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list"], exact: true });
      setIsModalOpen(false);
    },
  });

  const addNewList = (newBoard: any) => {
    addNewListToBoard.mutate(newBoard); // Handle add or update of board
  };

  return (
    <>
      <div className={`min-h-screen  ${bgColor(theme)}`}>
        <div className="container px-4 sm:px-6 lg:px-8 py-5 mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold ">Board List</h2>
            <button
              className="flex  text-white bg-indigo-500 border-0 py-2 px-3 focus:outline-none hover:bg-indigo-600 rounded text-xs"
              type="button"
              onClick={openModal}
            >
              <div className="flex justify-center items-center">
                <AiOutlinePlus className="mr-2" />
                Add List
              </div>
            </button>
          </div>
          <div
            className={`${secondaryBgColor(theme)} border ${borderColor(
              theme
            )} rounded-lg p-5`}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <LazyChildComponent initialData={list || []} />
            </Suspense>
          </div>
        </div>
      </div>
      <Modal modalTitle={modalTitle} isOpen={isModalOpen} onClose={closeModal}>
        <AddBoard
          onClose={() => setIsModalOpen(false)}
          onSave={addNewList}
          isEdit={isEdit}
          editId={editId}
          labelName={"List Name"}
        />
      </Modal>
    </>
  );
}
