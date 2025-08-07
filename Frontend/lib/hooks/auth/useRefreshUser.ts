import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

export function useRefreshUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/user/profile");
      return res.data.user;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
