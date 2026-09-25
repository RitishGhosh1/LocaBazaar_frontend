import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createService,
  getMyServices,
  toggleServiceStatus,
  updateService,
  deleteService,
  type ServiceUpdatePayload,
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

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, payload }: { serviceId: number; payload: ServiceUpdatePayload }) =>
      updateService(serviceId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: providerServiceQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: serviceQueryKeys.all });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: number) => deleteService(serviceId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: providerServiceQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: serviceQueryKeys.all });
    },
  });
}
