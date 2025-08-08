import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { useAuth } from "./useAuth";

type RefreshAccessTokenResponse = { accessToken: string };
type ErrorResponse = { message: string };

export function useRefreshUser() {
  const { setAccessToken } = useAuth();

  return useMutation<
    RefreshAccessTokenResponse,
    AxiosError<ErrorResponse>,
    void
  >({
    mutationFn: async () => {
      // Silent refresh; server rotates refresh cookie
      const res = await axiosInstance.post(
        "/user/refresh",
        {},
        { withCredentials: true }
      );
      if (!res.data?.accessToken) {
        throw new Error("No access token in response");
      }
      return res.data;
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
    },
    onError: (error) => {
      console.error(
        "Failed to refresh access token:",
        error.response?.data?.message || error.message
      );
    },
  });
}
