import { useQuery } from "@tanstack/react-query";

import {
  getServiceCategories,
  getServices,
  type ServiceListParams,
} from "@/services/services";

export const serviceQueryKeys = {
  all: ["services"] as const,
  list: (params: ServiceListParams) => [...serviceQueryKeys.all, "list", params] as const,
  categories: () => [...serviceQueryKeys.all, "categories"] as const,
};

export function useServices(params: ServiceListParams) {
  return useQuery({
    queryKey: serviceQueryKeys.list(params),
    queryFn: () => getServices(params),
  });
}

export function useServiceCategories() {
  return useQuery({
    queryKey: serviceQueryKeys.categories(),
    queryFn: getServiceCategories,
    staleTime: 5 * 60_000,
  });
}
