import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Post, CompletePost, User } from "@/types";

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string): Promise<Post> => {
      const { data } = await axiosInstance.put(`/post/${slug}/like`);
      return data.post;
    },
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(
        ["post", updatedPost.slug],
        (oldPost: CompletePost | undefined) => {
          if (!oldPost) {
            queryClient.invalidateQueries({
              queryKey: ["post", updatedPost.slug],
            });
            return oldPost;
          }

          const updatedLikes: User[] = updatedPost.likes.map((likeId) => {
            const existingLike = oldPost.likes.find(
              (like) => like._id === likeId
            );
            if (existingLike) {
              return existingLike;
            }
            return { _id: likeId, name: "Loading...", email: "" } as User;
          });

          return {
            ...oldPost,
            likes: updatedLikes,
            metadata: {
              ...oldPost.metadata,
              likes: updatedPost.metadata.likes,
            },
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
