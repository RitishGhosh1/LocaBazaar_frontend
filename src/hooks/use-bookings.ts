import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createBooking,
  getBookings,
  updateBookingStatus,
  type BookingListParams,
  type BookingStatusUpdate,
} from "@/services/bookings";

export const bookingQueryKeys = {
  all: ["bookings"] as const,
  list: (params: BookingListParams) => [...bookingQueryKeys.all, "list", params] as const,
};

export function useBookings(params: BookingListParams = { limit: 50 }) {
  return useQuery({
    queryKey: bookingQueryKeys.list(params),
    queryFn: () => getBookings(params),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookingQueryKeys.all });
    },
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, payload }: { bookingId: number; payload: BookingStatusUpdate }) =>
      updateBookingStatus(bookingId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookingQueryKeys.all });
    },
  });
}
