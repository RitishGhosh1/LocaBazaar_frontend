"use client";

import { Briefcase, Tags, Users } from "lucide-react";
import Link from "next/link";

import {
  ErrorState,
  LoadingScreen,
  PageHeader,
  QuickActionCard,
  SectionTitle,
  StatCard,
} from "@/components/dashboard/dashboard-primitives";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlatformStats } from "@/hooks/use-admin";
import { useCategories } from "@/hooks/use-categories";
import { useProviders } from "@/hooks/use-providers";
import { useServices } from "@/hooks/use-services";

function formatStatValue(value: unknown): string | number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  return "—";
}

export default function AdminDashboardPage() {
  const statsQuery = usePlatformStats();
  const categoriesQuery = useCategories();
  const providersQuery = useProviders();
  const servicesQuery = useServices({ limit: 1 });

  const stats = statsQuery.data ?? {};
  const statEntries = Object.entries(stats).filter(([, value]) => value !== null && value !== undefined);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Administration overview"
        description="Platform statistics and quick links to manage LocaBazaar."
      />

      {statsQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
      ) : statsQuery.isError ? (
        <div className="space-y-4">
          <ErrorState
            title="Platform stats unavailable"
            description="GET /admin/dashboard/stats requires superuser access. Showing public counts instead."
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Categories" value={categoriesQuery.data?.length ?? "—"} icon={Tags} />
            <StatCard label="Providers" value={providersQuery.data?.length ?? "—"} icon={Users} />
            <StatCard label="Services" value={servicesQuery.data?.total ?? "—"} icon={Briefcase} />
          </div>
        </div>
      ) : statEntries.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statEntries.slice(0, 8).map(([key, value]) => (
            <StatCard
              key={key}
              label={key.replace(/_/g, " ")}
              value={formatStatValue(value)}
              icon={Briefcase}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Categories" value={categoriesQuery.data?.length ?? 0} icon={Tags} />
          <StatCard label="Providers" value={providersQuery.data?.length ?? 0} icon={Users} />
          <StatCard label="Services" value={servicesQuery.data?.total ?? 0} icon={Briefcase} />
        </div>
      )}

      <section className="space-y-4">
        <SectionTitle>Quick actions</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          <QuickActionCard href="/admin/categories" label="Manage categories" description="Create marketplace categories" icon={Tags} />
          <QuickActionCard href="/admin/providers" label="View providers" description="Browse registered providers" icon={Users} />
          <QuickActionCard href="/admin/services" label="Manage services" description="Review and suspend services" icon={Briefcase} />
        </div>
      </section>

      <div className="rounded-lg border bg-card p-5 text-sm text-muted-foreground">
        <p>
          Admin user listing, booking moderation, and review moderation endpoints are not available in the
          current API. User actions require a known user ID.
        </p>
        <Link href="/admin/users" className={buttonVariants({ size: "sm", variant: "outline", className: "mt-4" })}>
          Go to user management
        </Link>
      </div>
    </div>
  );
}
