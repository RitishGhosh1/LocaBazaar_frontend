/**
 * Centralized role resolution for dashboard route protection.
 *
 * Primary source: JWT claims decoded client-side (see jwt.ts limitation).
 * Fallback: authenticated users without role claims are treated as customers.
 */

import { decodeAccessToken, type DecodedAccessToken, type UserRole } from "@/lib/jwt";

export type AppRole = "customer" | "provider" | "superadmin";

export interface ResolvedRole {
  appRole: AppRole;
  jwtRole: UserRole | null;
  isSuperuser: boolean;
  subject: string | null;
  source: "jwt" | "fallback";
}

export function resolveRoleFromToken(accessToken: string | null): ResolvedRole | null {
  const decoded = decodeAccessToken(accessToken);
  if (!decoded) return null;

  return resolveRoleFromDecoded(decoded);
}

export function resolveRoleFromDecoded(decoded: DecodedAccessToken): ResolvedRole {
  if (decoded.isSuperuser) {
    return {
      appRole: "superadmin",
      jwtRole: decoded.role,
      isSuperuser: true,
      subject: decoded.sub,
      source: decoded.role || decoded.isSuperuser ? "jwt" : "fallback",
    };
  }

  if (decoded.role === "provider") {
    return {
      appRole: "provider",
      jwtRole: "provider",
      isSuperuser: false,
      subject: decoded.sub,
      source: "jwt",
    };
  }

  return {
    appRole: "customer",
    jwtRole: decoded.role ?? "customer",
    isSuperuser: false,
    subject: decoded.sub,
    source: decoded.role ? "jwt" : "fallback",
  };
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
