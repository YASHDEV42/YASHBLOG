import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostData } from "../../page";

export function AuthorPosts({ posts }: { posts: PostData[] }) {
  return (
    <div className="mt-8 w-[80vw] mx-auto">
      <h2 className="text-2xl font-bold mb-4">More from this author</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Link href={`/explorer/${post.slug}`} key={post.id}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className=" text-muted-foreground">{post.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
