import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { User } from "@/types";
import { AxiosError } from "axios";

type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};
type RegisterResponse = {
  user: User;
  accessToken: string;
};

type ErrorResponse = {
  message: string;
};

export function useRegister() {
  return useMutation<
    RegisterResponse,
    AxiosError<ErrorResponse>,
    RegisterRequest
  >({
    mutationFn: async ({ name, email, password }) => {
      const res = await axiosInstance.post("/user/register", {
        name,
        email,
        password,
      });
      if (!res.data?.user || !res.data?.accessToken) {
        throw new Error("Invalid response data");
      }
      return res.data;
    },
  });
}
