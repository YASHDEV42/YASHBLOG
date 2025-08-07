import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PopulatedComment } from "@/types";
import axiosInstance from "@/lib/axios";

export const useCommentByPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      postId: string;
    }): Promise<PopulatedComment[]> => {
      const { data: response } = await axiosInstance.get(
        `/comment/post/${data.postId}` // Updated route path
      );
      return response.comments || response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};
