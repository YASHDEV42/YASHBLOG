import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function MyPosts() {
  const posts = [
    {
      id: 1,
      title: "My First Blog Post",
      excerpt: "This is a short excerpt of my first blog post...",
    },
    {
      id: 2,
      title: "React Hooks Explained",
      excerpt: "Learn about React Hooks and how to use them effectively...",
    },
    {
      id: 3,
      title: "Building with Next.js",
      excerpt: "Discover the power of Next.js for your web applications...",
    },
  ];

  return (
    <div className="space-y-4">
      {!posts ? (
        <h2 className="text-center font-bold lg:text-3xl md:text-2xl text-xl mt-8">
          You have no posts yet 😔
        </h2>
      ) : (
        posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{post.excerpt}</p>
            </CardContent>
          </Card>
        ))
      )}
      <Button>
        <Link
          href="/profile/create-post"
          className="flex items-center justify-center gap-1 "
        >
          <Plus />
          <span className="text-md">Create Post</span>
        </Link>
      </Button>
    </div>
  );
}
