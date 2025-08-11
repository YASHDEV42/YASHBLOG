import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { UserProfile } from "./useUserProfile";
import { axiosInstance } from "@/lib/axios";

type CurrentUserResponse = { user: UserProfile | null };

export function useCurrentUser(enabled: boolean = true) {
  return useQuery<CurrentUserResponse, AxiosError>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/user/current");
      return res.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // reduce churn
    refetchOnWindowFocus: false,
  });
}
