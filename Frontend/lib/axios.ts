import axios from "axios";
import store from "@/redux/store";
import { clearUser } from "@/redux/slices/userSlice";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Add explicit cookie header handling for production
    ...(process.env.NODE_ENV === "production" && {
      "Access-Control-Allow-Credentials": "true",
    }),
  },
  timeout: 10000,
});

// Add request interceptor to log cookie issues
axiosInstance.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "production") {
      console.log("Request cookies:", document.cookie);
      console.log("Request URL:", config.url);
      console.log("WithCredentials:", config.withCredentials);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful cookie responses in production
    if (
      process.env.NODE_ENV === "production" &&
      response.headers["set-cookie"]
    ) {
      console.log(
        "Response set-cookie headers:",
        response.headers["set-cookie"]
      );
    }
    return response;
  },
  (error) => {
    // Log errors in production for debugging
    if (process.env.NODE_ENV === "production") {
      console.error("API Error:", {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        timestamp: new Date().toISOString(),
        cookies: document.cookie,
        responseHeaders: error.response?.headers,
      });
    }

    if (error.response?.status === 401) {
      // Auto logout on token expiration
      store.dispatch(clearUser());

      // Only redirect if we're in the browser (not during SSR)
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const publicPaths = ["/login", "/signup", "/", "/explore"];

        if (!publicPaths.includes(currentPath)) {
          window.location.href = "/login";
        }
      }
    }

    // Handle network errors in production
    if (!error.response && error.code === "ECONNABORTED") {
      console.error("Request timeout - check API connectivity");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
