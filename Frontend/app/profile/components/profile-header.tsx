import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";

export default async function ProfileHeader({ user }: { user: User }) {
  const userName = user.user_metadata?.name || "User";
  const userEmail = user.email || "No email provided";
  const avatarFallbackText = userName.slice(0, 2).toUpperCase();
  return (
    <div className="flex items-center space-x-4 my-10">
      <Avatar className="w-24 h-24">
        <AvatarImage src="/placeholder-avatar.jpg" alt="User's avatar" />
        <AvatarFallback>{avatarFallbackText}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">{userName}</h1>
        <p className="text-muted-foreground">{userEmail}</p>
      </div>
    </div>
  );
}
