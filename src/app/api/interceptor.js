import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create();

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("Response error:", error.response.data);
      if (error.response.status === 401) {
        console.log("Unauthorized, redirecting to login");
      }
    } else if (error.request) {
      console.error("Request error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);
const apiRequest = async (url, method = "GET", data = null) => {
  try {
    let response;

    switch (method.toUpperCase()) {
      case "GET":
        response = await api.get(url);
        break;
      case "POST":
        response = await api.post(url, data);
        break;
      case "PUT":
        response = await api.put(url, data);
        break;
      case "DELETE":
        response = await api.delete(url);
        break;
      case "PATCH":
        response = await api.patch(url, data);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export { apiRequest };
