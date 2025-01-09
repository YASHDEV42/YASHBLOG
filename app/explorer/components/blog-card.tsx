import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Heart, User, Calendar, TrendingUp, Eye } from "lucide-react";
import Link from "next/link";
import { PostData } from "../page";

export function BlogCard({ post }: { post: PostData }) {
  const formatDate = (dateString: string | Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Link href={`/explorer/${post.slug}`}>
      <Card className="hover:bg-primary-foreground hover:shadow-md transition-all h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{post.title}</span>
            {post.metadata?.views && post.metadata.views > 100 && (
              <div className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                <TrendingUp className="w-4 h-4 mr-1" />
                Trending
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm mb-4">
            {post.excerpt.split(" ").length > 15
              ? post.excerpt.split(" ").slice(0, 15).join(" ") + "..."
              : post.excerpt}
          </p>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <User className="w-4 h-4 mr-1" />
            <span>{post.author?.name}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Read more</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1 text-gray-500" />
              <span className="text-sm">{post.metadata?.views || 0}</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1 text-red-500" />
              <span className="text-sm">{post.metadata?.likes || 0}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
