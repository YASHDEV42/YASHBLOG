import { Skeleton } from "@/components/ui/skeleton";
import { BlogPostEditorSkeleton } from "./blog-post-editor-skeleton";

export function CreatePostSkeleton() {
  return (
    <div className="w-full flex flex-col items-center justify-center mx-auto animate-pulse">
      <Skeleton className="h-10 w-48 mb-8" />
      <BlogPostEditorSkeleton />
    </div>
  );
}
