import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearUser, setUser } from "@/redux/slices/userSlice";
import { useLogin } from "./useLogin";
import { useRegister } from "./useRegister";
import { useLogout } from "./useLogout";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, loading, initialized, error } = useSelector(
    (state: RootState) => state.user
  );

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      if (result?.user) {
        dispatch(setUser(result.user));
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const result = await registerMutation.mutateAsync({
        email,
        password,
        name,
      });
      if (result?.user) {
        dispatch(setUser(result.user));
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const result = await logoutMutation.mutateAsync();
      dispatch(clearUser());
      return result;
    } catch (error) {
      dispatch(clearUser()); // Clear user even if logout fails
      throw error;
    }
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
  };
}
