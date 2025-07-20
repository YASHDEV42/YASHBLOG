"use client";

import React from "react";
import BlogPostEditor from "./components/BlogPostEditor";
import { useAuth } from "@/lib/hooks/use-auth";
import Spinner from "@/components/Spinner";

const Page = () => {
  const { user, loading, initialized, isAuthenticated } = useAuth();

  // Show loading spinner while auth state is being initialized
  if (!initialized || loading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[200px]">
        <Spinner />
      </div>
    );
  }

  // Show login message if user is not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="w-full flex flex-col items-center justify-center mx-auto p-4">
        <p className="text-center text-lg">Please log in to create a post.</p>
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
