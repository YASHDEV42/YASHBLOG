import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Post } from "@/types";

const fetchMyPosts = async (): Promise<Post[]> => {
  const { data } = await axiosInstance.get("/post/author");
  return data.posts || [];
};

export const useMyPosts = () =>
  useQuery({
    queryKey: ["my-posts"],
    queryFn: fetchMyPosts,
  });
