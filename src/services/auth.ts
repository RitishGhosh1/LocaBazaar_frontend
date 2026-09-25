import axios from "axios";

import api, { type ApiErrorResponse } from "@/services/api";

export const AUTH_ENDPOINTS = {
  login: "/auth/login",
  googleLogin: "/auth/login/google",
  verifyEmail: "/auth/verify-email",
  me: "/auth/me",
} as const;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  phone?: string | null;
  bio?: string | null;
  role: string;
  is_superuser: boolean;
  is_verified?: boolean;
}

export interface AuthSession {
  access_token: string;
  token_type: string;
  user?: AuthUser;
}

export class AuthApiError<TData = ApiErrorResponse> extends Error {
  readonly status: number | undefined;
  readonly data: TData | undefined;

  constructor(message: string, status?: number, data?: TData) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.data = data;
  }
}

function getErrorMessage(data: ApiErrorResponse | undefined, fallback: string): string {
  if (typeof data?.detail === "string") return data.detail;
  return data?.message ?? fallback;
}

function toAuthApiError(error: unknown): AuthApiError {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;
    return new AuthApiError(
      getErrorMessage(data, error.message),
      error.response?.status,
      data,
    );
  }

  return new AuthApiError(error instanceof Error ? error.message : "Authentication request failed");
}

export async function login(credentials: LoginRequest): Promise<AuthSession> {
  const formData = new URLSearchParams({
    username: credentials.email,
    password: credentials.password,
  });

  try {
    const { data } = await api.post<AuthSession>(AUTH_ENDPOINTS.login, formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return data;
  } catch (error) {
    throw toAuthApiError(error);
  }
}

export interface VerifyEmailResponse {
  message: string;
}

export async function verifyEmail(token: string): Promise<VerifyEmailResponse> {
  try {
    const { data } = await api.get<VerifyEmailResponse>(AUTH_ENDPOINTS.verifyEmail, {
      params: { token },
    });
    return data;
  } catch (error) {
    throw toAuthApiError(error);
  }
}

export async function resendVerificationEmail(): Promise<VerifyEmailResponse> {
  try {
    const { data } = await api.post<VerifyEmailResponse>(AUTH_ENDPOINTS.verifyEmail);
    return data;
  } catch (error) {
    throw toAuthApiError(error);
  }
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string | null;
  bio?: string | null;
}

export async function getCurrentUser(): Promise<AuthUser> {
  try {
    const { data } = await api.get<AuthUser>(AUTH_ENDPOINTS.me);
    return data;
  } catch (error) {
    throw toAuthApiError(error);
  }
}

export async function updateCurrentUser(payload: UpdateProfileRequest): Promise<AuthUser> {
  try {
    const { data } = await api.patch<AuthUser>(AUTH_ENDPOINTS.me, payload);
    return data;
  } catch (error) {
    throw toAuthApiError(error);
  }
}

