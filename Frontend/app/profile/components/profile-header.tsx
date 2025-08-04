"use client";
import Spinner from "@/components/Spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfileHeader() {
  const router = useRouter();
  // Get the current user from Redux store
  const { user: currentUser, loading: authLoading } = useAuth();

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!currentUser && !authLoading) {
      router.push("/login");
    }
  }, [currentUser, authLoading, router]);

  if (authLoading || !currentUser) {
    return (
      <div className="w-full flex justify-center items-center min-h-[200px]">
        <Spinner />
      </div>
    );
  }
  const user = currentUser;
  const userName = user.name || "User";
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
