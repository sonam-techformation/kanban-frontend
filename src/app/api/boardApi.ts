import { apiRequest } from "@/interceptor/interceptor";
import { Constants } from "@/utils/constant";

export const getBoards = async (page: number = 1, limit: number = 10) => {
  const response = await apiRequest(
    `${Constants.API_URL}/boards?page=${page}&limit=${limit}`,
    "get"
  );
  const parsedResponse = JSON.parse(JSON.stringify(response.response)); // Ensure it's plain JSON data
  return parsedResponse;
};

export const createOrUpdateBoard = async (board: any, id?: number) => {
  const url = id
    ? `${Constants.API_URL}/boards/${id}`
    : `${Constants.API_URL}/boards`;
  const method = id ? "put" : "post";
  const response = await apiRequest(url, method, board);
  const parsedResponse = JSON.parse(JSON.stringify(response.response));
  return parsedResponse;
};

export const deleteBoard = async (id: number) => {
  const response = await apiRequest(
    `${Constants.API_URL}/boards/${id}`,
    "delete"
  );
  return response;
};

export const getBoardDetail = async (id: number | null) => {
  const response = await apiRequest(`${Constants.API_URL}/boards/${id}`, "get");
  return response;
};
