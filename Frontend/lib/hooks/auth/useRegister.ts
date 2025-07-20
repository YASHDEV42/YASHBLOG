import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { User } from "@/types";

type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};
type RegisterResponse = {
  user: User;
  message: string;
};
export function useRegister() {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: async ({ name, email, password }) => {
      const res = await axiosInstance.post("/user/register", {
        name,
        email,
        password,
      });
      return res.data;
    },
  });
}
