"use client";

import { useState } from "react";
import { CalendarDays, Star } from "lucide-react";
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
import { useBookings } from "@/hooks/use-bookings";
import { useCreateReview } from "@/hooks/use-reviews";
import { getApiErrorMessage } from "@/lib/api-error";
import type { Booking } from "@/services/bookings";

export default function CustomerBookingsPage() {
  const bookingsQuery = useBookings({ limit: 100 });
  const createReviewMutation = useCreateReview();
  const [reviewingBookingId, setReviewingBookingId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const bookings = bookingsQuery.data?.items ?? [];

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

  function renderActions(booking: Booking) {
    if (booking.status === "completed") {
      const isReviewing = reviewingBookingId === booking.id;

      return (
        <div className="space-y-3">
          {!isReviewing ? (
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
          ) : (
            <div className="rounded-lg border bg-card p-3 space-y-3 min-w-[240px]">
              <div className="space-y-1">
                <Label className="text-xs">Rating (1 to 5 stars)</Label>
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
                  disabled={createReviewMutation.isPending}
                  onClick={() => handleReviewSubmit(booking.service_id)}
                >
                  {createReviewMutation.isPending ? "Posting…" : "Submit"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => setReviewingBookingId(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
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

