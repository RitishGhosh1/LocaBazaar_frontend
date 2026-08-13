import type { LucideIcon } from "lucide-react";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const customerNavItems = [
  { href: "/dashboard", label: "Dashboard", iconName: "LayoutDashboard" as const, exact: true },
  { href: "/explore", label: "Explore", iconName: "Compass" as const },
  { href: "/dashboard/bookings", label: "Bookings", iconName: "CalendarDays" as const },
  { href: "/dashboard/profile", label: "Profile", iconName: "User" as const },
] as const;

export const providerNavItems = [
  { href: "/provider/dashboard", label: "Overview", iconName: "LayoutDashboard" as const, exact: true },
  { href: "/provider/services", label: "My Services", iconName: "Briefcase" as const },
  { href: "/provider/bookings", label: "Bookings", iconName: "CalendarDays" as const },
  { href: "/provider/profile", label: "Profile", iconName: "User" as const },
] as const;

export const adminNavItems = [
  { href: "/admin/dashboard", label: "Overview", iconName: "LayoutDashboard" as const, exact: true },
  { href: "/admin/providers", label: "Providers", iconName: "Users" as const },
  { href: "/admin/categories", label: "Categories", iconName: "Tags" as const },
  { href: "/admin/services", label: "Services", iconName: "Briefcase" as const },
  { href: "/admin/users", label: "Users", iconName: "UserCog" as const },
] as const;
