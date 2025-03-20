"use client";
import { useRouter } from "next/router";
import Card from "../../component/card";
import Navbar from "../../navbar";
import React, { useEffect, useState } from "react";
import { apiRequest } from "@/app/api/interceptor";
import Modal from "@/app/component/modal";
import AddBoard from "@/app/component/addBoard";
import DraggableRow from "@/app/component/draggableRow";
const API_URL = `http://localhost:3000`;
interface paramProps {
  params: {
    id: number;
  };
}
export default function List({ params }: paramProps) {
  const [list, setList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Board List");

  const [board, setBoard] = useState([]);
  const [editId, setEditId] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const id = params.id;

  useEffect(() => {
    getList();
  }, []);

  async function getList() {
    try {
      let data = apiRequest(`${API_URL}/boards/${1}/lists`, "get");
      data
        .then((list) => {
          console.log(list);
          setList(list.response);
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addNewBoard = (newBoard: any) => {
    try {
      let data = apiRequest(`${API_URL}/boards/${id}/lists`, "post", newBoard);

      data
        .then((add) => {
          setIsModalOpen(false);
          getList();
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.error("Board error", error);
    }
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
      <DraggableRow
        items={list.map((item: any) => ({
          id: item.id,
          content: item.name,
          tasks: item.tasks,
        }))}
      />

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
