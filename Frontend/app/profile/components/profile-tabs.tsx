"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LikedPosts from "./liked-posts";
import Settings from "./settings";
import { LikedPostsWithPostWithAuthor, PostWithMetadata, User } from "@/types";
import MyPosts from "./my-posts";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { UserService } from "@/lib/services/user.service";
import Spinner from "@/components/Spinner";

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState("my-posts");
  const router = useRouter();

  const { user: currentUser, loading: authLoading } = useSelector(
    (state: RootState) => state.user
  );

  const [profileData, setProfileData] = useState<{
    user: User | null;
    posts: PostWithMetadata[];
    likedPosts: LikedPostsWithPostWithAuthor[];
  }>({
    user: null,
    posts: [],
    likedPosts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;

    if (!authLoading && !currentUser) {
      router.replace("/login");
      return;
    }

    if (authLoading || !currentUser) return;

    const loadProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [posts, likedPosts] = await Promise.all([
          UserService.getUserPosts(currentUser._id),
          UserService.getUserLikedPosts(currentUser._id),
        ]);

        if (isMounted) {
          setProfileData({
            user: currentUser,
            posts: posts as PostWithMetadata[],
            likedPosts: likedPosts as LikedPostsWithPostWithAuthor[],
          });
        }
      } catch (err) {
        console.error("Failed to load profile data:", err);
        if (isMounted) {
          setError("Failed to load profile data. Please try again.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, [currentUser, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="max-w-[80vw] mx-auto px-4 py-8 bg-background flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-[80vw] mx-auto px-4 py-8 bg-background">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="my-posts">My Posts</TabsTrigger>
        <TabsTrigger value="liked-posts">Liked Posts</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="my-posts">
        <MyPosts posts={profileData.posts} />
      </TabsContent>
      <TabsContent value="liked-posts">
        <LikedPosts likedPosts={profileData.likedPosts || []} />
      </TabsContent>
      <TabsContent value="settings">
        <Settings user={profileData.user} />
      </TabsContent>
    </Tabs>
  );
}
