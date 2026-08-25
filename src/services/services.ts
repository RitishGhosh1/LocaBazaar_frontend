import type { components, operations } from "@/types/api";

import api from "@/services/api";
import { useAuthStore } from "@/store/auth-store";

export type ServiceListParams = NonNullable<
  operations["get_available_services_api_v1_services__get"]["parameters"]["query"]
>;
export type ServiceListResponse = components["schemas"]["ServiceListResponse"];
export type ServiceDetails = components["schemas"]["ServiceRead"];
export type ServiceShort = components["schemas"]["ServiceShortRead"];
export type ServiceCreate = components["schemas"]["ServiceCreate"];
export type ServiceCategory = components["schemas"]["CategoryRead"];

export async function getServices(params: ServiceListParams = {}): Promise<ServiceListResponse> {
  const queryParams: Record<string, string | number | boolean> = {};

  if (params.q) {
    queryParams.q = params.q;
  }
  if (params.category_id !== undefined && params.category_id !== null) {
    queryParams.category_id = params.category_id;
  }
  if (params.category_name) {
    queryParams.category_name = params.category_name;
  }
  if (params.min_price !== undefined && params.min_price !== null) {
    queryParams.min_price = params.min_price;
  }
  if (params.max_price !== undefined && params.max_price !== null) {
    queryParams.max_price = params.max_price;
  }
  if (params.limit !== undefined && params.limit !== null) {
    queryParams.limit = params.limit;
  }

  // Cursor pagination uses cursor + limit when cursor is present.
  // Offset pagination uses skip + limit when cursor is absent.
  // Do not mix skip and cursor in the same request.
  if (params.cursor !== undefined && params.cursor !== null) {
    queryParams.cursor = params.cursor;
  } else if (params.skip !== undefined && params.skip !== null) {
    queryParams.skip = params.skip;
  }

  const { data } = await api.get<ServiceListResponse>("/services/", { params: queryParams });
  return data;
}

export async function getService(serviceId: number): Promise<ServiceDetails> {
  const { data } = await api.get<ServiceDetails>(`/services/${serviceId}`);
  return data;
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const { data } = await api.get<ServiceCategory[]>("/categories/");
  return data;
}

export async function getMyServices(): Promise<ServiceDetails[]> {
  try {
    const { data } = await api.get<ServiceDetails[]>("/services/mine");
    return data;
  } catch {
    const user = useAuthStore.getState().user;
    if (user?.id) {
      const { data } = await api.get<ServiceDetails[]>(`/providers/${user.id}`);
      return data;
    }
    return [];
  }
}

export async function createService(payload: ServiceCreate): Promise<ServiceShort> {
  const { data } = await api.post<ServiceShort>("/services/", payload);
  return data;
}

export async function toggleServiceStatus(serviceId: number): Promise<ServiceDetails> {
  const { data } = await api.patch<ServiceDetails>(`/services/${serviceId}/toggle`);
  return data;
}
