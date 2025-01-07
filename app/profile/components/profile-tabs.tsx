"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyPosts, { PostWithMetadata } from "./my-posts";
import LikedPosts from "./liked-posts";
import Settings from "./settings";
import { User } from "@supabase/supabase-js";
import { LikedPostsWithPostWithAuthor } from "@/types";

export default function ProfileTabs({
  user,
  posts,
  likedPosts,
}: {
  user: User;
  posts: PostWithMetadata[];
  likedPosts: LikedPostsWithPostWithAuthor[];
}) {
  const [activeTab, setActiveTab] = useState("my-posts");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="my-posts">My Posts</TabsTrigger>
        <TabsTrigger value="liked-posts">Liked Posts</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="my-posts">
        <MyPosts posts={posts} />
      </TabsContent>
      <TabsContent value="liked-posts">
        <LikedPosts likedPosts={likedPosts || []} />
      </TabsContent>
      <TabsContent value="settings">
        <Settings user={user && user} />
      </TabsContent>
    </Tabs>
  );
}
