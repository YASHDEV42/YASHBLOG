"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ArrowRight,
  Edit,
  Eye,
  EyeOff,
  Heart,
  Plus,
  Trash2,
  FileText,
  Calendar,
  Loader2,
} from "lucide-react";
import { PostViewsDisplay } from "@/components/PostViewsDisplay";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { CompletePost } from "@/types";
import { useTogglePublishStatus } from "@/lib/hooks/posts/useTogglePublishStatus";
import { useDeletePost } from "@/lib/hooks/posts/useDeletePost";

const App = ({ posts: initialPosts }: { posts: CompletePost[] }) => {
  const [posts, setPosts] = useState<CompletePost[]>(initialPosts);
  const [actioningPost, setActioningPost] = useState<string | null>(null);
  const { mutate: togglePublishStatus } = useTogglePublishStatus();
  const { mutate: deletePost } = useDeletePost();

  const handleTogglePublish = (postSlug: string, postId: string) => {
    setActioningPost(postId);
    togglePublishStatus(postSlug, {
      onSuccess: (updatedPost) => {
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? { ...post, published: updatedPost.published }
              : post
          )
        );
        setActioningPost(null);
      },
      onError: (error) => {
        console.error("Error toggling publish status:", error);
        setActioningPost(null);
      },
    });
  };
  const handleDeletePost = (slug: string) => {
    setActioningPost(slug);
    deletePost(slug, {
      onSuccess: () => {
        setPosts((prev) => prev.filter((post) => post.slug !== slug));
        setActioningPost(null);
      },
      onError: (error) => {
        console.error("Error deleting post:", error);
        setActioningPost(null);
      },
    });
  };
  // Enhanced empty state
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full flex items-center justify-center">
            <FileText className="h-12 w-12 text-blue-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            No posts yet
          </h3>
          <p className="text-muted-foreground max-w-md">
            Start creating your first post to share your thoughts and ideas with
            the world.
          </p>
        </div>
        <Button asChild className="mt-4">
          <Link href="/profile/create-post">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Post
          </Link>
        </Button>
      </div>
    );
  }

  const publishedPosts = posts.filter((post) => post.published).length;
  const draftPosts = posts.length - publishedPosts;

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">My Posts</h2>
            <p className="text-muted-foreground">
              {posts.length} total post{posts.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="default" className="px-3 py-1">
            <Eye className="h-3 w-3 mr-1" />
            {publishedPosts} Published
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            <EyeOff className="h-3 w-3 mr-1" />
            {draftPosts} Draft{draftPosts !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      {/* Posts grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card
            key={post._id}
            className="group relative overflow-hidden border-0 hover:scale-105 hover:shadow-md transition-all duration-200"
          >
            {/* Status indicator */}
            <div className="absolute top-3 left-3 z-10">
              <Badge
                variant={post.published ? "default" : "secondary"}
                className="text-xs px-2 py-1"
              >
                {post.published ? (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Published
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Draft
                  </>
                )}
              </Badge>
            </div>

            {/* Edit button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 z-20 h-8 w-8 p-0 rounded-full  hover:scale-110 transition-all duration-200 shadow-sm"
              asChild
            >
              <Link href={`/profile/edit-post/${post.slug}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>

            <CardHeader className="pt-12 pb-3">
              <CardTitle className="text-lg font-semibold line-clamp-2">
                {post.title}
              </CardTitle>

              {/* Date */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
              </div>
            </CardHeader>

            <CardContent className="pt-0 flex-grow">
              <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed mb-4">
                {(post.excerpt ?? "").split(" ").length > 15
                  ? (post.excerpt ?? "").split(" ").slice(0, 15).join(" ") +
                    "..."
                  : post.excerpt ?? ""}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3 text-red-500" />
                    <span>{post.metadata?.likes || 0}</span>
                  </div>
                  <PostViewsDisplay views={post.metadata?.views} size="sm" />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-4">
              {/* Action buttons */}
              <div className="flex gap-2 w-full">
                <AlertDialog>
                  <AlertDialogTrigger
                    className="hover:bg-red-500 transition-all duration-200  cursor-pointer"
                    asChild
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={actioningPost === post._id}
                      className="flex-1 h-8 bg-transparent cursor-pointer"
                    >
                      {actioningPost === post._id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-background text-foreground border-border dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-foreground dark:text-gray-100">
                        Delete Post
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground dark:text-gray-400">
                        Are you sure you want to delete {post.title}? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-600">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                        onClick={() => handleDeletePost(post.slug)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={actioningPost === post._id}
                      className="flex-1 h-8 bg-transparent cursor-pointer"
                    >
                      {actioningPost === post._id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : post.published ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-background text-foreground border-border dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-foreground dark:text-gray-100">
                        {post.published ? "Make Private" : "Publish Post"}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground dark:text-gray-400">
                        {post.published
                          ? `Are you sure you want to make "${post.title}" private? It will no longer be visible to others.`
                          : `Are you sure you want to publish "${post.title}"? It will be visible to everyone.`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:border-gray-600">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleTogglePublish(post.slug, post._id)}
                        className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                      >
                        {actioningPost === post._id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : post.published ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                        {post.published ? "Make Private" : "Publish"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Read more button */}
              <Button size="sm" className="w-full group/btn" asChild>
                <Link href={`/explorer/${post.slug}`}>
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Create new post button */}
      <div className="flex justify-center pt-6 border-t">
        <Button asChild size="lg" className="px-8">
          <Link href="/profile/create-post" className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            <span>Create New Post</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default App;
