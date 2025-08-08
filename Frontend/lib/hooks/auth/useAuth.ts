import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  clearUser,
  setUser,
  setLoading,
  setError,
} from "@/redux/slices/userSlice";
import axiosInstance from "@/lib/axios";
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

  const setAccessToken = (token: string) => {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  useEffect(() => {
    const init = async () => {
      dispatch(setLoading(true));
      try {
        // 1. silent refresh to obtain short-lived access token
        const refreshRes = await axiosInstance.post(
          "/user/refresh",
          {},
          { withCredentials: true }
        );
        const token = refreshRes.data?.accessToken;
        if (token) {
          setAccessToken(token);
          // 2. fetch current user
          const userRes = await axiosInstance.get("/user/current");
          dispatch(setUser(userRes.data.user));
        } else {
          dispatch(setUser(null));
        }
      } catch (err: any) {
        dispatch(setUser(null));
        dispatch(
          setError(err?.response?.data?.message || err.message || "Not authenticated")
        );
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
    if (result?.accessToken) setAccessToken(result.accessToken);
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
    delete axiosInstance.defaults.headers.common["Authorization"];
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
    setAccessToken,
  };
}
    setAccessToken, // exposed for refresh hook usage
  };
}
