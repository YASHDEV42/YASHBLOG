import React from "react";
import BlogPostEditor from "./components/BlogPostEditor";
import { createClient } from "@/lib/server-supabase";
import { redirect } from "next/navigation";
const page = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  if (!data?.user) {
    redirect("/login");
  }

  return (
    <div className="w-full flex flex-col items-center justify-center mx-auto">
      <h1>Create Post</h1>
      <BlogPostEditor user={data.user} />
    </div>
  );
};

export default page;
