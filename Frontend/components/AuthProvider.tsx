"use client";
import { useEffect } from "react";
import { useAuth } from "@/lib/hooks/auth/useAuth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { refreshUser, initialized, loading } = useAuth();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  if (!initialized || loading) {
    return <div>Loading user...</div>;
  }

  return <>{children}</>;
}
