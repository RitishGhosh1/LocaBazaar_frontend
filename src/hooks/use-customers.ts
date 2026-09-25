import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteCustomerAccount,
  getCustomerProfile,
  updateCustomerProfile,
} from "@/services/customers";
import { resendVerificationEmail } from "@/services/auth";

export const customerQueryKeys = {
  all: ["customers"] as const,
  profile: () => [...customerQueryKeys.all, "profile"] as const,
};

export function useCustomerProfile() {
  return useQuery({
    queryKey: customerQueryKeys.profile(),
    queryFn: getCustomerProfile,
  });
}

export function useUpdateCustomerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomerProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerQueryKeys.all });
    },
  });
}

export function useDeleteCustomerAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomerAccount,
    onSuccess: () => {
      void queryClient.invalidateQueries();
    },
  });
}

export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: resendVerificationEmail,
  });
}


