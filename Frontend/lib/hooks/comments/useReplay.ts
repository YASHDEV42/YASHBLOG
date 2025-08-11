import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Comment } from "@/types";

export const useReplay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      commentId: string;
      content: string;
    }): Promise<Comment> => {
      const { data: response } = await axiosInstance.post(
        `/comment/reply/${data.commentId}`,
        { content: data.content }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};
