"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { apiRequest } from "../app/api/interceptor";
import { Boards } from "@/types/board";

// Define the function to fetch boards
const fetchBoards = () => {};

// Create a context for the boards
const BoardContext = createContext<any>(null);

// BoardContextProvider that will wrap the app
export const BoardContextProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: boards,
    isLoading,
    error,
  }: UseQueryResult<Boards[], Error> = useQuery({
    queryKey: ["boards"],
    queryFn: fetchBoards,
  });

  return (
    <BoardContext.Provider value={{ boards, isLoading, error }}>
      {children}
    </BoardContext.Provider>
  );
};

// Custom hook to access the context
export const useBoards = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error("useBoards must be used within a BoardContextProvider");
  }
  return context;
};
