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
import { Post } from "@prisma/client";

const App = ({ posts: initialPosts }: { posts: Post[] }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);

  const handleTogglePublish = async (id: number) => {
    setLoading(true);
    await togglePublishStatus(id);
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, published: !post.published } : post
      )
    );
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      await deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
    } finally {
      setLoading(false);
    }
  };

  if (posts.length === 0) {
    return <p className="text-center text-muted-foreground">No posts found.</p>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card
          key={post.id}
          className="bg-card hover:bg-primary-foreground hover:shadow-md transition-all"
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center text-2xl">
              <span>{post.title}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {format(new Date(post.createdAt), "MMM d, yyyy")}
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/profile/edit-post/${post.id}`}>
                    <Edit className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className=" opacity-80 pb-7">
              {post.excerpt || "No excerpt available."}
            </p>
            <div className="flex items-center mt-2 space-x-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-md text-muted-foreground">0 likes</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    disabled={loading}
                    className={`${
                      loading ? "cursor-not-allowed opacity-70" : ""
                    }`}
                  >
                    <Trash2 size={7} className="w-7 h-7 " />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(post.id)}>
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
                    }`}
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
                      onClick={() => handleTogglePublish(post.id)}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <Button size="sm" className="text-md p-3" asChild>
              <Link href={`/posts/${post.id}`}>
                Read More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
      <Button asChild>
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
