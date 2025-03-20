"use client";
import Navbar from "../../navbar";
import React, { Usable, useEffect, useState } from "react";
import { apiRequest } from "@/app/api/interceptor";
import Modal from "@/app/component/modal";
import AddBoard from "@/app/component/addBoard";
import DraggableRow from "@/app/component/draggableRow";
import { useQuery } from "@tanstack/react-query";
const API_URL = `http://localhost:3000`;
interface paramProps {
  params: {
    id: number;
  };
}
export default function List({ params }: paramProps) {
  const { id } = React.use(params as unknown as Usable<{ id: number }>);

  const {
    data: list,
    error,
    isLoading,
  } = useQuery<any[], Error>({
    queryKey: ["list"], // Corrected queryKey usage
    queryFn: async () => {
      const response = await apiRequest(`${API_URL}/boards/${id}/lists`, "get");
      // Force the response to be a plain object using JSON methods
      console.log(response);
      const parsedResponse = JSON.parse(JSON.stringify(response.response)); // Ensure it's plain JSON data
      return parsedResponse;
    },
  });
  // const [list, setList] = useState([]);
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

  const addNewBoard = (newBoard: any) => {
    let newList: any = {
      name: newBoard.name,
      position:
        (list && list.length > 0 && +list[list.length - 1].position + 1) || 0,
    };

    console.log(newList);
    try {
      if (newList) {
        let data = apiRequest(`${API_URL}/boards/${id}/lists`, "post", newList);

        data
          .then((add) => {
            setIsModalOpen(false);
          })
          .catch((error) => console.log(error));
      }
    } catch (error) {
      console.error("Board error", error);
    }
  };

  const addTask = () => {
    console.log("clicked");
  };

  return (
    <>
      <div>
        <Navbar />
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h2>Board List</h2>
            <button
              className="flex  text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
              type="button"
              onClick={openModal}
            >
              Add List
            </button>
          </div>
        </div>
      </div>
      <DraggableRow initialData={list || []} addTask={addTask} />
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
