"use client";

import { CalendarClock, CalendarDays, CheckCircle2, Plus } from "lucide-react";
import Link from "next/link";

import { BookingList } from "@/components/dashboard/booking-list";
import {
  EmptyState,
  ErrorState,
  LoadingScreen,
  PageHeader,
  SectionTitle,
  StatCard,
} from "@/components/dashboard/dashboard-primitives";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookings } from "@/hooks/use-bookings";
import { useMyServices } from "@/hooks/use-provider-services";
import { countBookingsByStatus } from "@/lib/format";

export default function ProviderDashboardPage() {
  const servicesQuery = useMyServices();
  const bookingsQuery = useBookings({ limit: 50 });

  const bookings = bookingsQuery.data?.items ?? [];
  const counts = countBookingsByStatus(bookings);
  const pendingBookings = bookings.filter((b) => b.status === "pending");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Provider overview"
        description="Manage your services and respond to customer bookings."
        action={
          <Link href="/provider/services/new" className={buttonVariants({ size: "sm" })}>
            <Plus aria-hidden="true" />
            New service
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {servicesQuery.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)
        ) : servicesQuery.isError ? (
          <div className="col-span-full">
            <ErrorState title="Unable to load services" description="Could not fetch your service count." onRetry={() => servicesQuery.refetch()} />
          </div>
        ) : (
          <>
            <StatCard label="My services" value={servicesQuery.data?.length ?? 0} icon={CheckCircle2} />
            <StatCard label="Pending bookings" value={counts.pending} icon={CalendarClock} />
            <StatCard label="Confirmed" value={counts.confirmed} icon={CalendarDays} />
            <StatCard label="Completed" value={counts.completed} icon={CheckCircle2} />
          </>
        )}
      </div>

      <section className="space-y-4">
        <SectionTitle>Bookings awaiting action</SectionTitle>
        {bookingsQuery.isLoading ? (
          <LoadingScreen message="Loading bookings…" />
        ) : pendingBookings.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No pending bookings"
            description="New customer requests will appear here for confirmation."
          />
        ) : (
          <BookingList bookings={pendingBookings} showServiceLink={false} />
        )}
      </section>
    </div>
  );
}
