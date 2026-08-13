import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { customerNavItems } from "@/constants/dashboard-nav";

export default function CustomerDashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <DashboardLayoutClient navItems={customerNavItems} roleLabel="Customer" requiredRole="customer">
      {children}
    </DashboardLayoutClient>
  );
}
