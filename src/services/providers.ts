import type { components } from "@/types/api";

import api from "@/services/api";

export type Provider = components["schemas"]["UserRead"];

export interface CreateProviderPayload {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  bio?: string | null;
}

export async function getProviders(): Promise<Provider[]> {
  const { data } = await api.get<Provider[]>("/providers/");
  return data;
}

export async function createProvider(payload: CreateProviderPayload): Promise<Provider> {
  const { data } = await api.post<Provider>("/providers/", payload);
  return data;
}

export async function becomeProvider(): Promise<Provider> {
  const { data } = await api.post<Provider>("/providers/me");
  return data;
}

export async function deleteProviderAccount(): Promise<void> {
  await api.delete("/providers/me");
}

export interface UpdateProviderProfilePayload {
  name?: string;
  phone?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
}

export async function getProviderProfile(): Promise<Provider> {
  const { data } = await api.get<Provider>("/providers/me");
  return data;
}

export async function updateProviderProfile(payload: UpdateProviderProfilePayload): Promise<Provider> {
  const { data } = await api.patch<Provider>("/providers/me", payload);
  return data;
}




