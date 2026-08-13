import type { components } from "@/types/api";

import api from "@/services/api";

export type Booking = components["schemas"]["BookingRead"];
export type BookingStatus = components["schemas"]["BookingStatus"];
export type BookingCreate = components["schemas"]["BookingCreate"];
export type BookingStatusUpdate = components["schemas"]["BookingStatusUpdate"];
export type BookingListResponse = components["schemas"]["BookingListResponse"];

export interface BookingListParams {
  skip?: number | null;
  limit?: number;
  cursor?: number | null;
}

export async function getBookings(params: BookingListParams = {}): Promise<BookingListResponse> {
  const { data } = await api.get<BookingListResponse>("/bookings/", { params });
  return data;
}

export async function createBooking(payload: BookingCreate): Promise<Booking> {
  const { data } = await api.post<Booking>("/bookings/", payload);
  return data;
}

export async function updateBookingStatus(
  bookingId: number,
  payload: BookingStatusUpdate,
): Promise<Booking> {
  const { data } = await api.patch<Booking>(`/bookings/${bookingId}`, payload);
  return data;
}
