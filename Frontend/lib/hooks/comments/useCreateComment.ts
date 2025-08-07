import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PopulatedComment } from "@/types";
import axiosInstance from "@/lib/axios";

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      postId: string;
      content: string;
      userId: string;
    }): Promise<PopulatedComment> => {
      const { data: response } = await axiosInstance.post(`/comment`, {
        content: data.content,
        postId: data.postId,
        userId: data.userId,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment"] });
    },
  });
};
