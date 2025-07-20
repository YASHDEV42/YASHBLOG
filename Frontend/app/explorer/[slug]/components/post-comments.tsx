"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@prisma/client";
import { CommentsWithUser } from "../page";
import { createComment } from "@/actions/Posts";

export function Comments({
  postId,
  initialComments,
  currentUser,
}: {
  postId: string;
  initialComments: CommentsWithUser[];
  currentUser: User;
}) {
  const [comments, setComments] = useState<CommentsWithUser[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    const comment = {
      content: newComment,
      userId: currentUser.id,
      postId: postId,
    };

    try {
      const createdComment: CommentsWithUser | null = await createComment(
        comment
      );
      setComments((prev) => [...prev, createdComment as CommentsWithUser]);
      console.log("This is the created comment:", createdComment);
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setNewComment("");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 w-[80vw] mx-auto">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>

      <div className="space-y-4 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            <Avatar>
              <AvatarImage
                src={undefined}
                alt={comment.user.name || undefined}
              />
              <AvatarFallback>{comment.user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{comment.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(comment.createdAt).toLocaleString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                })}
              </p>
              <p className="mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
      <hr />
      <form onSubmit={handleSubmitComment} className="my-6">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="mb-2"
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Comment"}
        </Button>
      </form>
    </div>
  );
}
