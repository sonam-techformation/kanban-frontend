import { apiRequest } from "@/interceptor/interceptor";
import { Constants } from "@/utils/constant";

export const getAllUser = async () => {
  const response = await apiRequest(`${Constants.API_URL}/users`, "get");
  return response;
};

export const assignTask = async (assignTo: any) => {
  const response = await apiRequest(
    `${Constants.API_URL}/assign`,
    "post",
    assignTo
  );
  return response;
};
