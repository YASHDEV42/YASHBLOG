import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LikedPosts as LikedPostsType,
  Post,
  public_users,
} from "@prisma/client";

type PostWithAuthor = Post & {
  author: public_users | null;
};

type LikedPostsTypeWithPost = LikedPostsType & {
  Post: PostWithAuthor | null;
};

export default function LikedPosts({
  likedPosts,
}: {
  likedPosts: LikedPostsTypeWithPost[];
}) {
  return (
    <div className="space-y-4">
      {likedPosts && likedPosts.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No liked posts found.
        </p>
      ) : (
        likedPosts.map((likedPost) => (
          <Card key={likedPost.id}>
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
