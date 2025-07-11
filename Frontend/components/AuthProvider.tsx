"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearUser, setLoading, setUser } from "@/redux/slices/userSlice";
import { convertApiUserToUser } from "@/types";
import { UserService } from "@/lib/services/user.service";

/**
 * Authentication Provider Component
 * Handles user authentication state at the app level
 * Should be used once in your app layout or root component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { initialized } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Only fetch user data once when the app initializes
    if (!initialized) {
      const loadUser = async () => {
        dispatch(setLoading(true));
        try {
          const currentUser = await UserService.getCurrentUser();
          if (currentUser) {
            dispatch(setUser(convertApiUserToUser(currentUser)));
          } else {
            dispatch(clearUser());
          }
        } catch (error) {
          console.error("Failed to load user:", error);
          dispatch(clearUser());
        } finally {
          dispatch(setLoading(false));
        }
      };

      loadUser();
    }
  }, [dispatch, initialized]);

  return <>{children}</>;
}
