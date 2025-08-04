"use client";

import React from "react";
import BlogPostEditor from "./components/BlogPostEditor";
import { useAuth } from "@/lib/hooks/auth/useAuth";
import Spinner from "@/components/Spinner";

const Page = () => {
  const { user: currentUser, loading: authLoading } = useAuth();
  if (authLoading) {
    return <Spinner />;
  }
  if (!currentUser) {
    return (
      <div className="w-full flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">
          You must be logged in to create a post.
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create Post</h1>
      <BlogPostEditor />
    </div>
  );
};

export default Page;
