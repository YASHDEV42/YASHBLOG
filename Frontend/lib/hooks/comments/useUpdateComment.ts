import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Comment } from "@/types";

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      commentId: string;
      content: string;
    }): Promise<Comment> => {
      const { data: response } = await axiosInstance.put(
        `/comment/${data.commentId}`,
        { content: data.content }
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};
