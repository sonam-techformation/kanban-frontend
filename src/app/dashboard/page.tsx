"use client";
// import axios from "axios";
// import Board from "../board";
// import Navbar from "../navbar";
// import { useEffect, useState } from "react";
// import { apiRequest } from "../api/interceptor";
// import Modal from "../component/modal";
// import AddBoard from "../component/addBoard";
// import { useQuery } from "@tanstack/react-query";
// import { Boards } from "@/types/board";
// const API_URL = "http://localhost:3000";
// export default function Dashboard() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalTitle, setModalTitle] = useState("Add Board");

//   const [board, setBoard] = useState([]);
//   const [editId, setEditId] = useState(0);
//   const [isEdit, setIsEdit] = useState(false);

//   const [name, setName] = useState("");

//   useEffect(() => {
//     let user = localStorage.getItem("username");
//     setName(user || "");
//     getBoards();
//   }, []);
//   async function getBoards() {
//     try {
//       let data = apiRequest(`${API_URL}/getBoards`, "get");
//       data
//         .then((board) => {
//           setBoard(board.response);
//         })
//         .catch((error) => console.log(error));
//     } catch (error) {
//       console.error("Registration failed:", error);
//     }
//   }
//   const openModal = () => {
//     console.log("open clicked");
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const addNewBoard = (newBoard: any) => {
//     try {
//       let data =
//         modalTitle === "Add Board"
//           ? apiRequest(`${API_URL}/createBoard`, "post", newBoard)
//           : apiRequest(`${API_URL}/updateBoard/${editId}`, "put", newBoard);
//       data
//         .then((add) => {
//           setIsModalOpen(false);
//           getBoards();
//         })
//         .catch((error) => console.log(error));
//     } catch (error) {
//       console.error("Board error", error);
//     }
//   };

//   const editBoard = (id: number) => {
//     setIsModalOpen(true);
//     setModalTitle("Edit Board");
//     setEditId(id);
//     setIsEdit(true);
//   };

//   const deleteBoard = (id: number) => {
//     console.log(id);
//     try {
//       let data = apiRequest(`${API_URL}/deleteBoard/${id}`, "delete");
//       data
//         .then((board) => {
//           setBoard((previous) => previous.filter((d: any) => d.id !== id));
//         })
//         .catch((error) => console.log(error));
//     } catch (error) {
//       console.error("Delete failed:", error);
//     }
//   };

//   return (
//     <>
//       <Navbar userName={name} />
//       <div className="container mx-auto p-4">
//         <div className="flex justify-between items-center mb-4">
//           <h2>Boards</h2>
//           <button
//             className="flex  text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
//             type="button"
//             onClick={openModal}
//           >
//             Create Board
//           </button>
//         </div>
//         <div className="flex flex-wrap">
//           {board.map((d: any, i: number) => {
//             return (
//               <div key={d.id}>
//                 <Board
//                   name={d.name}
//                   boardId={d.id}
//                   onEdit={() => editBoard(d.id)}
//                   onDelete={() => deleteBoard(d.id)}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       </div>
//       <Modal modalTitle={modalTitle} isOpen={isModalOpen} onClose={closeModal}>
//         <AddBoard
//           onClose={() => setIsModalOpen(false)}
//           onSave={addNewBoard}
//           isEdit={isEdit}
//           editId={editId}
//           labelName={"Board Name"}
//         />
//       </Modal>
//     </>
//   );
// }

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Board from "../components/board";
import Modal from "../components/modal";
import AddBoard from "../components/addBoard";
import { Boards } from "@/types/board";
import { useState } from "react";
import { createOrUpdateBoard, deleteBoard, getBoards } from "../api/boardApi";
import { useApiMutation } from "@/lib/useApiMutation";
import { AiOutlinePlus } from "react-icons/ai";
import { useTheme } from "next-themes";
import { bgColor, secondaryBgColor } from "@/utils/color";

export default function Dashboard() {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Board");
  const [editId, setEditId] = useState<number | null>(null);
  // Fetch the boards using React Query
  const {
    data: boards,
    error,
    isLoading,
  } = useQuery<Boards[], Error>({
    queryKey: ["boards"], // Corrected queryKey usage
    queryFn: async () => getBoards(1, 10),
  });

  // Mutation to create or update a board
  const addOrUpdateBoard = useMutation({
    mutationFn: async (newBoard: any) => {
      if (editId) {
        const response = createOrUpdateBoard(newBoard, editId || undefined);
        return response;
      } else {
        const response = createOrUpdateBoard(newBoard);
        return response;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"], exact: true });
      setIsModalOpen(false);
    },
  });
  // Mutation to delete a board
  const deleteBoardMutation = useApiMutation(
    (id: number) => deleteBoard(id),
    ["boards"]
  );

  // Modal handling
  const openModal = (id: number | null = null, title: string = "Add Board") => {
    setModalTitle(title);
    setEditId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addNewBoard = (newBoard: any) => {
    addOrUpdateBoard.mutate(newBoard); // Handle add or update of board
  };

  const editBoard = (id: number) => {
    openModal(id, "Edit Board");
  };

  return (
    <>
      <div className={`min-h-screen ${bgColor(theme)}`}>
        <div className="container px-4 sm:px-6 lg:px-8 py-5 mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Boards</h2>
            <button
              className="flex text-white bg-indigo-500 border-0 py-2 px-3 focus:outline-none hover:bg-indigo-600 rounded text-xs"
              type="button"
              onClick={() => openModal()}
            >
              <div className="flex justify-center items-center">
                <AiOutlinePlus className="mr-2" /> Create Board
              </div>
            </button>
          </div>
          <div
            className={`flex flex-wrap rounded-lg shadow-lg p-6 ${secondaryBgColor(
              theme
            )}`}
          >
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              boards?.map((board) => (
                <div key={board.id}>
                  <Board
                    name={board.name}
                    boardId={board.id}
                    onEdit={() => editBoard(board.id)}
                    onDelete={() => deleteBoardMutation.mutate(board.id)}
                  />
                </div>
              ))
            )}
          </div>
          <Modal
            modalTitle={modalTitle}
            isOpen={isModalOpen}
            onClose={closeModal}
          >
            <AddBoard
              onClose={closeModal}
              onSave={addNewBoard}
              isEdit={editId !== null}
              editId={editId}
              labelName={"Board Name"}
            />
          </Modal>
        </div>
      </div>
    </>
  );
}
