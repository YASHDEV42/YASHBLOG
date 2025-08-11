import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Post } from "@/types";

export const useTogglePublishStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string): Promise<Post> => {
      const { data } = await axiosInstance.put(`/post/${slug}/publish`);
      return data.post;
    },
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", updatedPost.slug] });
    },
  });
};
