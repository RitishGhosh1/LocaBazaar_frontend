import { useQuery } from "@tanstack/react-query";

import { getProviders } from "@/services/providers";

export const providerQueryKeys = {
  all: ["providers"] as const,
  list: () => [...providerQueryKeys.all, "list"] as const,
};

export function useProviders() {
  return useQuery({
    queryKey: providerQueryKeys.list(),
    queryFn: getProviders,
  });
}
