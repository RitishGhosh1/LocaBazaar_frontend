import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createReview,
  updateReview,
  deleteReview,
  getMyReviews,
  getReviewsForService,
  type Review,
  type ReviewCreate,
  type ReviewUpdate,
  type ReviewListParams,
} from "@/services/reviews";
import { serviceQueryKeys } from "@/hooks/use-services";

export const reviewQueryKeys = {
  all: ["reviews"] as const,
  mine: () => [...reviewQueryKeys.all, "mine"] as const,
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

export function useMyReviews() {
  return useQuery({
    queryKey: reviewQueryKeys.mine(),
    queryFn: getMyReviews,
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

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, payload }: { reviewId: number; payload: ReviewUpdate }) =>
      updateReview(reviewId, payload),
    onSuccess: (updatedReview) => {
      void queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all });
      if (updatedReview?.service_id) {
        void queryClient.invalidateQueries({
          queryKey: serviceQueryKeys.detail(updatedReview.service_id),
        });
      }
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: serviceQueryKeys.all });
    },
  });
}
