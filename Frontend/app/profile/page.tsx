import { Metadata } from "next";
import ProfileHeader from "./components/profile-header";
import ProfileTabs from "./components/profile-tabs";
import { redirect } from "next/navigation";
import { createClient } from "@/Frontend/lib/server-supabase";
import { prisma } from "@/Frontend/lib/db";
import { LikedPostsWithPostWithAuthor } from "@/types";
import { PostWithMetadata } from "./components/my-posts";

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
    include: {
      author: true,
      metadata: true,
    },
  })) as PostWithMetadata[];

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

  console.log(likedPosts);

  return (
    <div className="max-w-[80vw] mx-auto px-4 py-8">
      <ProfileHeader user={user} />

      <ProfileTabs user={user} posts={posts} likedPosts={likedPosts} />
    </div>
  );
}
