import { Sparkles, Eye } from "lucide-react";

interface PostViewsDisplayProps {
  views: number | undefined;
  size?: "sm" | "md" | "lg";
}

export function PostViewsDisplay({ views = 0, size = "md" }: PostViewsDisplayProps) {
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5"
  };

  const badgeSizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm"
  };

  if (views === 0) {
    return (
      <div className={`flex items-center bg-gradient-to-r from-green-100 to-blue-100 text-green-800 font-medium rounded-full ${badgeSizes[size]}`}>
        <Sparkles className={`${iconSizes[size]} mr-1`} />
        NEW
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Eye className={`${iconSizes[size]} mr-1 text-gray-500`} />
      <span className="text-sm">{views}</span>
    </div>
  );
}
