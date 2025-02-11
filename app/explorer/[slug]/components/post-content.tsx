"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Calendar, Loader, Share2 } from "lucide-react";
import { PostData } from "../../page";
import { LikedPosts, User } from "@prisma/client";
import { likePost, unlikePost } from "@/actions/Posts";
import { Comments } from "./post-comments";
import { CommentsWithUser } from "../page";
import { toast } from "sonner";

export function PostContent({
  post,
  user,
  ifLikedPost,
  comments,
}: {
  post: PostData;
  user: User;
  ifLikedPost: LikedPosts | null;
  comments: CommentsWithUser[] | [];
}) {
  const [likes, setLikes] = useState(post.metadata?.likes || 0);
  const [isLiked, setIsLiked] = useState(ifLikedPost ? true : false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
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
  const handleLike = async () => {
    setIsLoading(true);
    try {
      setLikes(likes + 1);
      const userId: string = user.id;
      await likePost(post.id, userId);
      setIsLiked(true);
      toast.success("Post liked successfully!");
    } catch (error) {
      console.error("Error liking the post:", error);
      toast.error("Failed to like the post");
      setLikes(likes - 1);
      setIsLiked(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnLike = async () => {
    setIsLoading(true);
    try {
      setLikes(likes - 1);
      const userId: string = user.id;
      await unlikePost(post.id, userId);
      setIsLiked(false);
      toast.success("Post unliked successfully!");
    } catch (error) {
      console.error("Error unliking the post:", error);
      toast.error("Failed to unlike the post");
      setLikes(likes + 1);
      setIsLiked(true);
    } finally {
      setIsLoading(false);
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
              <time dateTime={post.createdAt.toString()}>
                {formatDate(post.createdAt)}
              </time>
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              <span>{post.metadata?.views || 0} views</span>
            </div>
            <div className="flex items-center space-x-2">
              {isLiked ? (
                <Button
                  variant="default"
                  size="sm"
                  className={`flex items-center ${
                    isLoading ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  disabled={isLoading}
                  onClick={handleUnLike}
                >
                  <Heart className="w-4 h-4 mr-1 fill-red-500 text-red-500" />
                  <span className="hidden sm:inline">
                    {isLoading ? (
                      <Loader className="animate-spin inline" />
                    ) : (
                      likes
                    )}{" "}
                    likes
                  </span>
                  <span className="sm:hidden">{likes}</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center ${
                    isLoading ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  disabled={isLoading}
                  onClick={handleLike}
                >
                  <Heart
                    className={`w-4 h-4 mr-1 ${
                      likes > 0 ? "fill-red-500 text-red-500" : "text-gray-500"
                    }`}
                  />
                  <span className="hidden sm:inline">
                    {isLoading ? (
                      <Loader className="animate-spin inline" />
                    ) : (
                      likes
                    )}{" "}
                    likes
                  </span>
                  <span className="sm:hidden">{likes}</span>
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
              <AvatarImage alt={post.author?.name || undefined} />
              <AvatarFallback>{post.author?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.author?.name}</p>
            </div>
          </div>
          <div
            className="editor max-w-none  text-background-foreground"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </CardContent>
      </Card>
      <Comments
        postId={post.id}
        initialComments={comments}
        currentUser={user}
      />
    </>
  );
}
