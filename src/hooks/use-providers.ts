import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  becomeProvider,
  deleteProviderAccount,
  getProviderProfile,
  getProviders,
  updateProviderProfile,
} from "@/services/providers";
import { resendVerificationEmail } from "@/services/auth";

export const providerQueryKeys = {
  all: ["providers"] as const,
  list: () => [...providerQueryKeys.all, "list"] as const,
  profile: () => [...providerQueryKeys.all, "profile"] as const,
};

export function useProviders() {
  return useQuery({
    queryKey: providerQueryKeys.list(),
    queryFn: getProviders,
  });
}

export function useProviderProfile() {
  return useQuery({
    queryKey: providerQueryKeys.profile(),
    queryFn: getProviderProfile,
  });
}

export function useUpdateProviderProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProviderProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: providerQueryKeys.all });
    },
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

export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: resendVerificationEmail,
  });
}




