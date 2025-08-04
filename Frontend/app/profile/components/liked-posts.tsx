"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CompletePost } from "@/types";
import Link from "next/link";
import { Heart, Loader2, User, Calendar, BookOpen } from "lucide-react";
import { useToggleLike } from "@/lib/hooks/posts/useToggleLike";
import { toast } from "sonner";

export default function LikedPosts({
  postsLiked,
}: {
  postsLiked: CompletePost[];
}) {
  console.log("Liked Posts:", postsLiked);
  const [isLoading, setIsLoading] = useState(false);
  const [unlikingPost, setUnlikingPost] = useState<string | null>(null);
  const { mutate: toggleLike } = useToggleLike();

  const handleUnlike = async (postSlug: string) => {
    setIsLoading(true);
    setUnlikingPost(postSlug);

    toggleLike(postSlug, {
      onSuccess: () => {
        toast.success("Post unliked successfully!");
      },
      onError: () => {
        toast.error("Failed to unlike post");
      },
      onSettled: () => {
        setIsLoading(false);
        setUnlikingPost(null);
      },
    });
  };

  // Enhanced loading state
  if (isLoading && !unlikingPost) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <Heart className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground animate-pulse">
          Loading your liked posts...
        </p>
      </div>
    );
  }

  // Enhanced empty state
  if (!postsLiked || postsLiked.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center">
        <div className="relative">
          <div className="w-24 h-24  rounded-full flex items-center justify-center">
            <Heart className="h-12 w-12 text-pink-400" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            No liked posts yet
          </h3>
          <p className="text-muted-foreground max-w-md">
            Start exploring and liking posts to see them here. Your favorite
            content will be saved for easy access.
          </p>
        </div>
        <Button asChild className="mt-4">
          <Link href="/explorer">
            <BookOpen className="h-4 w-4 mr-2" />
            Explore Posts
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-screen">
      {/* Header with count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg">
            <Heart className="h-5 w-5 text-pink-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Liked Posts</h2>
            <p className="text-muted-foreground">
              {postsLiked.length} post{postsLiked.length !== 1 ? "s" : ""} you
              have liked
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {postsLiked.length}
        </Badge>
      </div>

      {/* Posts grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {postsLiked.map((post) => (
          <Card
            key={post._id}
            className="group relative overflow-hidden border-0  hover:scale-105 hover:shadow-md transition-all duration-200"
          >
            <Link
              href={`/explorer/${post.slug}`}
              className="block relative z-10"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold line-clamp-2  transition-colors duration-200">
                    {post.title}
                  </CardTitle>
                </div>

                {/* Author info */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>{post.author?.name || "Unknown"}</span>
                  {post.createdAt && (
                    <>
                      <span>•</span>
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                  {post.excerpt || "No excerpt available."}
                </p>
              </CardContent>
            </Link>

            {/* Unlike button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 z-20 h-8 w-8 p-0 rounded-full backdrop-blur-sm hover:bg-accent hover:scale-110 transition-all duration-200 shadow-sm cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleUnlike(post.slug);
              }}
              disabled={unlikingPost === post.slug}
            >
              {unlikingPost === post.slug ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <Heart className="h-4 w-4 fill-red-500 text-red-500 hover:scale-110 transition-transform duration-200" />
              )}
            </Button>

            {/* Liked indicator */}
            <div className="absolute bottom-3 right-3 z-10">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground backdrop-blur-sm rounded-full px-2 py-1">
                <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                <span>Liked</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
