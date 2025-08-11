import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { UserProfile } from "./useUserProfile";

export interface UpdateUserProfilePayload {
  name?: string;
  bio?: string;
  profilePicture?: string;
}

export function useUpdateUserProfile() {
  const qc = useQueryClient();

  return useMutation<UserProfile, AxiosError, UpdateUserProfilePayload>({
    mutationFn: async (payload) => {
      const res = await axiosInstance.put("/user/profile", payload);
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(["userProfile"], data);
      qc.setQueryData(["currentUser"], { user: data });
    },
  });
}
