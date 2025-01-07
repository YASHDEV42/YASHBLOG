"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Calendar, Loader } from "lucide-react";
import { PostData } from "../../page";
import { LikedPosts, User } from "@prisma/client";
import { likePost, unlikePost } from "@/actions/Posts";
// import { likePost } from "@/lib/api";

export function PostContent({
  post,
  user,
  ifLikedPost,
}: {
  post: PostData;
  user: User;
  ifLikedPost: LikedPosts | null;
}) {
  const [likes, setLikes] = useState(post.metadata?.likes || 0);
  const [isLiked, setIsLiked] = useState(ifLikedPost ? true : false);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLike = async () => {
    setIsLoading(true);
    setLikes(likes + 1);
    const userId: string = user.id;
    await likePost(post.id, userId);
    setIsLiked(true);
    setIsLoading(false);
  };
  const handleUnLike = async () => {
    setIsLoading(true);
    setLikes(likes - 1);
    const userId: string = user.id;
    await unlikePost(post.id, userId);
    setIsLiked(false);
    setIsLoading(false);
  };
  console.log(post);

  return (
    <Card className="w-[80vw] mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-3xl font-bold mb-2">{post.title}</CardTitle>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
          {isLiked ? (
            <Button
              variant="default"
              className={`flex items-center ${
                isLoading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              disabled={isLoading}
              onClick={handleUnLike}
            >
              <Heart
                className={`w-4 h-4 mr-1 fill-red-500 text-red-500
                `}
              />
              <span>
                {isLoading ? (
                  <Loader className=" animate-spin inline" />
                ) : (
                  likes
                )}{" "}
                likes
              </span>
            </Button>
          ) : (
            <Button
              variant="ghost"
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
              <span>
                {isLoading ? (
                  <Loader className=" animate-spin inline" />
                ) : (
                  likes
                )}{" "}
                likes
              </span>
            </Button>
          )}
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
          className="editor max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </CardContent>
    </Card>
  );
}
