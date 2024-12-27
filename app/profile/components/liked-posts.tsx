import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LikedPosts() {
  const likedPosts = [
    {
      id: 1,
      title: "The Future of AI",
      author: "Jane Smith",
      excerpt: "Exploring the potential impact of artificial intelligence...",
    },
    {
      id: 2,
      title: "Mastering CSS Grid",
      author: "Alex Johnson",
      excerpt: "A comprehensive guide to using CSS Grid for modern layouts...",
    },
    {
      id: 3,
      title: "JavaScript Best Practices",
      author: "Emily Brown",
      excerpt:
        "Learn the best practices for writing clean and efficient JavaScript...",
    },
  ];

  return (
    <div className="space-y-4">
      {likedPosts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <p className="text-sm text-muted-foreground">By {post.author}</p>
          </CardHeader>
          <CardContent>
            <p>{post.excerpt}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
