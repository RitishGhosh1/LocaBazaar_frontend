/**
 * Centralized role resolution for dashboard route protection.
 * Rule:
 * 1. is_superuser === true -> /admin/dashboard (SUPERUSER WINS)
 * 2. role === "provider" -> /provider/dashboard
 * 3. otherwise -> /dashboard
 */

import { decodeAccessToken } from "@/lib/jwt";
import type { AuthUser } from "@/services/auth";

export type AppRole = "customer" | "provider" | "superadmin";

export interface ResolvedRole {
  appRole: AppRole;
  jwtRole: string | null;
  isSuperuser: boolean;
  subject: string | null;
  source: "user" | "jwt" | "fallback";
}

export function resolveRoleFromUserOrToken(
  user: AuthUser | null | undefined,
  accessToken: string | null,
): ResolvedRole | null {
  const decoded = decodeAccessToken(accessToken);
  if (!user && !decoded) return null;

  // SUPERUSER WINS
  if (user?.is_superuser || decoded?.isSuperuser) {
    return {
      appRole: "superadmin",
      jwtRole: user?.role ?? decoded?.role ?? null,
      isSuperuser: true,
      subject: user?.email ?? decoded?.sub ?? null,
      source: user ? "user" : "jwt",
    };
  }

  if (user?.role === "provider" || decoded?.role === "provider") {
    return {
      appRole: "provider",
      jwtRole: "provider",
      isSuperuser: false,
      subject: user?.email ?? decoded?.sub ?? null,
      source: user ? "user" : "jwt",
    };
  }

  return {
    appRole: "customer",
    jwtRole: user?.role ?? decoded?.role ?? "customer",
    isSuperuser: false,
    subject: user?.email ?? decoded?.sub ?? null,
    source: user ? "user" : decoded?.role ? "jwt" : "fallback",
  };
}

export function resolveRoleFromToken(accessToken: string | null): ResolvedRole | null {
  return resolveRoleFromUserOrToken(null, accessToken);
}

export function canAccessRoute(appRole: AppRole, required: AppRole): boolean {
  if (required === "superadmin") return appRole === "superadmin";
  if (required === "provider") return appRole === "provider";
  return appRole === "customer";
}

export function getDefaultDashboardPath(appRole: AppRole): string {
  switch (appRole) {
    case "superadmin":
      return "/admin/dashboard";
    case "provider":
      return "/provider/dashboard";
    default:
      return "/dashboard";
  }
}

