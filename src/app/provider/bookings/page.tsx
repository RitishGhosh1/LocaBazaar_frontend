"use client";

import { CalendarDays } from "lucide-react";
import { toast } from "sonner";

import { BookingList } from "@/components/dashboard/booking-list";
import {
  EmptyState,
  ErrorState,
  LoadingScreen,
  PageHeader,
} from "@/components/dashboard/dashboard-primitives";
import { Button } from "@/components/ui/button";
import { useBookings, useUpdateBookingStatus } from "@/hooks/use-bookings";
import { getApiErrorMessage } from "@/lib/api-error";
import type { Booking } from "@/services/bookings";

export default function ProviderBookingsPage() {
  const bookingsQuery = useBookings({ limit: 100 });
  const updateMutation = useUpdateBookingStatus();
  const bookings = bookingsQuery.data?.items ?? [];

  async function updateStatus(booking: Booking, status: "confirmed" | "rejected" | "completed" | "cancelled") {
    try {
      await updateMutation.mutateAsync({ bookingId: booking.id, payload: { status } });
      toast.success(`Booking #${booking.id} marked as ${status}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update booking"));
    }
  }

  function renderActions(booking: Booking) {
    if (booking.status === "pending") {
      return (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            type="button"
            disabled={updateMutation.isPending}
            onClick={() => updateStatus(booking, "confirmed")}
          >
            Confirm
          </Button>
          <Button
            size="sm"
            variant="outline"
            type="button"
            disabled={updateMutation.isPending}
            onClick={() => updateStatus(booking, "rejected")}
          >
            Reject
          </Button>
        </div>
      );
    }

    if (booking.status === "confirmed") {
      return (
        <Button
          size="sm"
          variant="outline"
          type="button"
          disabled={updateMutation.isPending}
          onClick={() => updateStatus(booking, "completed")}
        >
          Mark completed
        </Button>
      );
    }

    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Provider bookings"
        description="Review and update booking status for your services."
      />

      {bookingsQuery.isLoading ? (
        <LoadingScreen message="Loading bookings…" />
      ) : bookingsQuery.isError ? (
        <ErrorState
          title="Unable to load bookings"
          description="Please try again."
          onRetry={() => bookingsQuery.refetch()}
        />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No bookings yet"
          description="Customer bookings for your services will appear here."
        />
      ) : (
        <BookingList bookings={bookings} showServiceLink={false} actions={renderActions} />
      )}
    </div>
  );
}
