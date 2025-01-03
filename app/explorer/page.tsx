import prisma from "@/lib/db";
import { Explorer } from "./components/explorer";
import { PostMetadata, Prisma } from "@prisma/client";
type PostWithAuthor = Prisma.PostGetPayload<{
  include: { author: true };
}>;
export type PostData = PostWithAuthor & {
  metadata: PostMetadata | null;
};
export default async function ExplorerPage() {
  const posts: PostData[] = await prisma.post.findMany({
    include: {
      author: true,
      metadata: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-[80vw] mt-10 mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Blog Explorer</h1>
      {posts && <Explorer posts={posts} />}
    </div>
  );
}
