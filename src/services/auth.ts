import axios from "axios";

import api, { type ApiErrorResponse } from "@/services/api";

export const AUTH_ENDPOINTS = {
  login: "/auth/login",
  googleLogin: "/auth/login/google",
} as const;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthSession {
  access_token: string;
  token_type: string;
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
