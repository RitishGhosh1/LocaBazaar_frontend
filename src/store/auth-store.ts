"use client";

import { create } from "zustand";

import {
  login as loginRequest,
} from "@/services/auth";
import { ACCESS_TOKEN_STORAGE_KEY } from "@/services/api";

export interface AuthState {
  accessToken: string | null;
  user: null;
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

function clearSession(set: (state: Pick<AuthState, "accessToken" | "user" | "isAuthenticated">) => void): void {
  clearPersistedSession();
  set({ accessToken: null, user: null, isAuthenticated: false });
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitializing: true,

  login: async (email, password) => {
    const session = await loginRequest({ email, password });
    persistSession(session.access_token);
    set({ accessToken: session.access_token, user: null, isAuthenticated: true, isInitializing: false });
  },

  setSession: (accessToken) => {
    persistSession(accessToken);
    set({ accessToken, user: null, isAuthenticated: true, isInitializing: false });
  },

  logout: () => {
    clearSession(set);
  },

  initialize: async () => {
    if (typeof window === "undefined") return;

    const accessToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (!accessToken) {
      set({ accessToken: null, user: null, isAuthenticated: false, isInitializing: false });
      return;
    }

    // The API has no session-validation endpoint; restore the persisted JWT locally.
    set({ accessToken, user: null, isAuthenticated: true, isInitializing: false });
  },
}));
