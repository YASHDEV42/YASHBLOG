import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: {
    name?: string;
    profilePicture?: string;
  };
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-24 h-24",
};

const fallbackSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-xl",
};

export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  const fallbackText = user.name?.slice(0, 2).toUpperCase() || "U";

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage
        src={user.profilePicture || ""}
        alt={`${user.name || "User"}'s avatar`}
      />
      <AvatarFallback className={fallbackSizes[size]}>
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
}
