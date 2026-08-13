import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { becomeProvider, getProviders } from "@/services/providers";

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

export function useBecomeProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: becomeProvider,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: providerQueryKeys.all });
    },
  });
}

