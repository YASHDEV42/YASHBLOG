import { prisma } from "@/Frontend/lib/db";
import BlogPostEditor from "./components/BlogPostEditor";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const postId = (await params).id;
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      metadata: true,
    },
  });
  if (!post) {
    return null;
  }

  return <BlogPostEditor id={postId} initialData={post} />;
}
