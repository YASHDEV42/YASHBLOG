import { Post, public_users } from "@prisma/client";

export type PostWithAuthor = Post & {
  author: public_users;
};
