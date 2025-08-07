"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePosts } from "@/lib/hooks/posts/usePosts";
import { usePost } from "@/lib/hooks/posts/usePost";
import { CompletePost } from "@/types";
import { Heart, Calendar, User } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { PostViewsDisplay } from "@/components/PostViewsDisplay";

export function AuthorPosts({ slug }: { slug: string }) {
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: currentPost, isLoading: postLoading } = usePost(slug);
  const [authorPosts, setAuthorPosts] = useState<CompletePost[]>([]);

  useEffect(() => {
    if (posts && posts.length > 0 && currentPost) {
      const filteredPosts = posts.filter((post) => {
        const postAuthorId =
          typeof post.author === "object" ? post.author._id : post.author;
        const currentAuthorId =
          typeof currentPost.author === "object"
            ? currentPost.author._id
            : currentPost.author;

        return postAuthorId === currentAuthorId && post.slug !== slug;
      });

      setAuthorPosts(filteredPosts.slice(0, 4)); // Limit to 4 posts
    } else {
      setAuthorPosts([]);
    }
  }, [posts, currentPost, slug]);

  const authorInfo =
    currentPost && typeof currentPost.author === "object"
      ? currentPost.author
      : null;

  const isLoading = postsLoading || postLoading;

  if (isLoading) {
    return (
      <div className="mt-8 w-full max-w-[90vw] md:max-w-[80vw] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
          <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="h-full animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!authorPosts || authorPosts.length === 0 || !currentPost) {
    return null;
  }

  return (
    <div className="mt-8 w-full max-w-[90vw] md:max-w-[80vw] mx-auto">
      {/* Enhanced Header with Author Info */}
      <div className="flex items-center gap-3 mb-6">
        {authorInfo ? (
          <>
            <UserAvatar
              user={{
                name: authorInfo.name,
                profilePicture: authorInfo.profilePicture,
              }}
              size="md"
            />
            <div>
              <h2 className="text-2xl font-bold">
                More from {authorInfo.name || "this author"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {authorPosts.length} more post
                {authorPosts.length !== 1 ? "s" : ""}
              </p>
            </div>
          </>
        ) : (
          <>
            <User className="w-8 h-8 text-muted-foreground" />
            <div>
              <h2 className="text-2xl font-bold">More from this author</h2>
              <p className="text-sm text-muted-foreground">
                {authorPosts.length} more post
                {authorPosts.length !== 1 ? "s" : ""}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Enhanced Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {authorPosts.map((post) => (
          <Link href={`/explorer/${post.slug}`} key={post._id}>
            <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  {post.published && (
                    <Badge variant="secondary" className="text-xs shrink-0">
                      Published
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <time dateTime={post.createdAt}>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Excerpt */}
                <p className="text-muted-foreground line-clamp-3 mb-4 text-sm leading-relaxed">
                  {post.excerpt && post.excerpt.split(" ").length > 15
                    ? post.excerpt.split(" ").slice(0, 15).join(" ") + "..."
                    : post.excerpt || "No excerpt available"}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-500" />
                      <span>{post.metadata?.likes || 0}</span>
                    </div>
                    <PostViewsDisplay views={post.metadata?.views} size="sm" />
                  </div>
                  {/* Categories */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="flex gap-1">
                      {post.categories.slice(0, 2).map((category, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs px-2 py-0"
                        >
                          {category}
                        </Badge>
                      ))}
                      {post.categories.length > 2 && (
                        <Badge variant="outline" className="text-xs px-2 py-0">
                          +{post.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {/* Link to Author's Profile */}
      {authorInfo && (
        <div className="mt-6 text-center">
          <Link
            href={`/author/${authorInfo._id}`}
            className="text-primary hover:underline text-sm font-medium"
          >
            View all posts by {authorInfo.name} →
          </Link>
        </div>
      )}
    </div>
  );
}
