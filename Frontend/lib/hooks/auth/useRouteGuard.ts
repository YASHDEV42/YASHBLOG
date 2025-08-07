import { useAuth } from "./useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function useRouteGuard(
  options: {
    redirectTo?: string;
    requireAuth?: boolean;
    redirectIfAuthenticated?: boolean;
  } = {}
) {
  const { user, loading, initialized } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);
  const {
    redirectTo = "/login",
    requireAuth = true,
    redirectIfAuthenticated = false,
  } = options;

  useEffect(() => {
    if (loading || !initialized) {
      hasRedirected.current = false;
      return;
    }

    if (hasRedirected.current) return;

    if (requireAuth && !user) {
      hasRedirected.current = true;
      router.replace(redirectTo);
    }

    if (redirectIfAuthenticated && user) {
      hasRedirected.current = true;
      router.replace("/");
    }
  }, [
    user,
    loading,
    initialized,
    router,
    redirectTo,
    requireAuth,
    redirectIfAuthenticated,
  ]);

  return {
    isAuthenticated: !!user,
    isLoading: loading || !initialized,
    shouldRender:
      initialized &&
      !loading &&
      (requireAuth ? !!user : !redirectIfAuthenticated || !user),
  };
}
