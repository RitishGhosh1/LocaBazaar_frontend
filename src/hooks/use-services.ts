import { useQuery } from "@tanstack/react-query";

import {
  getService,
  getServiceCategories,
  getServices,
  type ServiceListParams,
} from "@/services/services";

export const serviceQueryKeys = {
  all: ["services"] as const,
  list: (params: ServiceListParams) => [...serviceQueryKeys.all, "list", params] as const,
  detail: (serviceId: number) => [...serviceQueryKeys.all, "detail", serviceId] as const,
  categories: () => [...serviceQueryKeys.all, "categories"] as const,
};

export function useServices(params: ServiceListParams) {
  return useQuery({
    queryKey: serviceQueryKeys.list(params),
    queryFn: () => getServices(params),
  });
}

export function useService(serviceId: number) {
  return useQuery({
    queryKey: serviceQueryKeys.detail(serviceId),
    queryFn: () => getService(serviceId),
    enabled: Boolean(serviceId),
  });
}

export function useServiceCategories() {
  return useQuery({
    queryKey: serviceQueryKeys.categories(),
    queryFn: getServiceCategories,
    staleTime: 5 * 60_000,
  });
}

export function useServicesMap() {
  const { data } = useServices({ limit: 100 });
  return new Map((data?.items ?? []).map((service) => [service.id, service.name]));
}


