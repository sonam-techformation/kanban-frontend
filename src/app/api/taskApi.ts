import { apiRequest } from "@/interceptor/interceptor";
import { Constants } from "@/utils/constant";

export const addNewTaskToList = async (listId: number, newTask: any) => {
  try {
    const response = await apiRequest(
      `${Constants.API_URL}/lists/${listId}/task`,
      "post",
      newTask
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteTaskFromList = async (id: number) => {
  try {
    const response = await apiRequest(
      `${Constants.API_URL}/tasks/${id}`,
      "delete"
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getTaskById = async (editId: number) => {
  try {
    const response = await apiRequest(
      `${Constants.API_URL}/tasks/${editId}`,
      "get"
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const moveTaskList = async (taskId: number, reorderData: any) => {
  try {
    // First get the current task to get the latest version
    const currentTask = await getTaskById(taskId);
    const response = await apiRequest(
      `${Constants.API_URL}/tasks/${taskId}/move`,
      "PATCH",
      {
        ...reorderData,
        version: currentTask.version, // Include current version
      }
    );
    return response;
  } catch (error: any) {
    if (error.response?.status === 409) {
      // Conflict - version mismatch
      const latestVersion = error.response.data?.currentVersion;
      console.log("Conflict detected. Latest version:", latestVersion);
      throw {
        ...error,
        isConflict: true,
        latestVersion,
      };
    }
    throw error;
  }
};
