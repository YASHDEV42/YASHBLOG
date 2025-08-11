import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  posts?: Array<{
    _id: string;
    title: string;
    createdAt: string;
    slug?: string;
  }>;
  followers?: Array<{ _id: string; name: string }>;
  following?: Array<{ _id: string; name: string }>;
  createdAt?: string;
  updatedAt?: string;
}

export function useUserProfile(enabled: boolean = true) {
  return useQuery<UserProfile, AxiosError>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await axiosInstance.get("/user/profile");
      return res.data;
    },
    enabled,
    staleTime: 60_000,
  });
}
