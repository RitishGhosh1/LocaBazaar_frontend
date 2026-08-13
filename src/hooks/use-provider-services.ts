import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createService,
  getMyServices,
  toggleServiceStatus,
} from "@/services/services";
import { serviceQueryKeys } from "@/hooks/use-services";

export const providerServiceQueryKeys = {
  all: ["provider-services"] as const,
  mine: () => [...providerServiceQueryKeys.all, "mine"] as const,
};

export function useMyServices() {
  return useQuery({
    queryKey: providerServiceQueryKeys.mine(),
    queryFn: getMyServices,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: providerServiceQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: serviceQueryKeys.all });
    },
  });
}

export function useToggleServiceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleServiceStatus,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: providerServiceQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: serviceQueryKeys.all });
    },
  });
}
