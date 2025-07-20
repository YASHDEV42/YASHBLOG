"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LikedPostsWithPostWithAuthor } from "@/types";
import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { unlikePost } from "@/actions/Posts";
import { useState } from "react";

export default function LikedPosts({
  likedPosts,
}: {
  likedPosts: LikedPostsWithPostWithAuthor[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const handleUnlike = async (postId: string, userId: string) => {
    setIsLoading(true);
    try {
      await unlikePost(postId, userId);
    } catch (error) {
      console.log("Error unliking post", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="text-center animate-spin" />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {likedPosts.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No liked posts found.
        </p>
      ) : (
        likedPosts.map((likedPost) => (
          <Card key={likedPost.userId + likedPost.postId} className="relative">
            <Link href={`/posts/${likedPost.postId}`} className="block">
              {likedPost.post ? (
                <>
                  <CardHeader>
                    <CardTitle>{likedPost.post.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      By {likedPost.post.author?.name || "Unknown"}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p>{likedPost.post.excerpt || "No excerpt available."}</p>
                  </CardContent>
                </>
              ) : (
                <CardContent>
                  <p>Post information is unavailable.</p>
                </CardContent>
              )}
            </Link>
            <Button
              variant="default"
              size="icon"
              className="absolute top-2 right-2 flex flex-row items-center space-x-1 w-24"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleUnlike(likedPost.postId, likedPost.userId);
              }}
            >
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              <span>Unlike</span>
            </Button>
          </Card>
        ))
      )}
    </div>
  );
}
