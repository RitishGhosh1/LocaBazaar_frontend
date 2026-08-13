"use client";

import { AlertCircle, CalendarClock, CalendarDays, CheckCircle2, Plus } from "lucide-react";
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
  const counts = bookingsQuery.isSuccess ? countBookingsByStatus(bookings) : { pending: 0, confirmed: 0, completed: 0, cancelled: 0, rejected: 0 };
  const pendingBookings = bookings.filter((b) => b.status === "pending");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Provider overview"
        description="Manage your services and track customer activity."
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
            <ErrorState title="Unable to load services" description="Could not fetch your services right now." onRetry={() => servicesQuery.refetch()} />
          </div>
        ) : (
          <>
            <StatCard label="My services" value={servicesQuery.data?.length ?? 0} icon={CheckCircle2} />
            <StatCard label="Pending bookings" value={bookingsQuery.isError ? "—" : counts.pending} icon={CalendarClock} />
            <StatCard label="Confirmed" value={bookingsQuery.isError ? "—" : counts.confirmed} icon={CalendarDays} />
            <StatCard label="Completed" value={bookingsQuery.isError ? "—" : counts.completed} icon={CheckCircle2} />
          </>
        )}
      </div>

      <section className="space-y-4">
        <SectionTitle>Bookings awaiting action</SectionTitle>
        {bookingsQuery.isLoading ? (
          <LoadingScreen message="Loading bookings…" />
        ) : bookingsQuery.isError ? (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 text-sm space-y-2">
            <div className="flex items-center gap-2 font-semibold text-amber-700">
              <AlertCircle className="size-4" />
              <span>Provider Bookings Notice</span>
            </div>
            <p className="text-muted-foreground">
              The backend endpoint <code className="text-xs">GET /api/v1/bookings/</code> is customer-restricted on the server. Action specific bookings via your direct booking IDs.
            </p>
          </div>
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

