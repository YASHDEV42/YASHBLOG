"use client";
import { useAuth } from "@/lib/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginForm } from "./login-form";
import Spinner from "@/components/Spinner";

export default function LoginPage() {
  const { user, loading, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if user is authenticated and auth is fully initialized
    if (initialized && !loading && user) {
      router.replace("/");
    }
  }, [user, loading, initialized, router]);

  // Show loading while initializing auth
  if (!initialized || loading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <Spinner />
      </div>
    );
  }

  // Don't render anything if redirecting
  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm />
      </div>
    </div>
  );
}
