"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearUser, setLoading, setUser } from "@/redux/slices/userSlice";
import { UserService } from "@/lib/services/user.service";
import { useHydration } from "@/lib/hooks/use-hydration";

/**
 * Authentication Provider Component
 * Handles user authentication state at the app level
 * Should be used once in your app layout or root component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { initialized } = useSelector((state: RootState) => state.user);
  const hasMounted = useHydration();

  useEffect(() => {
    // Only run after component has mounted (client-side only)
    if (hasMounted && !initialized) {
      const loadUser = async () => {
        dispatch(setLoading(true));
        try {
          console.log("AuthProvider: Starting user load...");
          const currentUser = await UserService.getCurrentUser();
          console.log("AuthProvider: User loaded successfully:", currentUser);
          if (currentUser) {
            dispatch(setUser(currentUser));
          } else {
            dispatch(clearUser());
          }
        } catch (error) {
          console.error("AuthProvider: Failed to load user:", error);
          dispatch(clearUser());
        } finally {
          dispatch(setLoading(false));
          console.log("AuthProvider: Loading complete");
        }
      };

      loadUser();
    }
  }, [dispatch, initialized, hasMounted]);

  return <>{children}</>;
}
