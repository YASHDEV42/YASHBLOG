import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearUser, setUser } from "@/redux/slices/userSlice";
import { useLogin } from "./useLogin";
import { useRegister } from "./useRegister";
import { useLogout } from "./useLogout";
import { useRefreshUser } from "./useRefreshUser";

/**
 * Custom hook for authentication state and actions
 */
export function useAuth() {
  const dispatch = useDispatch();
  const { user, loading, initialized, error } = useSelector(
    (state: RootState) => state.user
  );

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const { data: refreshedUser } = useRefreshUser();

  const login = async (email: string, password: string) => {
    const result = await loginMutation.mutateAsync({ email, password });
    if (result?.user) dispatch(setUser(result.user));
    return result;
  };

  const register = async (email: string, password: string, name: string) => {
    const result = await registerMutation.mutateAsync({
      email,
      password,
      name,
    });
    if (result?.user) dispatch(setUser(result.user));
    return result;
  };

  const logout = async () => {
    const result = await logoutMutation.mutateAsync();
    dispatch(clearUser());
    return result;
  };

  const refreshUser = async () => {
    if (refreshedUser) dispatch(setUser(refreshedUser));
    else dispatch(clearUser());
    return refreshedUser;
  };

  return {
    user,
    loading,
    initialized,
    error,
    isAuthenticated: !!user,

    login,
    register,
    logout,
    refreshUser,
  };
}
