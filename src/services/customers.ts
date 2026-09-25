import type { components } from "@/types/api";

import api from "@/services/api";

export type CustomerRead = components["schemas"]["UserRead"];

export interface CustomerCreate {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  bio?: string | null;
}

export async function createCustomer(payload: CustomerCreate): Promise<CustomerRead> {
  const { data } = await api.post<CustomerRead>("/customers/", payload);
  return data;
}

export async function deleteCustomerAccount(): Promise<void> {
  await api.delete("/customers/me");
}

export interface UpdateCustomerProfilePayload {
  name?: string;
  phone?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
}

export async function getCustomerProfile(): Promise<CustomerRead> {
  const { data } = await api.get<CustomerRead>("/customers/me");
  return data;
}

export async function updateCustomerProfile(payload: UpdateCustomerProfilePayload): Promise<CustomerRead> {
  const { data } = await api.patch<CustomerRead>("/customers/me", payload);
  return data;
}


