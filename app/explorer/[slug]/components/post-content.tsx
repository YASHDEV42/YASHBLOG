"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Calendar } from "lucide-react";
import { PostData } from "../../page";
// import { likePost } from "@/lib/api";

export function PostContent({ post }: { post: PostData }) {
  const [likes, setLikes] = useState(post.metadata?.likes || 0);

  const formatDate = (dateString: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLike = async () => {
    //   const newLikes = await likePost(post.id);
    setLikes(likes + 1);
  };

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
          <Button
            variant="ghost"
            className="flex items-center"
            onClick={handleLike}
          >
            <Heart
              className={`w-4 h-4 mr-1 ${
                likes > 0 ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
            />
            <span>{likes} likes</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Avatar>
            <AvatarImage alt={post.author?.name} />
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
