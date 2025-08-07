"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Share2, Heart } from "lucide-react";
import { Comments } from "./post-comments";
import { toast } from "sonner";
import { usePost } from "@/lib/hooks/posts/usePost";
import { useAuth } from "@/lib/hooks/auth/useAuth";
import Spinner from "@/components/Spinner";
import { useToggleLike } from "@/lib/hooks/posts/useToggleLike";
import { PostViewsDisplay } from "@/components/PostViewsDisplay";
import { UserAvatar } from "@/components/UserAvatar";

export function PostContent({ slug }: { slug: string }) {
  //hooks
  const { data: post, isLoading, error } = usePost(slug);
  const { user } = useAuth();
  const { mutate: toggleLike } = useToggleLike();

  //local state
  const [localLikes, setLocalLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [loadingLike, setLoadingLike] = useState<boolean>(false);
  console.log("liked:", isLiked);
  useEffect(() => {
    if (post && user) {
      setLocalLikes(post.metadata?.likes || 0);
      // likes array contains User objects in PopulatedPost
      setIsLiked(post.likes.some((like) => like._id === user._id));
    } else if (post) {
      setLocalLikes(post.metadata?.likes || 0);
      setIsLiked(false);
    }
  }, [post, user]);
  const handleLike = () => {
    if (!user) {
      toast.error("You must be logged in to like a post");
      return;
    }

    setLoadingLike(true);

    // Optimistic update
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLocalLikes((prev) => (wasLiked ? prev - 1 : prev + 1));

    toggleLike(slug, {
      onSuccess: (updatedPost) => {
        // Update local state with backend values
        setLocalLikes(updatedPost.metadata.likes);
        setIsLiked(updatedPost.likes.includes(user._id));

        const action = updatedPost.likes.includes(user._id)
          ? "liked"
          : "unliked";
        toast.success(`Post ${action}!`);
      },
      onError: (error) => {
        // Revert optimistic update
        setIsLiked(wasLiked);
        setLocalLikes((prev) => (wasLiked ? prev + 1 : prev - 1));

        console.error("Error liking post:", error);
        toast.error("Failed to like post");
      },
      onSettled: () => {
        setLoadingLike(false);
      },
    });
  };

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
        toast.success("Post shared!");
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

  // Debug logging
  console.log("Post author data:", post.author);
  console.log("Profile picture:", post.author?.profilePicture);

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
            <PostViewsDisplay views={post.metadata?.views} />
            <div className="flex items-center space-x-2">
              {/* Static Like Button UI */}
              {isLiked ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors duration-200 shadow-none border-0 bg-background hover:bg-background cursor-pointer"
                  onClick={handleLike}
                  disabled={loadingLike}
                >
                  <Heart className="w-4 h-4" />
                  <span>{localLikes}</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-gray-500 transition-colors duration-200 shadow-none border-0 bg-background hover:bg-background cursor-pointer hover:text-red-600"
                  onClick={handleLike}
                  disabled={loadingLike}
                >
                  <Heart className="w-4 h-4" />
                  <span>{localLikes}</span>
                </Button>
              )}

              {/* Share Button remains active */}
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-gray-500 transition-colors duration-200 cursor-pointer"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Share</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <UserAvatar
              user={{
                name: post.author?.name || "Anonymous",
                profilePicture: post.author?.profilePicture,
              }}
              size="lg"
            />
            <div>
              <p className="font-semibold">
                {post.author?.name || "Anonymous"}
              </p>
            </div>
          </div>
          <div
            className="editor max-w-none text-foreground prose prose-lg dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </CardContent>
      </Card>
      {user && user._id && <Comments postId={post._id} />}
    </>
  );
}
