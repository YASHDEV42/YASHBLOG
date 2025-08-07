// lib/axios.js (or wherever you put it)
import axios from "axios";
import store from "@/redux/store";
import { clearUser } from "@/redux/slices/userSlice";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Handle 401 - Unauthorized (e.g. expired token)
    if (status === 401) {
      store.dispatch(clearUser());

      if (typeof window !== "undefined") {
        const publicPaths = ["/", "/login", "/signup", "/explore"];
        const currentPath = window.location.pathname;

        if (!publicPaths.includes(currentPath)) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
