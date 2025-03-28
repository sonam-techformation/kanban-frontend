import { apiRequest } from "@/interceptor/interceptor";
import { Constants } from "@/utils/constant";

export const getBoards = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await apiRequest(
      `${Constants.API_URL}/boards?page=${page}&limit=${limit}`,
      "get"
    );
    if (response.status === "error") return response.response.error;
    return {
      data: JSON.parse(JSON.stringify(response.response.boards)),
      pagination: JSON.parse(JSON.stringify(response.pagination)),
    };
  } catch (error: any) {
    throw error;
  }
};

export const createOrUpdateBoard = async (board: any, id?: number) => {
  try {
    const url = id
      ? `${Constants.API_URL}/boards/${id}`
      : `${Constants.API_URL}/boards`;
    const method = id ? "put" : "post";
    const response = await apiRequest(url, method, board);
    const parsedResponse = JSON.parse(JSON.stringify(response.response));
    return parsedResponse;
  } catch (error) {
    throw error;
  }
};

export const deleteBoard = async (id: number) => {
  try {
    const response = await apiRequest(
      `${Constants.API_URL}/boards/${id}`,
      "delete"
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getBoardDetail = async (id: number | null) => {
  try {
    const response = await apiRequest(
      `${Constants.API_URL}/boards/${id}`,
      "get"
    );
    return response;
  } catch (error) {
    throw error;
  }
};
