import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BlogPostEditorSkeleton() {
  return (
    <Card className="w-full max-w-4xl mx-auto mt-16">
      <CardHeader>
        <CardTitle className="text-center lg:text-3xl md:text-2xl text-xl">
          <Skeleton className="h-8 w-3/4 mx-auto" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <div className="flex justify-end space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
