import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { PopulatedComment } from "@/types";

export const useCommentById = (commentId: string) => {
  return useQuery({
    queryKey: ["comment", commentId],
    queryFn: async (): Promise<PopulatedComment> => {
      const { data } = await axiosInstance.get(`/comment/single/${commentId}`); // Fixed route path
      return data;
    },
    enabled: !!commentId,
  });
};
