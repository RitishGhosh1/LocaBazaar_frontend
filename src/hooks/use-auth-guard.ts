"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { canAccessRoute, type AppRole, getDefaultDashboardPath } from "@/lib/roles";
import { useAuthStore } from "@/store/auth-store";

interface UseAuthGuardOptions {
  requiredRole: AppRole;
  redirectTo?: string;
}

export function useAuthGuard({ requiredRole, redirectTo = "/login" }: UseAuthGuardOptions) {
  const router = useRouter();
  const { initialize, isAuthenticated, isInitializing, resolvedRole, accessToken } = useAuthStore();

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    if (isInitializing) return;

    if (!isAuthenticated || !accessToken) {
      router.replace(redirectTo);
      return;
    }

    if (resolvedRole && !canAccessRoute(resolvedRole.appRole, requiredRole)) {
      router.replace(getDefaultDashboardPath(resolvedRole.appRole));
    }
  }, [
    accessToken,
    isAuthenticated,
    isInitializing,
    redirectTo,
    requiredRole,
    resolvedRole,
    router,
  ]);

  const isAuthorized =
    !isInitializing &&
    isAuthenticated &&
    Boolean(resolvedRole && canAccessRoute(resolvedRole.appRole, requiredRole));

  return {
    isInitializing,
    isAuthenticated,
    isAuthorized,
    resolvedRole,
  };
}
