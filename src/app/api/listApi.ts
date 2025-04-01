import { apiRequest } from "@/interceptor/interceptor";
import { Constants } from "@/utils/constant";
import { debounce } from "lodash";
export const getList = async (id: number) => {
  try {
    const response = await apiRequest(
      `${Constants.API_URL}/boards/${id}/lists`,
      "get"
    );
    if (response.status === "error") return response.response.error;
    const parsedResponse = JSON.parse(JSON.stringify(response.response));
    return parsedResponse;
  } catch (error) {
    throw error;
  }
};

export const addList = async (id: number, newList: any) => {
  try {
    const response = await apiRequest(
      `${Constants.API_URL}/boards/${id}/lists`,
      "post",
      newList
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Create a debounced version of the function
export const debouncedReOrderList = debounce(
  async (boardId: number, listOrder: any[]) => {
    try {
      const response = await apiRequest(
        `${Constants.API_URL}/boards/${boardId}/lists/order`,
        "patch",
        { listOrder } as any
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  1000
);
