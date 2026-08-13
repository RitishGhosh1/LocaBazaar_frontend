"use client";

import { CalendarDays } from "lucide-react";

import { BookingList } from "@/components/dashboard/booking-list";
import {
  EmptyState,
  ErrorState,
  LoadingScreen,
  PageHeader,
} from "@/components/dashboard/dashboard-primitives";
import { useBookings } from "@/hooks/use-bookings";

export default function CustomerBookingsPage() {
  const bookingsQuery = useBookings({ limit: 100 });
  const bookings = bookingsQuery.data?.items ?? [];

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
        <BookingList bookings={bookings} />
      )}
    </div>
  );
}
