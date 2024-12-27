import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{post.excerpt}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
