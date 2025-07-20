"use client";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Calendar, Loader, Share2 } from "lucide-react";
import { Comments } from "./post-comments";
import { toast } from "sonner";
import { usePost } from "@/lib/hooks/posts/usePost";
import { useAuth } from "@/lib/hooks/auth/useAuth";
import Spinner from "@/components/Spinner";
import { useToggleLike } from "@/lib/hooks/posts/useToggleLike";

export function PostContent({ slug }: { slug: string }) {
  //hooks
  const { data: post, isLoading, error } = usePost(slug);
  const { user } = useAuth();
  const toggleLikeMutation = useToggleLike();
  //states
  const [localLikes, setLocalLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // Set initial likes and liked state based on post data
  useEffect(() => {
    if (post) {
      setLocalLikes(post.metadata.likes || 0);
      if (user && post.likes) {
        setIsLiked(post.likes.includes(user._id));
      }
    }
  }, [post, user]);

  // Function to handle sharing the post
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: url,
        });
        toast.success("sharing post!");
      } catch (error) {
        console.error("Error sharing:", error);
        toast.error("Failed to share the post");
      }
    } else {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          toast.success("Link copied to clipboard!");
        })
        .catch(() => {
          toast.error("Failed to copy link");
        });
    }
  };
  // Function to handle liking the post
  const handleLike = async () => {
    if (!user || !post) {
      toast.error("Please log in to like posts");
      return;
    }
    setLikeLoading(true);
    try {
      setLocalLikes((prev) => prev + 1);
      setIsLiked(true);

      const updatedPost = await toggleLikeMutation.mutateAsync(post.slug);
      if (updatedPost) {
        toast.success("Post liked successfully!");
      } else {
        setLocalLikes((prev) => prev - 1);
        setIsLiked(false);
        toast.error("Failed to like the post");
      }
    } catch (error) {
      console.error("Error liking the post:", error);
      toast.error("Failed to like the post");
      setLocalLikes((prev) => prev - 1);
      setIsLiked(false);
    } finally {
      setLikeLoading(false);
    }
  };

  // Function to handle unLiking the post
  const handleUnLike = async () => {
    if (!user || !post) {
      toast.error("Please log in to interact with posts");
      return;
    }

    setLikeLoading(true);
    try {
      // Optimistic update
      setLocalLikes((prev) => prev - 1);
      setIsLiked(false);

      const updatedPost = await toggleLikeMutation.mutateAsync(post.slug);
      if (updatedPost) {
        toast.success("Post unLiked successfully!");
      } else {
        // Revert on failure
        setLocalLikes((prev) => prev + 1);
        setIsLiked(true);
        toast.error("Failed to unlike the post");
      }
    } catch (error) {
      console.error("Error unLiking the post:", error);
      toast.error("Failed to unlike the post");
      // Revert on error
      setLocalLikes((prev) => prev + 1);
      setIsLiked(true);
    } finally {
      setLikeLoading(false);
    }
  };
  // Function to format date
  const formatDate = (dateString: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-[90vw] md:max-w-[80vw] mx-auto mt-10 flex justify-center">
        <Spinner />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full max-w-[90vw] md:max-w-[80vw] mx-auto mt-10">
        <Card>
          <CardContent className="text-center py-10">
            <p className="text-red-500 mb-4">
              Error loading post: {error.message || error.toString()}
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If post is not found, show a message
  if (!post) {
    return (
      <div className="w-full max-w-[90vw] md:max-w-[80vw] mx-auto mt-10">
        <Card>
          <CardContent className="text-center py-10">
            <p className="text-gray-500">Post not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Card className="w-full max-w-[90vw] md:max-w-[80vw] mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold mb-2">
            {post.title}
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              <span>{post.metadata.views || 0} views</span>
            </div>
            <div className="flex items-center space-x-2">
              {isLiked ? (
                <Button
                  variant="default"
                  size="sm"
                  className={`flex items-center ${
                    likeLoading ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  disabled={likeLoading}
                  onClick={handleUnLike}
                >
                  <Heart className="w-4 h-4 mr-1 fill-red-500 text-red-500" />
                  <span className="hidden sm:inline">
                    {likeLoading ? (
                      <Loader className="animate-spin inline" />
                    ) : (
                      localLikes
                    )}{" "}
                    likes
                  </span>
                  <span className="sm:hidden">{localLikes}</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center ${
                    likeLoading ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  disabled={likeLoading}
                  onClick={handleLike}
                >
                  <Heart
                    className={`w-4 h-4 mr-1 ${
                      localLikes > 0
                        ? "fill-red-500 text-red-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span className="hidden sm:inline">
                    {likeLoading ? (
                      <Loader className="animate-spin inline" />
                    ) : (
                      localLikes
                    )}{" "}
                    likes
                  </span>
                  <span className="sm:hidden">{localLikes}</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Avatar>
              <AvatarImage
                src={post?.author?.profilePicture || "Unknown Author"}
              />
              <AvatarFallback>
                {post.author.name.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">
                {post.author?.name || "Anonymous"}
              </p>
            </div>
          </div>
          <div
            className="editor max-w-none  text-background-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </CardContent>
      </Card>
      {user && (
        <Comments
          postId={post._id}
          initialComments={post.comments || []}
          currentUser={{
            name: user.name || null,
            id: user._id,
            email: user.email,
          }}
        />
      )}
    </>
  );
}
