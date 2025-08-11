import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

export function useLogout() {
  return useMutation<{ message: string }, Error, void>({
    mutationFn: async () => {
      const res = await axiosInstance.post("/user/logout");
      return res.data;
    },
    onSuccess: () => {
      delete axiosInstance.defaults.headers.common["Authorization"];
    },
  });
}
