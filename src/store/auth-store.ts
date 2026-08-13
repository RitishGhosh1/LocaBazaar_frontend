"use client";

import { create } from "zustand";

import { decodeAccessToken, isTokenExpired, type DecodedAccessToken } from "@/lib/jwt";
import { resolveRoleFromUserOrToken, type ResolvedRole } from "@/lib/roles";
import {
  login as loginRequest,
  type AuthUser,
} from "@/services/auth";
import { ACCESS_TOKEN_STORAGE_KEY } from "@/services/api";

export const USER_STORAGE_KEY = "auth_user";

export interface AuthState {
  accessToken: string | null;
  tokenType: string | null;
  user: AuthUser | null;
  decodedToken: DecodedAccessToken | null;
  resolvedRole: ResolvedRole | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  setSession: (accessToken: string, user?: AuthUser | null) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

function persistSession(accessToken: string, user?: AuthUser | null): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
  if (user) {
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(USER_STORAGE_KEY);
  }
}

function clearPersistedSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(USER_STORAGE_KEY);
}

function buildSessionState(
  accessToken: string | null,
  userOverride?: AuthUser | null,
): Pick<
  AuthState,
  "accessToken" | "tokenType" | "user" | "decodedToken" | "resolvedRole" | "isAuthenticated"
> {
  if (!accessToken) {
    return {
      accessToken: null,
      tokenType: null,
      user: null,
      decodedToken: null,
      resolvedRole: null,
      isAuthenticated: false,
    };
  }

  const decodedToken = decodeAccessToken(accessToken);
  const isExpired = isTokenExpired(decodedToken);

  if (isExpired) {
    return {
      accessToken: null,
      tokenType: null,
      user: null,
      decodedToken: null,
      resolvedRole: null,
      isAuthenticated: false,
    };
  }

  let finalUser: AuthUser | null = userOverride ?? null;

  if (!finalUser && decodedToken) {
    finalUser = {
      id: decodedToken.id ?? 0,
      email: decodedToken.sub ?? "",
      name: decodedToken.name ?? (decodedToken.sub ? decodedToken.sub.split("@")[0] : "User"),
      role: decodedToken.role ?? "customer",
      is_superuser: decodedToken.isSuperuser === true,
    };
  }

  const resolvedRole = resolveRoleFromUserOrToken(finalUser, accessToken);

  return {
    accessToken,
    tokenType: "bearer",
    user: finalUser,
    decodedToken,
    resolvedRole,
    isAuthenticated: true,
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  tokenType: null,
  user: null,
  decodedToken: null,
  resolvedRole: null,
  isAuthenticated: false,
  isInitializing: true,

  login: async (email, password) => {
    const session = await loginRequest({ email, password });
    const user = session.user ?? null;
    persistSession(session.access_token, user);
    set({
      ...buildSessionState(session.access_token, user),
      isInitializing: false,
    });
  },

  setSession: (accessToken, user) => {
    const sessionState = buildSessionState(accessToken, user);
    persistSession(accessToken, sessionState.user);
    set({ ...sessionState, isInitializing: false });
  },

  logout: () => {
    clearPersistedSession();
    set({
      accessToken: null,
      tokenType: null,
      user: null,
      decodedToken: null,
      resolvedRole: null,
      isAuthenticated: false,
    });
  },

  initialize: async () => {
    if (typeof window === "undefined") return;

    const accessToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    const rawUser = window.localStorage.getItem(USER_STORAGE_KEY);
    let user: AuthUser | null = null;

    if (rawUser) {
      try {
        user = JSON.parse(rawUser) as AuthUser;
      } catch {
        user = null;
      }
    }

    if (!accessToken) {
      set({
        accessToken: null,
        tokenType: null,
        user: null,
        decodedToken: null,
        resolvedRole: null,
        isAuthenticated: false,
        isInitializing: false,
      });
      return;
    }

    const sessionState = buildSessionState(accessToken, user);
    if (!sessionState.isAuthenticated) {
      clearPersistedSession();
    }

    set({ ...sessionState, isInitializing: false });
  },
}));

