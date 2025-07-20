import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Post } from "@/types";

const fetchPosts = async (): Promise<Post[]> => {
  const { data } = await axiosInstance.get("/post");
  return data.posts || [];
};

export const usePosts = () =>
  useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
