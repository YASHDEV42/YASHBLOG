import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProfileTabsSkeleton() {
  return (
    <Tabs defaultValue="my-posts">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="my-posts">My Posts</TabsTrigger>
        <TabsTrigger value="liked-posts">Liked Posts</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="my-posts">
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
