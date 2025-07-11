import { Metadata } from "next";
import { headers } from "next/headers";
import ProfileHeader from "./components/profile-header";
import ProfileTabs from "./components/profile-tabs";
import { redirect } from "next/navigation";

import type {
  User,
  PostWithMetadata,
  LikedPostsWithPostWithAuthor,
} from "@/types";

export const metadata: Metadata = {
  title: "User Profile",
  description: "View and manage your profile, posts, and settings",
};

export default async function ProfilePage() {
  const headersList = await headers();
  const cookie = headersList.get("cookie");
  const baseUrl = process.env.API_URL || "http://localhost:5000";

  // ✅ Token fetch
  const tokenRes = await fetch(`${baseUrl}/api/user/current`, {
    headers: {
      cookie: cookie ?? "",
    },
  });

  if (!tokenRes.ok) redirect("/login");

  const { user: token }: { user: { id: string } | null } =
    await tokenRes.json();

  if (!token) redirect("/login");

  const [postsRes, likedPostsRes, userRes] = await Promise.all([
    fetch(`${baseUrl}/api/user/posts/${token.id}`, {
      headers: { cookie: cookie ?? "" },
      cache: "no-store",
    }),
    fetch(`${baseUrl}/api/user/liked-posts/${token.id}`, {
      headers: { cookie: cookie ?? "" },
      cache: "no-store",
    }),
    fetch(`${baseUrl}/api/user/profile/${token.id}`, {
      headers: { cookie: cookie ?? "" },
      cache: "no-store",
    }),
  ]);

  if (!postsRes.ok || !likedPostsRes.ok || !userRes.ok)
    return <p>Error loading data</p>;

  const user: User = await userRes.json();
  const posts: PostWithMetadata[] = await postsRes.json();
  const likedPosts: LikedPostsWithPostWithAuthor[] = await likedPostsRes.json();

  return (
    <div className="max-w-[80vw] mx-auto px-4 py-8 bg-background">
      <ProfileHeader user={user} />
      <ProfileTabs user={user} posts={posts} likedPosts={likedPosts} />
    </div>
  );
}
