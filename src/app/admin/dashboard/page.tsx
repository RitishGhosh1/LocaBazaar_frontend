"use client";

import { Briefcase, CalendarCheck2, Star, Tags, User, UserCog, Users } from "lucide-react";

import {
  ErrorState,
  PageHeader,
  QuickActionCard,
  SectionTitle,
  StatCard,
} from "@/components/dashboard/dashboard-primitives";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlatformStats } from "@/hooks/use-admin";

function formatStatValue(value: unknown): string | number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  return "0";
}

export default function AdminDashboardPage() {
  const statsQuery = usePlatformStats();
  const stats = statsQuery.data ?? {};

  return (
    <div className="space-y-8">
      <PageHeader
        title="Superadmin overview"
        description="Platform-wide governance metrics and administration links for LocaBazaar."
      />

      {statsQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : statsQuery.isError ? (
        <ErrorState
          title="Platform stats unavailable"
          description="GET /api/v1/admin/dashboard/stats requires superuser authorization."
          onRetry={() => statsQuery.refetch()}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          <StatCard label="Total accounts" value={formatStatValue(stats.total_people)} icon={Users} />
          <StatCard label="Customers" value={formatStatValue(stats.total_users)} icon={User} />
          <StatCard label="Providers" value={formatStatValue(stats.total_providers)} icon={UserCog} />
          <StatCard label="Services" value={formatStatValue(stats.total_services)} icon={Briefcase} />
          <StatCard label="Pending" value={formatStatValue(stats.pending_bookings)} icon={CalendarCheck2} />
          <StatCard label="Completed" value={formatStatValue(stats.completed_bookings)} icon={CalendarCheck2} />
          <StatCard label="Reviews" value={formatStatValue(stats.total_reviews)} icon={Star} />
        </div>
      )}

      <section className="space-y-4">
        <SectionTitle>Administrative Management</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard href="/admin/users" label="User Management" description="Deactivate or hard delete accounts" icon={UserCog} />
          <QuickActionCard href="/admin/providers" label="Registered Providers" description="Browse provider directory" icon={Users} />
          <QuickActionCard href="/admin/services" label="Service Listings" description="Review and suspend/unsuspend services" icon={Briefcase} />
          <QuickActionCard href="/admin/bookings" label="Booking Moderation" description="Platform-wide booking status control" icon={CalendarCheck2} />
          <QuickActionCard href="/admin/reviews" label="Review Moderation" description="Review content cleanup and moderation" icon={Star} />
          <QuickActionCard href="/admin/categories" label="Categories" description="Create marketplace categories" icon={Tags} />
        </div>
      </section>
    </div>
  );
}
