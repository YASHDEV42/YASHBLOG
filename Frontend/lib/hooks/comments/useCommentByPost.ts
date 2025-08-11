import { useQuery } from "@tanstack/react-query";
import { PopulatedComment } from "@/types";
import { axiosInstance } from "@/lib/axios";

export const useCommentByPost = (postId: string) =>
  useQuery({
    queryKey: ["comments", postId],
    queryFn: async (): Promise<PopulatedComment[]> => {
      const { data: response } = await axiosInstance.get(
        `/comment/post/${postId}`
      );
      return response.comments || response;
    },
    enabled: !!postId,
  });
