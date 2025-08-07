"use client";
import { useAuth } from "@/lib/hooks/auth/useAuth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuth();

  return <>{children}</>;
}
