"use client";

import { CalendarClock, CalendarDays, CheckCircle2, Compass, Search } from "lucide-react";

import { BookingList } from "@/components/dashboard/booking-list";
import {
  EmptyState,
  ErrorState,
  LoadingScreen,
  PageHeader,
  QuickActionCard,
  SectionTitle,
  StatCard,
} from "@/components/dashboard/dashboard-primitives";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookings } from "@/hooks/use-bookings";
import { countBookingsByStatus } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";

export default function CustomerDashboardPage() {
  const { resolvedRole, user } = useAuthStore();
  const bookingsQuery = useBookings({ limit: 50 });
  const bookings = bookingsQuery.data?.items ?? [];
  const counts = countBookingsByStatus(bookings);

  const upcoming = bookings.filter((b) => b.status === "pending" || b.status === "confirmed");
  const completed = bookings.filter((b) => b.status === "completed");

  const greeting = user?.name || (resolvedRole?.subject?.includes("@")
    ? resolvedRole.subject.split("@")[0]
    : "Customer");

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${greeting}`}
        description="Track your bookings and discover local services on LocaBazaar."
      />

      {bookingsQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : bookingsQuery.isError ? (
        <ErrorState
          title="Unable to load bookings"
          description="We couldn't fetch your booking summary right now."
          onRetry={() => bookingsQuery.refetch()}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Pending" value={counts.pending} icon={CalendarClock} hint="Awaiting confirmation" />
          <StatCard label="Upcoming" value={counts.confirmed} icon={CalendarDays} hint="Confirmed bookings" />
          <StatCard label="Completed" value={counts.completed} icon={CheckCircle2} hint="Finished services" />
        </div>
      )}

      <section className="space-y-4">
        <SectionTitle>Upcoming bookings</SectionTitle>
        {bookingsQuery.isLoading ? (
          <LoadingScreen message="Loading bookings…" />
        ) : upcoming.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No upcoming bookings"
            description="Explore services to make your first booking."
            action={{ label: "Explore services", href: "/explore" }}
          />
        ) : (
          <BookingList bookings={upcoming} />
        )}
      </section>

      <section className="space-y-4">
        <SectionTitle>Recent completed bookings</SectionTitle>
        {bookingsQuery.isLoading ? (
          <LoadingScreen message="Loading bookings…" />
        ) : completed.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No completed bookings yet"
            description="Your completed service history will appear here."
          />
        ) : (
          <BookingList bookings={completed.slice(0, 5)} />
        )}
      </section>

      <section className="space-y-4">
        <SectionTitle>Quick actions</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          <QuickActionCard href="/explore" label="Explore services" description="Browse available local services" icon={Compass} />
          <QuickActionCard href="/dashboard/bookings" label="View bookings" description="See all your booking activity" icon={CalendarDays} />
          <QuickActionCard href="/explore" label="Find a service" description="Search by category or keyword" icon={Search} />
        </div>
      </section>
    </div>
  );
}
