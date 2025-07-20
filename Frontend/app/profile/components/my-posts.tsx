"use client";

import { useState } from "react";
import { deletePost, togglePublishStatus } from "@/actions/Posts";
import { format } from "date-fns";
import {
  ArrowRight,
  Edit,
  Eye,
  EyeOff,
  Heart,
  Plus,
  Trash2,
} from "lucide-react";
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
import Link from "next/link";
import { PostWithMetadata } from "@/types";

const App = ({ posts: initialPosts }: { posts: PostWithMetadata[] }) => {
  const [posts, setPosts] = useState<PostWithMetadata[]>(initialPosts);
  const [loading, setLoading] = useState(false);

  const handleTogglePublish = async (id: string) => {
    setLoading(true);
    await togglePublishStatus(id);
    setPosts(
      posts.map((post: PostWithMetadata) =>
        post._id === id ? { ...post, published: !post.published } : post
      )
    );
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deletePost(id);
      setPosts(posts.filter((post) => post._id !== id));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground">No posts found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card
              key={post._id}
              className="bg-card hover:scale-105 hover:shadow-md transition-all flex flex-col"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xl sm:text-2xl gap-2">
                  <span className="line-clamp-1">{post.title}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                      {format(new Date(post.createdAt), "MMM d, yyyy")}
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/profile/edit-post/${post._id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="opacity-80 pb-4 line-clamp-3">
                  {post.excerpt.split(" ").length > 15
                    ? post.excerpt.split(" ").slice(0, 15).join(" ") + "..."
                    : post.excerpt}{" "}
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">
                      {post.likes} likes
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">
                      {post.metadata_views} views
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <div className="flex flex-col md:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={loading}
                        className={`${
                          loading ? "cursor-not-allowed opacity-70" : ""
                        } w-full sm:w-auto hover:bg-red-500`}
                      >
                        <Trash2 size={7} className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your post.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(post._id)}
                        >
                          {loading ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={loading}
                        className={`${
                          loading ? "cursor-not-allowed opacity-70" : ""
                        } w-full sm:w-auto`}
                      >
                        {post.published ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Make Private
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Publish
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                        <AlertDialogDescription>
                          {post.published
                            ? "Are you sure you want to make this post private?"
                            : "Are you sure you want to publish this post?"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleTogglePublish(post._id)}
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <Button size="sm" className="text-md p-3 w-full" asChild>
                  <Link href={`/explorer/${post.slug}`}>
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <Button asChild className="w-full sm:w-auto">
        <Link
          href="/profile/create-post"
          className="flex items-center justify-center gap-1"
        >
          <Plus />
          <span className="text-md">Create Post</span>
        </Link>
      </Button>
    </div>
  );
};

export default App;
