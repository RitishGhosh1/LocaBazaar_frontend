"use client";

import type { AppRole } from "@/lib/roles";

import { AppShell, type ShellNavItem } from "@/components/dashboard/app-shell";
import { LoadingScreen } from "@/components/dashboard/dashboard-primitives";
import { useAuthGuard } from "@/hooks/use-auth-guard";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  navItems: readonly ShellNavItem[];
  roleLabel: string;
  requiredRole: AppRole;
}

export function DashboardLayoutClient({
  children,
  navItems,
  roleLabel,
  requiredRole,
}: DashboardLayoutClientProps) {
  const { isInitializing, isAuthorized } = useAuthGuard({ requiredRole });

  if (isInitializing || !isAuthorized) {
    return <LoadingScreen message="Checking your session…" />;
  }

  return (
    <AppShell navItems={navItems} roleLabel={roleLabel} requiredRole={requiredRole}>
      {children}
    </AppShell>
  );
}
