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
import { useSuspendService } from "@/hooks/use-admin";
import { useCategories } from "@/hooks/use-categories";
import { useServices } from "@/hooks/use-services";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatPrice } from "@/lib/format";

export default function AdminServicesPage() {
  const servicesQuery = useServices({ limit: 50 });
  const categoriesQuery = useCategories();
  const suspendMutation = useSuspendService();

  const categoryNames = new Map((categoriesQuery.data ?? []).map((c) => [c.id, c.name]));

  async function handleSuspend(serviceId: number) {
    try {
      await suspendMutation.mutateAsync(serviceId);
      toast.success(`Service #${serviceId} suspended`);
      void servicesQuery.refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to suspend service"));
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Services"
        description="All marketplace services. Suspend listings that violate platform policies."
      />

      {servicesQuery.isLoading ? (
        <LoadingScreen message="Loading services…" />
      ) : servicesQuery.isError ? (
        <ErrorState
          title="Unable to load services"
          description="Please try again."
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
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Owner</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {servicesQuery.data?.items.map((service) => (
                  <tr key={service.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3 font-medium">{service.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {categoryNames.get(service.category_id) ?? `#${service.category_id}`}
                    </td>
                    <td className="px-4 py-3">{formatPrice(service.price)}</td>
                    <td className="px-4 py-3 text-muted-foreground">#{service.owner_id}</td>
                    <td className="px-4 py-3">
                      <Badge variant={service.is_active ? "success" : "muted"}>
                        {service.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="destructive"
                        type="button"
                        disabled={suspendMutation.isPending || !service.is_active}
                        onClick={() => handleSuspend(service.id)}
                      >
                        Suspend
                      </Button>
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
