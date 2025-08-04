"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Settings from "./settings";
import MyPosts from "./my-posts";
import { usePosts } from "@/lib/hooks/posts/usePosts";
import LikedPosts from "./liked-posts";
import { useAuth } from "@/lib/hooks/auth/useAuth";
import {
  FileText,
  Heart,
  SettingsIcon,
  User,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("my-posts");
  const { user: currentUser } = useAuth();
  const { data: posts = [], isLoading, error, refetch } = usePosts();

  // Enhanced loading state
  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-48 bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="w-20 h-6 bg-muted animate-pulse rounded-full" />
        </div>

        {/* Tabs skeleton */}
        <div className="space-y-4">
          <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 h-10 bg-muted animate-pulse rounded-md"
              />
            ))}
          </div>

          {/* Content skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center">
        <div className="relative">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
            <span className="text-sm">⚠️</span>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            Something went wrong
          </h3>
          <p className="text-muted-foreground max-w-md">
            We could not load your posts. Please check your connection and try
            again.
          </p>
          <p className="text-sm text-red-500">{error.message}</p>
        </div>
        <Button onClick={() => refetch?.()} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const myPosts = posts.filter(
    (post) => post?.author?._id === currentUser?._id
  );
  const postsLiked = posts.filter((post) =>
    post.likes?.some((like) => like._id === currentUser?._id)
  );

  // Enhanced loading state for user
  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <User className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground animate-pulse">
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1 rounded-lg h-auto">
          <TabsTrigger
            value="my-posts"
            className="flex items-center space-x-2 py-3 px-4 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all duration-200"
          >
            <FileText className="h-4 w-4" />
            <span className="font-medium">My Posts</span>
            <Badge variant="secondary" className="ml-1 text-xs px-2 py-0.5">
              {myPosts.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="liked-posts"
            className="flex items-center space-x-2 py-3 px-4 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all duration-200"
          >
            <Heart className="h-4 w-4" />
            <span className="font-medium">Liked Posts</span>
            <Badge variant="secondary" className="ml-1 text-xs px-2 py-0.5">
              {postsLiked.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="settings"
            className="flex items-center space-x-2 py-3 px-4 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all duration-200"
          >
            <SettingsIcon className="h-4 w-4" />
            <span className="font-medium">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Enhanced Tab Content */}
        <div className="relative">
          <TabsContent value="my-posts" className="mt-0 space-y-4">
            <MyPosts posts={myPosts} />
          </TabsContent>

          <TabsContent value="liked-posts" className="mt-0 space-y-4">
            <LikedPosts postsLiked={postsLiked} />
          </TabsContent>

          <TabsContent value="settings" className="mt-0 space-y-4">
            <Settings user={currentUser} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
