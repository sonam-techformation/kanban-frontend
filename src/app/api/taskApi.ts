import { apiRequest } from "@/interceptor/interceptor";
import { Constants } from "@/utils/constant";

export const addNewTaskToList = async (listId:number, newTask:any)=>{
    const response = await apiRequest(
        `${Constants.API_URL}/lists/${listId}/task`,
        "post",
        newTask
      );
      return response.response
}

export const deleteTaskFromList = async (id:number)=>{
    const response = await apiRequest(
        `${Constants.API_URL}/tasks/${id}`,
        "delete"
      );
      return response;
}

export const getTaskById = async (editId:number)=>{
  const response = await apiRequest(`${Constants.API_URL}/tasks/${editId}`, "get");
  return response
}

export const moveTaskList = async (taskId:number, reorderData:any)=>{
    try {
        const response = await apiRequest(
          `${Constants.API_URL}/tasks/${taskId}/move`,
          "PATCH",
          reorderData
        );
        return response
      } catch (error) {
        console.log("Error moving task:", error);
      }
}