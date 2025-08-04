import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "@/types";
import axiosInstance from "@/lib/axios";
export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  categories?: string[];
  published?: boolean;
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostRequest): Promise<Post> => {
      const { data: response } = await axiosInstance.post("/post", data);
      return response.post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
