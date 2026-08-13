"use client";

import { Users } from "lucide-react";

import {
  EmptyState,
  ErrorState,
  LoadingScreen,
  PageHeader,
} from "@/components/dashboard/dashboard-primitives";
import { Badge } from "@/components/ui/badge";
import { useAdminProviders } from "@/hooks/use-admin";

export default function AdminProvidersPage() {
  const providersQuery = useAdminProviders();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Providers"
        description="Registered service providers on the platform."
      />

      {providersQuery.isLoading ? (
        <LoadingScreen message="Loading providers…" />
      ) : providersQuery.isError ? (
        <ErrorState
          title="Unable to load providers"
          description="Please try again."
          onRetry={() => providersQuery.refetch()}
        />
      ) : (providersQuery.data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={Users}
          title="No providers yet"
          description="Providers will appear here once they register."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {providersQuery.data?.map((provider) => (
                  <tr key={provider.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3 font-medium">{provider.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{provider.email}</td>
                    <td className="px-4 py-3 capitalize">{provider.role}</td>
                    <td className="px-4 py-3">
                      <Badge variant={provider.is_active ? "success" : "muted"}>
                        {provider.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
