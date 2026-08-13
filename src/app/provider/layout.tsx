import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { providerNavItems } from "@/constants/dashboard-nav";

export default function ProviderDashboardLayout({ children }: LayoutProps<"/provider">) {
  return (
    <DashboardLayoutClient navItems={providerNavItems} roleLabel="Provider" requiredRole="provider">
      {children}
    </DashboardLayoutClient>
  );
}
