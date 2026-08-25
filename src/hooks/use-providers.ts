import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { becomeProvider, deleteProviderAccount, getProviders } from "@/services/providers";

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

export function useDeleteProviderAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProviderAccount,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: providerQueryKeys.all });
    },
  });
}


