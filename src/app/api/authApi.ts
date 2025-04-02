import { Constants } from "@/utils/constant";
import axios from "axios";
import Cookies from "js-cookie";

export const loginApi = async (data: any) => {
  try {
    const response = await axios.post(`${Constants.API_URL}/login`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const signup = async (register: any) => {
  try {
    const response = await axios.post(`${Constants.API_URL}/signup`, register);
    return response;
  } catch (error) {
    throw error;
  }
};
