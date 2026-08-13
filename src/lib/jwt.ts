/**
 * Client-side JWT payload decoding for UI routing only.
 *
 * LIMITATION: There is no `/me` or session-validation endpoint. Role information
 * is inferred from unverified JWT claims until a profile endpoint exists.
 * Do not use these values for security-sensitive decisions on the server.
 */

import type { components } from "@/types/api";

export type UserRole = components["schemas"]["UserRole"];

export interface DecodedAccessToken {
  sub: string | null;
  role: UserRole | null;
  isSuperuser: boolean;
  expiresAt: number | null;
}

interface JwtPayload {
  sub?: string;
  role?: string;
  is_superuser?: boolean;
  exp?: number;
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
}

function isUserRole(value: string | undefined): value is UserRole {
  return value === "customer" || value === "provider";
}

export function decodeAccessToken(token: string | null | undefined): DecodedAccessToken | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as JwtPayload;

    return {
      sub: payload.sub ?? null,
      role: isUserRole(payload.role) ? payload.role : null,
      isSuperuser: payload.is_superuser === true,
      expiresAt: typeof payload.exp === "number" ? payload.exp : null,
    };
  } catch {
    return null;
  }
}

export function isTokenExpired(decoded: DecodedAccessToken | null): boolean {
  if (!decoded?.expiresAt) return false;
  return decoded.expiresAt * 1000 <= Date.now();
}
