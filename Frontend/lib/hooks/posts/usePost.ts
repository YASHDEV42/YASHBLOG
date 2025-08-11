import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { CompletePost } from "@/types";
const fetchPost = async (slug: string): Promise<CompletePost> => {
  const { data } = await axiosInstance.get(`/post/${slug}`);
  console.log("Fetched post:", data);
  const post: CompletePost = {
    ...data,
  };
  console.log("Processed post:", post);
  return post;
};

export const usePost = (slug: string) =>
  useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
    enabled: !!slug,
    refetchOnWindowFocus: false, // Prevent refetch when switching tabs
    refetchOnMount: false, // Prevent refetch on component mount if data exists
    staleTime: 5 * 60 * 1000,
  });
