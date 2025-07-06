import React from "react";
import BlogPostEditor from "./components/BlogPostEditor";
import { createClient } from "@/Frontend/lib/server-supabase";
import { redirect } from "next/navigation";
const page = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  if (!data?.user) {
    redirect("/login");
  }
  const id: string = data.user.id;

  return (
    <div className="w-full flex flex-col items-center justify-center mx-auto">
      <h1>Create Post</h1>
      <BlogPostEditor id={id} />
    </div>
  );
};

export default page;
