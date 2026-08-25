import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCustomerAccount } from "@/services/customers";

export function useDeleteCustomerAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomerAccount,
    onSuccess: () => {
      void queryClient.invalidateQueries();
    },
  });
}
