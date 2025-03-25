"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Board from "../components/board";
import Modal from "../components/modal";
import AddBoard from "../components/addBoard";
import { Boards } from "@/types/board";
import { Key, useState } from "react";
import { createOrUpdateBoard, deleteBoard, getBoards } from "../api/boardApi";
import { useApiMutation } from "@/lib/useApiMutation";
import { AiOutlinePlus } from "react-icons/ai";
import { useTheme } from "next-themes";
import { bgColor, secondaryBgColor } from "@/utils/color";
import { Pagination } from "../components/pagination";
interface BoardsResponse {
  data: Boards[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    // other pagination fields
  };
}

// Assuming these types exist in your codebase
interface Board {
  id?: number;
  // other board properties
}

interface ApiResponse {
  data: Board | Board[];
  pagination?: any; // Replace with proper pagination type if available
}
export default function Dashboard() {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Board");
  const [editId, setEditId] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  // Fetch the boards using React Query
  const {
    data: boards,
    error,
    isLoading,
  } = useQuery<BoardsResponse, Error>({
    queryKey: ["boards", pagination.page, pagination.limit], // Corrected queryKey usage
    queryFn: async () => getBoards(pagination.page, pagination.limit),
  });

  // Add this interface at the top of your file
  interface MutationContext {
    previousBoards: BoardsResponse | undefined;
  }

  // For addOrUpdateBoard mutation
  const addOrUpdateBoard = useMutation<Board, Error, Board, MutationContext>({
    mutationFn: async (newBoard: Board) => {
      return await createOrUpdateBoard(newBoard, editId || undefined);
    },
    onMutate: async (newBoard) => {
      await queryClient.cancelQueries({
        queryKey: ["boards", pagination.page, pagination.limit],
      });

      const previousBoards = queryClient.getQueryData<BoardsResponse>([
        "boards",
        pagination.page,
        pagination.limit,
      ]);

      if (previousBoards) {
        if (editId) {
          queryClient.setQueryData<BoardsResponse>(
            ["boards", pagination.page, pagination.limit],
            {
              ...previousBoards,
              data: previousBoards.data.map((board) =>
                board.id === editId ? { ...board, ...newBoard } : board
              ),
            }
          );
        } else {
          queryClient.invalidateQueries({ queryKey: ["boards"] });
        }
      }

      return { previousBoards };
    },
    onError: (err, newBoard, context) => {
      if (context?.previousBoards) {
        queryClient.setQueryData(
          ["boards", pagination.page, pagination.limit],
          context.previousBoards
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["boards", pagination.page, pagination.limit],
      });
      setIsModalOpen(false);
    },
  });

  // For deleteBoardMutation
  const deleteBoardMutation = useMutation<void, Error, number, MutationContext>(
    {
      mutationFn: (id: number) => deleteBoard(id),
      onMutate: async (id) => {
        await queryClient.cancelQueries({
          queryKey: ["boards", pagination.page, pagination.limit],
        });

        const previousBoards = queryClient.getQueryData<BoardsResponse>([
          "boards",
        ]);

        if (previousBoards) {
          queryClient.setQueryData<BoardsResponse>(
            ["boards", pagination.page, pagination.limit],
            {
              ...previousBoards,
              data: previousBoards.data.filter((board) => board.id !== id),
              pagination: {
                ...previousBoards.pagination,
                totalItems: previousBoards.pagination.totalItems - 1,
                totalPages: Math.ceil(
                  (previousBoards.pagination.totalItems - 1) /
                    previousBoards.pagination.limit
                ),
              },
            }
          );
        }

        return { previousBoards };
      },
      onError: (err, id, context) => {
        if (context?.previousBoards) {
          queryClient.setQueryData(
            ["boards", pagination.page, pagination.limit],
            context.previousBoards
          );
        }
      },
      onSettled: () => {
        queryClient
          .invalidateQueries({
            queryKey: ["boards", pagination.page, pagination.limit],
          })
          .then(() => {
            if (
              boards?.pagination &&
              boards.data.length === 1 &&
              pagination.page > 1
            ) {
              setPagination((prev) => ({
                ...prev,
                page: Math.max(prev.page - 1, 1),
              }));
            }
          });
      },
    }
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
    console.log(newBoard);
    addOrUpdateBoard.mutate(newBoard); // Handle add or update of board
  };

  const editBoard = (id: number) => {
    openModal(id, "Edit Board");
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
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
          <div>
            <div
              className={`flex flex-wrap rounded-lg shadow-lg p-6 ${secondaryBgColor(
                theme
              )}`}
            >
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                boards?.data.map((board) => (
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
            <div>
              {boards?.pagination && (
                <Pagination
                  totalItems={boards.pagination.totalItems}
                  limit={boards.pagination.limit}
                  currentPage={boards.pagination.page}
                  totalPages={boards.pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
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
