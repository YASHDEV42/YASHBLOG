import { Skeleton } from "@/components/ui/skeleton";
import { BlogCardSkeleton } from "./blog-card-skeleton";

export function ExplorerSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <Skeleton className="h-10 w-full mb-4" />
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-10 w-24" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <BlogCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
