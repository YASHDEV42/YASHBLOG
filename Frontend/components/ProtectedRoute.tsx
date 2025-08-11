"use client";
import { useAuth } from "@/lib/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/redux/slices/userSlice";
import { axiosInstance } from "@/lib/axios";
import Spinner from "./Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  redirectTo = "/login",
  fallback,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (user) {
        setAuthChecked(true);
        return;
      }

      if (authChecked) return;

      try {
        const response = await axiosInstance.get("/user/current");
        if (response.data?.user) {
          dispatch(setUser(response.data.user));
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        console.log("Auth check failed:", error);
        dispatch(clearUser());
      } finally {
        setAuthChecked(true);
      }
    };

    initializeAuth();
  }, [dispatch, user, authChecked]);

  useEffect(() => {
    if (authChecked && !loading && !user) {
      router.replace(redirectTo);
    }
  }, [user, loading, authChecked, router, redirectTo]);

  if (!authChecked || loading) {
    return fallback || <Spinner />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
