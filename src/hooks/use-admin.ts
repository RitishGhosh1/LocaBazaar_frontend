import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deactivateUser,
  deleteAdminReview,
  deleteUser,
  getAdminBookings,
  getAdminProviders,
  getAdminReviews,
  getAdminServices,
  getAdminUsers,
  getPlatformStats,
  suspendService,
  unsuspendService,
  updateAdminBookingStatus,
} from "@/services/admin";
import { bookingQueryKeys } from "@/hooks/use-bookings";
import { reviewQueryKeys } from "@/hooks/use-reviews";
import { serviceQueryKeys } from "@/hooks/use-services";

export const adminQueryKeys = {
  all: ["admin"] as const,
  stats: () => [...adminQueryKeys.all, "stats"] as const,
  providers: () => [...adminQueryKeys.all, "providers"] as const,
  users: () => [...adminQueryKeys.all, "users"] as const,
  services: () => [...adminQueryKeys.all, "services"] as const,
  bookings: () => [...adminQueryKeys.all, "bookings"] as const,
  reviews: () => [...adminQueryKeys.all, "reviews"] as const,
};

export function usePlatformStats(enabled = true) {
  return useQuery({
    queryKey: adminQueryKeys.stats(),
    queryFn: getPlatformStats,
    enabled,
    retry: false,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: adminQueryKeys.users(),
    queryFn: getAdminUsers,
  });
}

export function useAdminProviders() {
  return useQuery({
    queryKey: adminQueryKeys.providers(),
    queryFn: getAdminProviders,
  });
}

export function useAdminServices() {
  return useQuery({
    queryKey: adminQueryKeys.services(),
    queryFn: getAdminServices,
  });
}

export function useAdminBookings() {
  return useQuery({
    queryKey: adminQueryKeys.bookings(),
    queryFn: getAdminBookings,
  });
}

export function useAdminReviews() {
  return useQuery({
    queryKey: adminQueryKeys.reviews(),
    queryFn: getAdminReviews,
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() });
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.providers() });
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() });
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.providers() });
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() });
    },
  });
}

export function useSuspendService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: suspendService,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.services() });
      void queryClient.invalidateQueries({ queryKey: serviceQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() });
    },
  });
}

export function useUnsuspendService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unsuspendService,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.services() });
      void queryClient.invalidateQueries({ queryKey: serviceQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() });
    },
  });
}

export function useUpdateAdminBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminBookingStatus,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.bookings() });
      void queryClient.invalidateQueries({ queryKey: bookingQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() });
    },
  });
}

export function useDeleteAdminReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminReview,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.reviews() });
      void queryClient.invalidateQueries({ queryKey: reviewQueryKeys.all });
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() });
    },
  });
}
