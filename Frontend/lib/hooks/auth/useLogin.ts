import { useMutation } from "@tanstack/react-query";
import { User } from "@/types";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  user: User;
  message: string;
};

type ErrorResponse = {
  message: string;
};

export function useLogin() {
  return useMutation<LoginResponse, AxiosError<ErrorResponse>, LoginPayload>({
    mutationFn: async ({ email, password }) => {
      const res = await axiosInstance.post("/user/login", { email, password });
      if (res.status !== 200) {
        throw new Error(res.data?.message || "Login failed");
      }
      if (!res.data || !res.data.user) {
        throw new Error("Invalid response data");
      }
      console.log("User logged in:", res.data.user);

      return res.data;
    },
  });
}
