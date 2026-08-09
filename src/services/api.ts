import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

export const ACCESS_TOKEN_STORAGE_KEY = "access_token";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export interface ApiErrorResponse {
  detail?: string | { msg?: string; type?: string }[];
  message?: string;
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

function isLoginRequest(config: InternalAxiosRequestConfig): boolean {
  return config.url?.replace(/\/$/, "") === "/auth/login";
}

function attachRequestDefaults(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const headers = AxiosHeaders.from(config.headers);

  if (config.data !== undefined && !headers.getContentType()) {
    headers.setContentType("application/json");
  }

  const accessToken = getAccessToken();
  if (accessToken && !isLoginRequest(config) && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  config.headers = headers;
  return config;
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(attachRequestDefaults);
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => Promise.reject(error),
);

export default api;
