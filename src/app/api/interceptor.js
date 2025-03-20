import axios from "axios";

// Reusable function to create headers
const createHeaders = (token) => {
  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  } else {
    return {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};

// Create an Axios instance with interceptors
const api = axios.create();

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage or wherever it's stored
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Response error:", error.response.data);
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

export { createHeaders, apiRequest };
