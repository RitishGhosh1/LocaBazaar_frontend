import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deactivateUser,
  deleteUser,
  getPlatformStats,
  suspendService,
} from "@/services/admin";
import { getProviders } from "@/services/providers";
import { serviceQueryKeys } from "@/hooks/use-services";

export const adminQueryKeys = {
  all: ["admin"] as const,
  stats: () => [...adminQueryKeys.all, "stats"] as const,
  providers: () => [...adminQueryKeys.all, "providers"] as const,
};

export function usePlatformStats(enabled = true) {
  return useQuery({
    queryKey: adminQueryKeys.stats(),
    queryFn: getPlatformStats,
    enabled,
    retry: false,
  });
}

export function useAdminProviders() {
  return useQuery({
    queryKey: adminQueryKeys.providers(),
    queryFn: getProviders,
  });
}

export function useDeactivateUser() {
  return useMutation({ mutationFn: deactivateUser });
}

export function useDeleteUser() {
  return useMutation({ mutationFn: deleteUser });
}

export function useSuspendService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: suspendService,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: serviceQueryKeys.all });
    },
  });
}
