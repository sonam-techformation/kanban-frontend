import { Constants } from "@/utils/constant";
import axios from "axios";
import Cookies from "js-cookie";

export const login = async (data: any) => {
  try {
    const response = await axios.post(`${Constants.API_URL}/login`, data);
    Cookies.set("token", response.data.token, { expires: 365 });
    Cookies.set("username", response.data.response.firstname);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const signup = async (register: any) => {
  try {
    const response = await axios.post(`${Constants.API_URL}/signup`, register);
    return response;
  } catch (error) {
    console.log(error);
  }
};
