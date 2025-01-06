import { LikedPosts, Post, User } from "@prisma/client";

export type PostWithAuthor = Post & {
  author: User;
};
export type LikedPostsWithPostWithAuthor = LikedPosts & {
  Post: PostWithAuthor;
};
