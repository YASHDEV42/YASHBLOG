import { Metadata } from "next";
import ProfileHeader from "./components/profile-header";
import ProfileTabs from "./components/profile-tabs";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/server-supabase";
import prisma from "@/lib/db";
import { PostWithAuthor, LikedPostsWithPostWithAuthor } from "@/types";

export const metadata: Metadata = {
  title: "User Profile",
  description: "View and manage your profile, posts, and settings",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user || typeof user.id !== "string") {
    redirect("/login");
  }

  const posts = (await prisma.post.findMany({
    where: {
      authorId: user.id,
    },
  })) as PostWithAuthor[];

  const likedPosts = (await prisma.likedPosts.findMany({
    where: {
      userId: user.id,
    },
    include: {
      post: {
        include: {
          author: true,
        },
      },
    },
  })) as LikedPostsWithPostWithAuthor[] | [];

  return (
    <div className="max-w-[80vw] mx-auto px-4 py-8">
      <ProfileHeader user={user} />
      <ProfileTabs user={user} posts={posts} likedPosts={likedPosts} />
    </div>
  );
}
