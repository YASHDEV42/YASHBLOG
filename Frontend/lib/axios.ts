// lib/axios.js (or wherever you put it)
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// ---------------- In‑memory access token handling ----------------
let accessToken: string | null = null;

// this is a function to set the access token
export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
}

//this is a function to get the access token
export function getAccessToken() {
  return accessToken;
}

// ---------------- Refresh coordination (single flight) ------------
let refreshPromise: Promise<string> | null = null;
const refreshSubscribers: Array<(t: string) => void> = [];
const errorSubscribers: Array<(e: unknown) => void> = [];

function subscribeTokenRefresh(
  resolve: (t: string) => void,
  reject: (e: unknown) => void
) {
  refreshSubscribers.push(resolve);
  errorSubscribers.push(reject);
}

function notifyRefreshSuccess(token: string) {
  refreshSubscribers.splice(0).forEach((cb) => cb(token));
  errorSubscribers.splice(0);
}

function notifyRefreshError(err: unknown) {
  errorSubscribers.splice(0).forEach((cb) => cb(err));
  refreshSubscribers.splice(0);
}

// --------------- Perform refresh (single shared promise) ----------
async function performRefresh(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api") +
          "/user/refresh",
        {},
        { withCredentials: true }
      )
      .then((res) => {
        const newToken = res.data?.accessToken;
        if (!newToken) throw new Error("No access token in refresh response");
        setAccessToken(newToken);
        notifyRefreshSuccess(newToken);
        return newToken;
      })
      .catch((err) => {
        setAccessToken(null);
        notifyRefreshError(err);
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// ---------------- Request interceptor (attach token) --------------
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ---------------- Response interceptor (401 handling) -------------
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { __retry?: boolean })
      | undefined;

    // If no response or already retried or not 401 -> reject
    if (
      !original ||
      original.__retry ||
      !error.response ||
      error.response.status !== 401
    ) {
      return Promise.reject(error);
    }

    // Do not try to refresh for the refresh endpoint itself
    if (original.url?.includes("/user/refresh")) {
      return Promise.reject(error);
    }

    original.__retry = true;

    try {
      const newToken = await new Promise<string>(async (resolve, reject) => {
        subscribeTokenRefresh(resolve, reject);
        try {
          await performRefresh();
        } catch (e: unknown) {
          console.error("Token refresh failed:", e);
        }
      });

      // Token acquired, retry original request
      original.headers = original.headers || {};
      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(original);
    } catch (refreshErr) {
      // Final failure: propagate original 401
      return Promise.reject(refreshErr);
    }
  }
);
