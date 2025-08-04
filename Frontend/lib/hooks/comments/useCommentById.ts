import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Comment } from "@/types";

export const useCommentById = (commentId: string) => {
  return useQuery({
    queryKey: ["comment", commentId],
    queryFn: async (): Promise<Comment> => {
      const { data } = await axiosInstance.get(`/comment/${commentId}`);
      return data;
    },
    enabled: !!commentId,
  });
};
