import type { components } from "@/types/api";

import api from "@/services/api";

export type Review = components["schemas"]["ReviewRead"];
export type ReviewCreate = components["schemas"]["ReviewCreate"];
export type ReviewUpdate = components["schemas"]["ReviewUpdate"];
export type ReviewListResponse = components["schemas"]["ReviewListResponse"];

export interface ReviewListParams {
  skip?: number;
  limit?: number;
  cursor?: number | null;
}

export async function createReview(payload: ReviewCreate): Promise<Review> {
  const { data } = await api.post<Review>("/reviews/", payload);
  return data;
}

export async function updateReview(reviewId: number, payload: ReviewUpdate): Promise<Review> {
  const { data } = await api.patch<Review>(`/reviews/${reviewId}`, payload);
  return data;
}

export async function deleteReview(reviewId: number): Promise<void> {
  await api.delete(`/reviews/${reviewId}`);
}

export async function getMyReviews(): Promise<Review[]> {
  const { data } = await api.get<Review[]>("/reviews/mine");
  return data;
}

export async function getReview(reviewId: number): Promise<Review> {
  const { data } = await api.get<Review>(`/reviews/${reviewId}`);
  return data;
}

export async function getReviewsForService(
  serviceId: number,
  params: ReviewListParams = {},
): Promise<ReviewListResponse> {
  const { data } = await api.get<ReviewListResponse>(`/reviews/service/${serviceId}`, { params });
  return data;
}
