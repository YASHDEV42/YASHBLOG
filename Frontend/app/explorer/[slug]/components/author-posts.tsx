"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePosts } from "@/lib/hooks/posts/usePosts";
import { Post } from "@/types";

export function AuthorPosts({ slug }: { slug: string }) {
  const { posts, loading } = usePosts();
  const [authorPosts, setAuthorPosts] = useState<Post[]>([]);

  // Get the current post to find the author
  const currentPost = posts?.find((post: Post) => post.slug === slug);

  useEffect(() => {
    if (posts && posts.length > 0 && currentPost) {
      // Filter posts by the same author, excluding the current post
      const filteredPosts = posts.filter(
        (post) => post.author === currentPost.author && post.slug !== slug
      );
      setAuthorPosts(filteredPosts.slice(0, 4)); // Limit to 4 posts
    } else {
      setAuthorPosts([]);
    }
  }, [posts, currentPost, slug]);

  // Show loading state
  if (loading) {
    return (
      <div className="mt-8 w-[80vw] mx-auto">
        <h2 className="text-2xl font-bold mb-4">More from this author</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="h-full animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Don't show section if no author posts available
  if (!authorPosts || authorPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 w-[80vw] mx-auto">
      <h2 className="text-2xl font-bold mb-4">More from this author</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {authorPosts.map((post) => (
          <Link href={`/explorer/${post.slug}`} key={post._id}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  {post.excerpt.split(" ").length > 15
                    ? post.excerpt.split(" ").slice(0, 15).join(" ") + "..."
                    : post.excerpt}
                </p>
                <div className="mt-2 text-sm text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
