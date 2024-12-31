import React from "react";
import BlogPostEditor from "./components/BlogPostEditor";
import { createClient } from "@/lib/server-supabase";
const page = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("auth.users").select("*");
  if (error) {
    console.error("Error fetching users:", error);
  } else {
    console.log("Users:", data);
  }

  return (
    <div className="w-full flex flex-col items-center justify-center mx-auto">
      <h1>Create Post</h1>
      <BlogPostEditor />
    </div>
  );
};

export default page;
