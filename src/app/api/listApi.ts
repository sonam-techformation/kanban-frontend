import { apiRequest } from "@/interceptor/interceptor";
import { Constants } from "@/utils/constant";

export const getList = async (id: number) => {
  const response = await apiRequest(
    `${Constants.API_URL}/boards/${id}/lists`,
    "get"
  );
  const parsedResponse = JSON.parse(JSON.stringify(response.response));
  return parsedResponse;
};

export const addList = async (id: number, newList: any) => {
  const response = await apiRequest(
    `${Constants.API_URL}/boards/${id}/lists`,
    "post",
    newList
  );
  return response;
};

export const reOrderList = async (boardId:number, listOrder:any[])=>{
   try {
        const response = apiRequest(
          `${Constants.API_URL}/boards/${boardId}/lists/order`,
          "patch",
          { listOrder } as any

        );
        return response
      } catch (error) {
        console.log(error);
      }
}

