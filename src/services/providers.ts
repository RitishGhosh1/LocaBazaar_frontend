import type { components } from "@/types/api";

import api from "@/services/api";

export type Provider = components["schemas"]["UserRead"];

export async function getProviders(): Promise<Provider[]> {
  const { data } = await api.get<Provider[]>("/providers/");
  return data;
}
