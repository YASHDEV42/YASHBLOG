import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LikedPostsWithPostWithAuthor } from "@/types";

export default function LikedPosts({
  likedPosts,
}: {
  likedPosts: LikedPostsWithPostWithAuthor[];
}) {
  return (
    <div className="space-y-4">
      {likedPosts && likedPosts.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No liked posts found.
        </p>
      ) : (
        likedPosts.map((likedPost) => (
          <Card key={likedPost.userId + likedPost.postId}>
            {likedPost.Post ? (
              <>
                <CardHeader>
                  <CardTitle>{likedPost.Post.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    By {likedPost.Post.author?.name || "Unknown"}
                  </p>
                </CardHeader>
                <CardContent>
                  <p>{likedPost.Post.excerpt || "No excerpt available."}</p>
                </CardContent>
              </>
            ) : (
              <CardContent>
                <p>Post information is unavailable.</p>
              </CardContent>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
