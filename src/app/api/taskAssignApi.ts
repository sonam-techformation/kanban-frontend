import { apiRequest } from "@/interceptor/interceptor";
import { Constants } from "@/utils/constant";

export const getAllUser = async () => {
  try {
    const response = await apiRequest(`${Constants.API_URL}/users`, "get");
    return response;
  } catch (error) {
    console.log(error);
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
