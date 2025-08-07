"use client";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/lib/hooks/auth/useAuth";

export default function ProfileHeader() {
  // Get the current user from Redux store - no need to check auth since ProtectedRoute handles it
  const { user: currentUser } = useAuth();

  // Since this component is wrapped in ProtectedRoute, currentUser is guaranteed to exist
  const user = currentUser!;
  const userName = user.name || "User";
  const userEmail = user.email || "No email provided";

  return (
    <div className="flex items-center space-x-4 my-10">
      <UserAvatar user={user} size="xl" />
      <div>
        <h1 className="text-2xl font-bold">{userName}</h1>
        <p className="text-muted-foreground">{userEmail}</p>
      </div>
    </div>
  );
}
