"use client";

import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  EmptyState,
  ErrorState,
  LoadingScreen,
  PageHeader,
} from "@/components/dashboard/dashboard-primitives";
import { Button } from "@/components/ui/button";
import { useAdminReviews, useAdminUsers, useDeleteAdminReview } from "@/hooks/use-admin";
import { useServicesMap } from "@/hooks/use-services";
import { getApiErrorMessage } from "@/lib/api-error";

export default function AdminReviewsPage() {
  const reviewsQuery = useAdminReviews();
  const usersQuery = useAdminUsers();
  const serviceNames = useServicesMap();
  const deleteReviewMutation = useDeleteAdminReview();

  const userNames = new Map((usersQuery.data ?? []).map((u) => [u.id, u.name]));
  const reviews = reviewsQuery.data?.items ?? [];

  async function handleDelete(reviewId: number) {
    if (!window.confirm(`Permanently delete review #${reviewId}?`)) {
      return;
    }

    try {
      await deleteReviewMutation.mutateAsync(reviewId);
      toast.success(`Review #${reviewId} deleted`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete review"));
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Review moderation"
        description="Platform-wide reviews across all services. Remove inappropriate or policy-violating review content."
      />

      {reviewsQuery.isLoading ? (
        <LoadingScreen message="Loading reviews…" />
      ) : reviewsQuery.isError ? (
        <ErrorState
          title="Unable to load reviews"
          description="Superuser authorization is required."
          onRetry={() => reviewsQuery.refetch()}
        />
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No reviews posted"
          description="Customer reviews will appear here once submitted."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Rating</th>
                  <th className="px-4 py-3 font-medium">Comment</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => {
                  const serviceName = serviceNames.get(review.service_id) ?? `#${review.service_id}`;
                  const userName = userNames.get(review.user_id) ?? `#${review.user_id}`;

                  return (
                    <tr key={review.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">#{review.id}</td>
                      <td className="px-4 py-3 font-medium">{serviceName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{userName}</td>
                      <td className="px-4 py-3 font-medium">
                        <span className="inline-flex items-center gap-1">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          {review.rating}/5
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-md truncate">
                        {review.comment || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="destructive"
                          type="button"
                          disabled={deleteReviewMutation.isPending}
                          onClick={() => handleDelete(review.id)}
                        >
                          <Trash2 className="size-3.5" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
