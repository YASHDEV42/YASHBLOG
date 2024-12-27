import { Metadata } from "next";
import ProfileHeader from "./components/profile-header";
import ProfileTabs from "./components/profile-tabs";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/server-supabase";
import { User } from "@supabase/supabase-js";
// interface Post {
//   id: string;
//   authorId: string;
//   title?: string;
//   content?: string;
//   createdAt?: string;
// }

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
  // const {
  //   data,
  //   error,
  // }: { data: Post[] | null; error: PostgrestError | null } = await supabase
  //   .from<Post>("Post")
  //   .select("authorId, title, content")
  //   .eq("authorId", data.user.id);
  // console.log(data);
  // console.log(error);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader user={data && (data?.user as User)} />
      <ProfileTabs user={data && (data?.user as User)} />
    </div>
  );
}
