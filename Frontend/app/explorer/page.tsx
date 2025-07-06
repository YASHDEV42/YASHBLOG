import { prisma } from "@/Frontend/lib/db";
import { Explorer } from "./components/explorer";
import { PostMetadata, Prisma } from "@prisma/client";
export type PostData = Prisma.PostGetPayload<{
  include: { author: true };
}> & {
  metadata: PostMetadata | null;
};
export default async function ExplorerPage() {
  const posts: PostData[] = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: true,
      metadata: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(posts);

  return (
    <div className="w-[80vw] mt-10 mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Blog Explorer</h1>
      {posts && <Explorer posts={posts} />}
    </div>
  );
}
