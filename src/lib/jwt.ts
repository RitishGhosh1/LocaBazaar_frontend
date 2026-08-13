/**
 * Client-side JWT payload decoding for UI routing and non-sensitive claims recovery.
 */

export interface DecodedAccessToken {
  sub: string | null;
  name: string | null;
  id: number | null;
  role: string | null;
  isSuperuser: boolean;
  expiresAt: number | null;
}

interface JwtPayload {
  sub?: string;
  name?: string;
  id?: number;
  user_id?: number;
  role?: string;
  is_superuser?: boolean;
  exp?: number;
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
}

export function decodeAccessToken(token: string | null | undefined): DecodedAccessToken | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as JwtPayload;

    return {
      sub: payload.sub ?? null,
      name: payload.name ?? (payload.sub ? payload.sub.split("@")[0] : null),
      id: typeof payload.id === "number" ? payload.id : (typeof payload.user_id === "number" ? payload.user_id : null),
      role: typeof payload.role === "string" ? payload.role : null,
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

