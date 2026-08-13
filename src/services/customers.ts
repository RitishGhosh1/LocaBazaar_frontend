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
