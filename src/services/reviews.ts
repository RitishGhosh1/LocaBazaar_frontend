import type { components } from "@/types/api";

import api from "@/services/api";

export type Review = components["schemas"]["ReviewRead"];
export type ReviewCreate = components["schemas"]["ReviewCreate"];
export type ReviewListResponse = components["schemas"]["ReviewListResponse"];

export interface ReviewListParams {
  skip?: number;
  limit?: number;
  cursor?: number | null;
}

export async function createReview(payload: ReviewCreate): Promise<ReviewCreate> {
  const { data } = await api.post<ReviewCreate>("/reviews/", payload);
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
