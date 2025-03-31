import { apiRequest } from "@/interceptor/interceptor";
import { Constants } from "@/utils/constant";

export const getAllUser = async (boardOwnerId: number) => {
  try {
    const response = await apiRequest(
      `${Constants.API_URL}/users/${boardOwnerId}`,
      "get"
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const assignTask = async (assignTo: any) => {
  try {
    const response = await apiRequest(
      `${Constants.API_URL}/assign`,
      "post",
      assignTo
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateAssignTask = async (taskId: number | null, data: any) => {
  try {
    const response = await apiRequest(
      `${Constants.API_URL}/assign/${taskId}`,
      "put",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getTaskDetailById = async (id: number) => {
  try {
    const response = await apiRequest(
      `${Constants.API_URL}/tasks/${id}`,
      "get"
    );
    return response;
  } catch (error) {
    throw error;
  }
};
