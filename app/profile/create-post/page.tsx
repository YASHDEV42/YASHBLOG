import React from "react";
import BlogPostEditor from "./components/BlogPostEditor";

const page = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center mx-auto">
      <h1>Create Post</h1>
      <BlogPostEditor />
    </div>
  );
};

export default page;
