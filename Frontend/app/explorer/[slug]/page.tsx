import { redirect } from "next/navigation";
import { PostContent } from "./components/post-content";
import { prisma } from "@/Frontend/lib/db";
import { AuthorPosts } from "./components/author-posts";
import { PostData } from "../page";
import { createClient } from "@/Frontend/lib/server-supabase";
import { Comment, LikedPosts, User } from "@prisma/client";

export type CommentsWithUser = Comment & {
  user: User;
};
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const supabase = await createClient();

  const post: PostData | null = await prisma.post.findUnique({
    where: { slug },
    include: { author: true, metadata: true },
  });
  console.log("this is the post you entered: ", post);

  await prisma.post.update({
    where: { slug },
    data: {
      metadata: {
        update: {
          views: {
            increment: 1,
          },
        },
      },
    },
  });
  const user = (await supabase.auth.getUser()).data.user as User | null;

  const authorPosts = await prisma.post.findMany({
    where: { authorId: post?.authorId },
    include: { author: true, metadata: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  const ifLikedPost: LikedPosts | null = await prisma.likedPosts.findFirst({
    where: {
      userId: user?.id,
      postId: post?.id,
    },
  });

  if (!post) {
    redirect("/");
  }
  const comments: CommentsWithUser[] | [] = await prisma.comment.findMany({
    where: { postId: post.id },
    include: {
      user: true,
    },
  });
  console.log(comments);

  if (!user) {
    redirect("/login");
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <PostContent
        post={post}
        user={user}
        ifLikedPost={ifLikedPost}
        comments={comments}
      />
      <AuthorPosts posts={authorPosts} />
    </article>
  );
}
