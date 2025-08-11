"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "@/redux/slices/userSlice";
import type { RootState } from "@/redux/store";
import { axiosInstance } from "@/lib/axios";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { initialized } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const response = await axiosInstance.get("/user/current");
        if (response.data?.user) {
          dispatch(setUser(response.data.user));
        } else {
          dispatch(clearUser());
        }
      } catch {
        dispatch(clearUser());
      }
    };

    // Only run once when not initialized
    if (!initialized) {
      validateAuth();
    }

    // Set up periodic auth validation every 30 minutes (only for active sessions)
    const authCheckInterval = setInterval(() => {
      validateAuth();
    }, 30 * 60 * 1000); // 30 minutes

    // Handle page visibility change (when user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        validateAuth();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup interval and event listener on unmount
    return () => {
      clearInterval(authCheckInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [dispatch, initialized]);

  return <>{children}</>;
}
