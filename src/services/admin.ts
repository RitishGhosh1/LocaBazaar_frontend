import type { components } from "@/types/api";

import api from "@/services/api";

export type AdminUser = components["schemas"]["UserRead"];
export type AdminService = components["schemas"]["ServiceShortRead"];
export type AdminServiceList = components["schemas"]["ServiceListResponse"];
export type AdminBooking = components["schemas"]["BookingRead"] & { user_id: number };
export type AdminBookingList = components["schemas"]["BookingListResponse"];
export type AdminReview = components["schemas"]["ReviewRead"];
export type AdminReviewList = components["schemas"]["ReviewListResponse"];

export type PlatformStats = Record<string, number | string | null | undefined>;

export async function getPlatformStats(): Promise<PlatformStats> {
  const { data } = await api.get<PlatformStats>("/admin/dashboard/stats");
  return data;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<AdminUser[]>("/admin/users");
  return data;
}

export async function getAdminProviders(): Promise<AdminUser[]> {
  const { data } = await api.get<AdminUser[]>("/admin/providers");
  return data;
}

export async function getAdminServices(): Promise<AdminServiceList> {
  const { data } = await api.get<AdminServiceList>("/admin/services?limit=100");
  return data;
}

export async function getAdminBookings(): Promise<AdminBookingList> {
  const { data } = await api.get<AdminBookingList>("/admin/bookings?limit=100");
  return data;
}

export async function getAdminReviews(): Promise<AdminReviewList> {
  const { data } = await api.get<AdminReviewList>("/admin/reviews?limit=100");
  return data;
}

export async function deactivateUser(userId: number): Promise<unknown> {
  const { data } = await api.patch(`/admin/users/${userId}/deactivate`);
  return data;
}

export async function deleteUser(userId: number): Promise<unknown> {
  const { data } = await api.delete(`/admin/users/${userId}`);
  return data;
}

export async function suspendService(serviceId: number): Promise<unknown> {
  const { data } = await api.patch(`/admin/services/${serviceId}/suspend`);
  return data;
}

export async function unsuspendService(serviceId: number): Promise<unknown> {
  const { data } = await api.patch(`/admin/services/${serviceId}/unsuspend`);
  return data;
}

export async function updateAdminBookingStatus({
  bookingId,
  status,
}: {
  bookingId: number;
  status: string;
}): Promise<AdminBooking> {
  const { data } = await api.patch<AdminBooking>(`/admin/bookings/${bookingId}/status`, { status });
  return data;
}

export async function deleteAdminReview(reviewId: number): Promise<unknown> {
  const { data } = await api.delete(`/admin/reviews/${reviewId}`);
  return data;
}


