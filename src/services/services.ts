import type { components, operations } from "@/types/api";

import api from "@/services/api";

export type ServiceListParams = NonNullable<
  operations["get_available_services_api_v1_services__get"]["parameters"]["query"]
>;
export type ServiceListResponse = components["schemas"]["ServiceListResponse"];
export type ServiceDetails = components["schemas"]["ServiceRead"];
export type ServiceCategory = components["schemas"]["CategoryRead"];

export async function getServices(params: ServiceListParams = {}): Promise<ServiceListResponse> {
  const { data } = await api.get<ServiceListResponse>("/services/", { params });
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
