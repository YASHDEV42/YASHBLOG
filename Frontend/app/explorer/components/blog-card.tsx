import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Post } from "@/types";
import {
  Heart,
  User,
  Calendar,
  TrendingUp,
  Eye,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";

export function BlogCard({ post }: { post: Post }) {
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
      <Card className="hover:scale-105 hover:shadow-md transition-all duration-200 h-full flex flex-col group">
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
            <span>
              {typeof post.author === "string" ? post.author : post.author.name}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground flex items-center space-x-1 group-hover:opacity-100 transition-opacity duration-400 relative overflow-hidden">
            {/* ChevronsRight Icon */}
            <ChevronsRight
              size={50}
              className="w-4 h-4 mr-1 absolute -translate-x-full opacity-0 group-hover:translate-x-5 group-hover:scale-150 group-hover:opacity-100 transition-all duration-200 ease-in-out"
            />
            {/* Text */}
            <span className="transition-all duration-200 ease-in-out group-hover:opacity-0">
              Read more
            </span>
          </span>
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
