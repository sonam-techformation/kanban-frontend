"use client";
import Navbar from "../../component/navbar";
import React, { Usable, useEffect, useState } from "react";
import { apiRequest } from "@/interceptor/interceptor";
import Modal from "@/app/component/modal";
import AddBoard from "@/app/component/addBoard";
import DraggableRow from "@/app/component/draggableRow";
import { useMutation, useQuery } from "@tanstack/react-query";
import Draggable from "@/app/component/draggable";
import queryClient from "@/lib/react-query";
import { Constants } from "@/utils/constant";
import { paramProps } from "@/types/param";

export default function List({ params }: paramProps) {
  const { id } = React.use(params as unknown as Usable<{ id: number }>);

  const {
    data: list,
    error,
    isLoading,
  } = useQuery<any[], Error>({
    queryKey: ["list"],
    queryFn: async () => {
      const response = await apiRequest(
        `${Constants.API_URL}/boards/${id}/lists`,
        "get"
      );
      const parsedResponse = JSON.parse(JSON.stringify(response.response));
      return parsedResponse;
    },
  });
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
  const addOrUpdateBoard = useMutation({
    mutationFn: async (newBoard: any) => {
      let newList: any = {
        name: newBoard.name,
        position:
          (list && list.length > 0 && +list[list.length - 1].position + 1) || 0,
      };
      const response = await apiRequest(
        `${Constants.API_URL}/boards/${id}/lists`,
        "post",
        newList
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list"], exact: true });
      setIsModalOpen(false);
    },
  });
  const addNewBoard = (newBoard: any) => {
    addOrUpdateBoard.mutate(newBoard); // Handle add or update of board
  };

  return (
    <>
      <div>
        <Navbar />
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Board List</h2>
            <button
              className="flex  text-white bg-indigo-500 border-0 py-2 px-3 focus:outline-none hover:bg-indigo-600 rounded text-xs"
              type="button"
              onClick={openModal}
            >
              Add List
            </button>
          </div>
          <Draggable initialData={list || []} />
        </div>
      </div>
      {/* <DraggableRow initialData={list || []} addTask={addTask} /> */}
      <Modal modalTitle={modalTitle} isOpen={isModalOpen} onClose={closeModal}>
        <AddBoard
          onClose={() => setIsModalOpen(false)}
          onSave={addNewBoard}
          isEdit={isEdit}
          editId={editId}
          labelName={"List Name"}
        />
      </Modal>
    </>
  );
}
