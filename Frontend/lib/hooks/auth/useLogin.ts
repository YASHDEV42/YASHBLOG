import { useMutation } from "@tanstack/react-query";
import { User } from "@/types";
import axiosInstance from "@/lib/axios";
type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  user: User;
  message: string;
};

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async ({ email, password }) => {
      const res = await axiosInstance.post("/user/login", { email, password });

      return res.data;
    },
  });
}
