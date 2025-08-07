import BlogPostEditor from "./components/BlogPostEditor";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Page = () => {
  return (
    <ProtectedRoute>
      <div className="w-full flex flex-col items-center justify-center mx-auto p-4 pt-24">
        <h1 className="text-2xl font-bold mb-6">Create Post</h1>
        <BlogPostEditor />
      </div>
    </ProtectedRoute>
  );
};

export default Page;
