import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
export const useCommentByPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { postId: string }) => {
      const { data: response } = await axiosInstance.get(
        `/comment/${data.postId}`
      );
      return response.comments;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};
