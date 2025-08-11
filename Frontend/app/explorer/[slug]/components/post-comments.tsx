"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks/auth/useAuth";
import { useCreateComment } from "@/lib/hooks/comments/useCreateComment";
import { PopulatedComment } from "@/types";
import { UserAvatar } from "@/components/UserAvatar";
import { useCommentByPost } from "@/lib/hooks/comments/useCommentByPost";

export function Comments({ postId }: { postId: string }) {
  const { user: currentUser } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<PopulatedComment[]>([]);
  const { mutateAsync: createComment } = useCreateComment();

  const { data: fetchedComments } = useCommentByPost(postId);
  useEffect(() => {
    if (fetchedComments) setComments(fetchedComments);
  }, [fetchedComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!currentUser) {
      toast.error("Please log in to comment");
      return;
    }

    setIsSubmitting(true);
    const commentPayload = {
      content: newComment,
      postId,
      userId: currentUser._id,
    };
    console.log("Creating comment with payload:", commentPayload);
    try {
      const createdComment = await createComment(commentPayload);
      setComments((prev) => [...prev, createdComment]);
      console.log("Created comment:", createdComment);
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error("Error creating comment");
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
          <div key={comment._id} className="flex space-x-4">
            <UserAvatar
              user={{
                name: comment.user.name,
                profilePicture: comment.user.profilePicture,
              }}
              size="sm"
            />
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
