"use client";
import React, { lazy, Suspense, useState } from "react";
import Modal from "@/app/components/modal";
import AddBoard from "@/app/components/addBoard";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "@/lib/react-query";
import { addList, getList } from "@/app/api/listApi";
import { AiOutlinePlus } from "react-icons/ai";
import { bgColor, borderColor, secondaryBgColor } from "@/utils/color";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";
import Button from "@/app/components/button";

const LazyChildComponent = lazy(() => import("../../../components/draggable"));
interface PageProps {
  id: string;
}
export default function ListDetail({ id }: PageProps) {
  const router = useRouter();
  const {
    data: list,
    error,
    isLoading,
    isError,
  } = useQuery<any[], Error>({
    queryKey: ["list"],
    queryFn: () => getList(+id),
    staleTime: 0,
    retry: false,
  });
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle] = useState("Add Board List");

  const [editId] = useState(0);
  const [isEdit] = useState(false);

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
      const response = await addList(+id, newList);
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
            <div className="flex">
              <div className="mr-2">
                <Button
                  type="button"
                  onClick={openModal}
                  className="flex  text-white bg-indigo-500 border-0 py-2 px-3 focus:outline-none hover:bg-indigo-600 rounded text-xs"
                  text="Add List"
                  icon={<AiOutlinePlus />}
                ></Button>
              </div>
              <div className="mr-2">
                <Button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="flex text-white bg-indigo-500 border-0 py-2 px-3 focus:outline-none hover:bg-indigo-600 rounded text-xs"
                  text="Back"
                  icon={<MdArrowBack />}
                ></Button>
              </div>
            </div>
            {isError && "Error loading Board List"}
          </div>
          <span className="text-sm font-bold mb-10">
            Board's Name :
            {list &&
              (list[0]?.board.name
                ? " " +
                  list[0]?.board.name.replace(/\b\w/g, (char: string) =>
                    char.toUpperCase()
                  )
                : "No Record Found")}
          </span>
          <div
            className={`${secondaryBgColor(theme)} border ${borderColor(
              theme
            )} rounded-lg p-5`}
          >
            {isLoading && "Loading..."}
            <Suspense>
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
