"use client";

import { Briefcase } from "lucide-react";
import { toast } from "sonner";

import {
  EmptyState,
  ErrorState,
  LoadingScreen,
  PageHeader,
} from "@/components/dashboard/dashboard-primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminProviders, useAdminServices, useSuspendService, useUnsuspendService } from "@/hooks/use-admin";
import { useCategories } from "@/hooks/use-categories";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatPrice } from "@/lib/format";

export default function AdminServicesPage() {
  const servicesQuery = useAdminServices();
  const categoriesQuery = useCategories();
  const providersQuery = useAdminProviders();
  const suspendMutation = useSuspendService();
  const unsuspendMutation = useUnsuspendService();

  const categoryNames = new Map((categoriesQuery.data ?? []).map((c) => [c.id, c.name]));
  const providerNames = new Map((providersQuery.data ?? []).map((p) => [p.id, p.name]));

  async function handleSuspend(serviceId: number, name: string) {
    try {
      await suspendMutation.mutateAsync(serviceId);
      toast.success(`Service "${name}" suspended`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to suspend service"));
    }
  }

  async function handleUnsuspend(serviceId: number, name: string) {
    try {
      await unsuspendMutation.mutateAsync(serviceId);
      toast.success(`Service "${name}" unsuspended`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to unsuspend service"));
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Service listings"
        description="All marketplace services across all providers. Suspend policy-violating listings or restore suspended listings."
      />

      {servicesQuery.isLoading ? (
        <LoadingScreen message="Loading services…" />
      ) : servicesQuery.isError ? (
        <ErrorState
          title="Unable to load services"
          description="Superuser authorization is required."
          onRetry={() => servicesQuery.refetch()}
        />
      ) : (servicesQuery.data?.items.length ?? 0) === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No services listed"
          description="Services will appear once providers create listings."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Provider</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {servicesQuery.data?.items.map((service) => (
                  <tr key={service.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">#{service.id}</td>
                    <td className="px-4 py-3 font-medium">{service.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {categoryNames.get(service.category_id) ?? `#${service.category_id}`}
                    </td>
                    <td className="px-4 py-3">{formatPrice(service.price)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {providerNames.get(service.owner_id) ?? `#${service.owner_id}`}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={service.is_active ? "success" : "muted"}>
                        {service.is_active ? "Active" : "Suspended"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {service.is_active ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          type="button"
                          disabled={suspendMutation.isPending}
                          onClick={() => handleSuspend(service.id, service.name)}
                        >
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          disabled={unsuspendMutation.isPending}
                          onClick={() => handleUnsuspend(service.id, service.name)}
                        >
                          Unsuspend
                        </Button>
                      )}
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
