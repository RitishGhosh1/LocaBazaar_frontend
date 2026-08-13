"use client";

import { create } from "zustand";

import { decodeAccessToken, isTokenExpired, type DecodedAccessToken } from "@/lib/jwt";
import { resolveRoleFromDecoded, type ResolvedRole } from "@/lib/roles";
import {
  login as loginRequest,
} from "@/services/auth";
import { ACCESS_TOKEN_STORAGE_KEY } from "@/services/api";

export interface AuthState {
  accessToken: string | null;
  decodedToken: DecodedAccessToken | null;
  resolvedRole: ResolvedRole | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  setSession: (accessToken: string) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

function persistSession(accessToken: string): void {
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
}

function clearPersistedSession(): void {
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

function buildSessionState(accessToken: string | null): Pick<
  AuthState,
  "accessToken" | "decodedToken" | "resolvedRole" | "isAuthenticated"
> {
  if (!accessToken) {
    return {
      accessToken: null,
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
      decodedToken: null,
      resolvedRole: null,
      isAuthenticated: false,
    };
  }

  return {
    accessToken,
    decodedToken,
    resolvedRole: decodedToken ? resolveRoleFromDecoded(decodedToken) : null,
    isAuthenticated: true,
  };
}

function clearSession(
  set: (
    state: Pick<
      AuthState,
      "accessToken" | "decodedToken" | "resolvedRole" | "isAuthenticated"
    >,
  ) => void,
): void {
  clearPersistedSession();
  set({
    accessToken: null,
    decodedToken: null,
    resolvedRole: null,
    isAuthenticated: false,
  });
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  decodedToken: null,
  resolvedRole: null,
  isAuthenticated: false,
  isInitializing: true,

  login: async (email, password) => {
    const session = await loginRequest({ email, password });
    persistSession(session.access_token);
    set({ ...buildSessionState(session.access_token), isInitializing: false });
  },

  setSession: (accessToken) => {
    persistSession(accessToken);
    set({ ...buildSessionState(accessToken), isInitializing: false });
  },

  logout: () => {
    clearSession(set);
  },

  initialize: async () => {
    if (typeof window === "undefined") return;

    const accessToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (!accessToken) {
      set({
        accessToken: null,
        decodedToken: null,
        resolvedRole: null,
        isAuthenticated: false,
        isInitializing: false,
      });
      return;
    }

    const sessionState = buildSessionState(accessToken);
    if (!sessionState.isAuthenticated) {
      clearPersistedSession();
    }

    set({ ...sessionState, isInitializing: false });
  },
}));
