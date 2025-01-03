import { redirect } from "next/navigation";
import { PostContent } from "./components/post-content";
import prisma from "@/lib/db";
import { AuthorPosts } from "./components/author-posts";
import { PostData } from "../page";
export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post: PostData = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true, metadata: true },
  });
  const authorPosts = await prisma.post.findMany({
    where: { authorId: post.authorId },
    include: { author: true, metadata: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  if (!post) {
    redirect("/");
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <PostContent post={post} />
      <AuthorPosts posts={authorPosts} />
    </article>
  );
}
