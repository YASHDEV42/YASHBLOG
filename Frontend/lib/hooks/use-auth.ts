import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { clearUser, setUser } from "@/redux/slices/userSlice";
import { UserService } from "@/lib/services/user.service";
import { convertApiUserToUser } from "@/types";

/**
 * Custom hook for authentication state and actions
 * Provides a clean interface for components to interact with auth
 */
export function useAuth() {
  const dispatch = useDispatch();
  const { user, loading, initialized, error } = useSelector(
    (state: RootState) => state.user
  );

  /**
   * Login and update global state
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await UserService.login({ email, password });
      dispatch(setUser(convertApiUserToUser(response.user)));
      return { success: true, message: response.message };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      return { success: false, message: errorMessage };
    }
  };
  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      const response = await UserService.register({
        email,
        password,
        username,
      });
      dispatch(setUser(convertApiUserToUser(response.user)));
      return { success: true, message: response.message };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Logout and clear global state
   */
  const logout = async () => {
    try {
      await UserService.logout();
      dispatch(clearUser());
      return { success: true };
    } catch (error: unknown) {
      // Clear local state even if API call fails
      dispatch(clearUser());
      const errorMessage =
        error instanceof Error ? error.message : "Logout failed";
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    try {
      const currentUser = await UserService.getCurrentUser();
      if (currentUser) {
        dispatch(setUser(convertApiUserToUser(currentUser)));
      } else {
        dispatch(clearUser());
      }
      return currentUser;
    } catch {
      dispatch(clearUser());
      return null;
    }
  };

  return {
    // State
    user,
    loading,
    initialized,
    error,
    isAuthenticated: !!user,

    // Actions
    login,
    register,
    logout,
    refreshUser,
  };
}

/**
 * Hook to check if user has specific permissions
 * Can be extended for role-based access control
 */
export function usePermissions() {
  const { user } = useAuth();

  return {
    canCreatePost: !!user,
    canEditPost: (postAuthorId: string) => user?._id === postAuthorId, // Using Prisma id field
    canDeletePost: (postAuthorId: string) => user?._id === postAuthorId, // Using Prisma id field
    isAdmin: false, // Extend this based on your user roles
  };
}
