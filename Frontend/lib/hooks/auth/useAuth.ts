import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  clearUser,
  setUser,
  setLoading,
  setError,
} from "@/redux/slices/userSlice";
import { axiosInstance, setAccessToken } from "@/lib/axios"; // ✅ use from axios.js
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

  useEffect(() => {
    const init = async () => {
      dispatch(setLoading(true));
      try {
        // Try fetching current user (axios will refresh token if needed)
        const userRes = await axiosInstance.get("/user/current");
        dispatch(setUser(userRes.data.user));
      } catch (error: unknown) {
        dispatch(setUser(null));
        dispatch(setError("Not authenticated"));
        console.error("Failed to fetch current user:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    if (!initialized) {
      init();
    }
  }, [dispatch, initialized]);

  const login = async (email: string, password: string) => {
    const result = await loginMutation.mutateAsync({ email, password });
    if (result?.accessToken) setAccessToken(result.accessToken); // ✅ correct function
    if (result?.user) dispatch(setUser(result.user));
    return result;
  };

  const register = async (email: string, password: string, name: string) => {
    const result = await registerMutation.mutateAsync({
      email,
      password,
      name,
    });
    if (result?.accessToken) setAccessToken(result.accessToken);
    if (result?.user) dispatch(setUser(result.user));
    return result;
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setAccessToken(null); // ✅ removes from memory + headers
    dispatch(clearUser());
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
