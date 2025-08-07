import axios from "axios";
import store from "@/redux/store";
import { clearUser } from "@/redux/slices/userSlice";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on token expiration
      store.dispatch(clearUser());

      // Only redirect if not already on login or signup pages
      const currentPath = window.location.pathname;
      if (
        currentPath !== "/login" &&
        currentPath !== "/signup" &&
        currentPath !== "/" &&
        currentPath !== "/explore"
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
