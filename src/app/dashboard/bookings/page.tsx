"use client";

import { useState } from "react";
import { CalendarDays, Edit2, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { BookingList } from "@/components/dashboard/booking-list";
import {
  EmptyState,
  ErrorState,
  LoadingScreen,
  PageHeader,
} from "@/components/dashboard/dashboard-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBookings, useCancelBooking } from "@/hooks/use-bookings";
import {
  useCreateReview,
  useDeleteReview,
  useMyReviews,
  useUpdateReview,
} from "@/hooks/use-reviews";
import { getApiErrorMessage } from "@/lib/api-error";
import type { Booking } from "@/services/bookings";

export default function CustomerBookingsPage() {
  const bookingsQuery = useBookings({ limit: 100 });
  const cancelBookingMutation = useCancelBooking();
  const myReviewsQuery = useMyReviews();
  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  const [reviewingBookingId, setReviewingBookingId] = useState<number | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const bookings = bookingsQuery.data?.items ?? [];
  const myReviews = myReviewsQuery.data ?? [];

  async function handleCancelBooking(bookingId: number) {
    try {
      await cancelBookingMutation.mutateAsync(bookingId);
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to cancel booking"));
    }
  }

  async function handleReviewSubmit(serviceId: number) {
    try {
      await createReviewMutation.mutateAsync({
        service_id: serviceId,
        rating,
        comment: comment.trim() || null,
      });
      toast.success("Review submitted successfully!");
      setReviewingBookingId(null);
      setComment("");
      setRating(5);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to submit review"));
    }
  }

  async function handleReviewUpdate(reviewId: number) {
    try {
      await updateReviewMutation.mutateAsync({
        reviewId,
        payload: {
          rating,
          comment: comment.trim() || null,
        },
      });
      toast.success("Review updated successfully!");
      setEditingReviewId(null);
      setComment("");
      setRating(5);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update review"));
    }
  }

  async function handleReviewDelete(reviewId: number) {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReviewMutation.mutateAsync(reviewId);
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete review"));
    }
  }

  function renderActions(booking: Booking) {
    if (booking.status === "completed") {
      const existingReview = myReviews.find((r) => r.service_id === booking.service_id);
      const isCreating = reviewingBookingId === booking.id;
      const isEditing = existingReview && editingReviewId === existingReview.id;

      if (isCreating || isEditing) {
        return (
          <div className="rounded-lg border bg-card p-3 space-y-3 min-w-[240px]">
            <div className="space-y-1">
              <Label className="text-xs">
                {isEditing ? "Update Rating (1 to 5 stars)" : "Rating (1 to 5 stars)"}
              </Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-0.5 focus:outline-none"
                  >
                    <Star
                      className={`size-4 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor={`comment-${booking.id}`} className="text-xs">
                Comment (optional)
              </Label>
              <Input
                id={`comment-${booking.id}`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="h-8 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="h-7 text-xs"
                disabled={createReviewMutation.isPending || updateReviewMutation.isPending}
                onClick={() =>
                  isEditing
                    ? handleReviewUpdate(existingReview.id)
                    : handleReviewSubmit(booking.service_id)
                }
              >
                {createReviewMutation.isPending || updateReviewMutation.isPending
                  ? "Saving…"
                  : isEditing
                  ? "Update Review"
                  : "Submit"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => {
                  setReviewingBookingId(null);
                  setEditingReviewId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        );
      }

      if (existingReview) {
        return (
          <div className="rounded-lg border bg-secondary/30 p-2.5 space-y-2 min-w-[210px] text-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span>{existingReview.rating}.0 / 5</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditingReviewId(existingReview.id);
                    setRating(existingReview.rating);
                    setComment(existingReview.comment || "");
                  }}
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                  title="Edit Review"
                >
                  <Edit2 className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewDelete(existingReview.id)}
                  className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Delete Review"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            </div>
            {existingReview.comment && (
              <p className="line-clamp-2 text-[11px] text-muted-foreground italic">
                “{existingReview.comment}”
              </p>
            )}
          </div>
        );
      }

      return (
        <div className="space-y-3">
          <Button
            size="sm"
            variant="outline"
            type="button"
            onClick={() => {
              setReviewingBookingId(booking.id);
              setRating(5);
              setComment("");
            }}
          >
            <Star className="mr-1.5 size-3.5 fill-amber-400 text-amber-400" />
            Write Review
          </Button>
        </div>
      );
    }

    if (booking.status === "pending" || booking.status === "confirmed") {
      return (
        <Button
          size="sm"
          variant="outline"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 text-xs h-8"
          disabled={cancelBookingMutation.isPending}
          onClick={() => handleCancelBooking(booking.id)}
        >
          {cancelBookingMutation.isPending ? "Cancelling…" : "Cancel Booking"}
        </Button>
      );
    }

    return null;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My bookings"
        description="View and track all bookings you've made on LocaBazaar."
      />

      {bookingsQuery.isLoading ? (
        <LoadingScreen message="Loading your bookings…" />
      ) : bookingsQuery.isError ? (
        <ErrorState
          title="Unable to load bookings"
          description="Please try again in a moment."
          onRetry={() => bookingsQuery.refetch()}
        />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No bookings yet"
          description="When you book a service, it will show up here."
          action={{ label: "Explore services", href: "/explore" }}
        />
      ) : (
        <BookingList bookings={bookings} actions={renderActions} />
      )}
    </div>
  );
}

