import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createReview,
  getReviewsForService,
  type ReviewCreate,
  type ReviewListParams,
} from "@/services/reviews";
import { serviceQueryKeys } from "@/hooks/use-services";

export const reviewQueryKeys = {
  all: ["reviews"] as const,
  service: (serviceId: number, params?: ReviewListParams) =>
    [...reviewQueryKeys.all, "service", serviceId, params] as const,
};

export function useReviewsForService(serviceId: number, params?: ReviewListParams) {
  return useQuery({
    queryKey: reviewQueryKeys.service(serviceId, params),
    queryFn: () => getReviewsForService(serviceId, params),
    enabled: Boolean(serviceId),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewCreate) => createReview(payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all });
      void queryClient.invalidateQueries({
        queryKey: serviceQueryKeys.detail(variables.service_id),
      });
    },
  });
}
