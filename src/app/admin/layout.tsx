import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { adminNavItems } from "@/constants/dashboard-nav";

export default function AdminDashboardLayout({ children }: LayoutProps<"/admin">) {
  return (
    <DashboardLayoutClient navItems={adminNavItems} roleLabel="Administration" requiredRole="superadmin">
      {children}
    </DashboardLayoutClient>
  );
}
