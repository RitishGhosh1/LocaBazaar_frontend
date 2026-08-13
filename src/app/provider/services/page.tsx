"use client";

import { Briefcase, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import {
  EmptyState,
  ErrorState,
  LoadingScreen,
  PageHeader,
} from "@/components/dashboard/dashboard-primitives";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import { useMyServices, useToggleServiceStatus } from "@/hooks/use-provider-services";
import { formatPrice } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/api-error";

export default function ProviderServicesPage() {
  const servicesQuery = useMyServices();
  const categoriesQuery = useCategories();
  const toggleMutation = useToggleServiceStatus();

  const categoryNames = new Map((categoriesQuery.data ?? []).map((c) => [c.id, c.name]));

  async function handleToggle(serviceId: number) {
    try {
      await toggleMutation.mutateAsync(serviceId);
      toast.success("Service status updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update service status"));
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My services"
        description="Services you offer on LocaBazaar. Toggle availability or add new listings."
        action={
          <Link href="/provider/services/new" className={buttonVariants({ size: "sm" })}>
            <Plus aria-hidden="true" />
            Add service
          </Link>
        }
      />

      {servicesQuery.isLoading ? (
        <LoadingScreen message="Loading your services…" />
      ) : servicesQuery.isError ? (
        <ErrorState
          title="Unable to load services"
          description="Please try again."
          onRetry={() => servicesQuery.refetch()}
        />
      ) : (servicesQuery.data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No services yet"
          description="Create your first service to start receiving bookings."
          action={{ label: "Create service", href: "/provider/services/new" }}
        />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {servicesQuery.data?.map((service) => (
                  <tr key={service.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{service.name}</p>
                      {service.description && (
                        <p className="mt-0.5 line-clamp-1 text-muted-foreground">{service.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {categoryNames.get(service.category_id) ?? `Category #${service.category_id}`}
                    </td>
                    <td className="px-4 py-3">{formatPrice(service.price)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={service.is_active ? "success" : "muted"}>
                        {service.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        disabled={toggleMutation.isPending}
                        onClick={() => handleToggle(service.id)}
                      >
                        {service.is_active ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Service editing and deletion are not available in the current API. You can toggle active status via{" "}
        <code className="text-xs">PATCH /api/v1/services/{"{id}"}/toggle</code>.
      </p>
    </div>
  );
}
