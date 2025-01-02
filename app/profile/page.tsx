import { Metadata } from "next";
import ProfileHeader from "./components/profile-header";
import ProfileTabs from "./components/profile-tabs";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/server-supabase";
import { User } from "@supabase/supabase-js";
import prisma from "@/lib/db";
export const metadata: Metadata = {
  title: "User Profile",
  description: "View and manage your profile, posts, and settings",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  if (!data?.user) {
    redirect("/login");
  }
  const posts = await prisma.post.findMany({
    where: {
      authorId: data?.user.id,
    },
  });
  console.log("Posts from the server", posts);

  const likedPosts = await prisma.likedPosts.findMany({
    where: {
      userId: data?.user.id,
    },
    include: {
      Post: {
        include: {
          author: true,
        },
      },
    },
  });

  return (
    <div className="max-w-[80vw] mx-auto px-4 py-8">
      <ProfileHeader user={data && (data?.user as User)} />
      <ProfileTabs
        user={data && (data?.user as User)}
        posts={posts}
        likedPosts={likedPosts}
      />
    </div>
  );
}
