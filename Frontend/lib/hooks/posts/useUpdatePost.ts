import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Post } from "@/types";

interface UpdatePostRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  categories?: string[];
  published?: boolean;
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      slug,
      data,
    }: {
      slug: string;
      data: UpdatePostRequest;
    }): Promise<Post> => {
      const { data: response } = await axiosInstance.put(`/post/${slug}`, data);
      return response.post;
    },
    onSuccess: (_, { slug }) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", slug] });
    },
  });
};
