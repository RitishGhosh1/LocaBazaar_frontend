"use client";

import { CalendarCheck2 } from "lucide-react";
import { toast } from "sonner";

import {
  EmptyState,
  ErrorState,
  LoadingScreen,
  PageHeader,
} from "@/components/dashboard/dashboard-primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminBookings, useAdminUsers, useUpdateAdminBookingStatus } from "@/hooks/use-admin";
import { useServicesMap } from "@/hooks/use-services";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatBookingStatus } from "@/lib/format";

export default function AdminBookingsPage() {
  const bookingsQuery = useAdminBookings();
  const usersQuery = useAdminUsers();
  const serviceNames = useServicesMap();
  const updateStatusMutation = useUpdateAdminBookingStatus();

  const userNames = new Map((usersQuery.data ?? []).map((u) => [u.id, u.name]));
  const bookings = bookingsQuery.data?.items ?? [];

  async function handleUpdateStatus(bookingId: number, status: string) {
    try {
      await updateStatusMutation.mutateAsync({ bookingId, status });
      toast.success(`Booking #${bookingId} status updated to ${status}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update booking status"));
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Booking moderation"
        description="Platform-wide booking overview across all customers and providers."
      />

      {bookingsQuery.isLoading ? (
        <LoadingScreen message="Loading platform bookings…" />
      ) : bookingsQuery.isError ? (
        <ErrorState
          title="Unable to load bookings"
          description="Superuser authorization is required."
          onRetry={() => bookingsQuery.refetch()}
        />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={CalendarCheck2}
          title="No bookings recorded"
          description="Customer booking requests will appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Moderation Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const serviceName = serviceNames.get(booking.service_id) ?? `Service #${booking.service_id}`;
                  const bookingUserId = (booking as { user_id?: number }).user_id;
                  const userName = bookingUserId ? (userNames.get(bookingUserId) ?? `#${bookingUserId}`) : "Customer";

                  return (
                    <tr key={booking.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">#{booking.id}</td>
                      <td className="px-4 py-3 font-medium">{serviceName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{userName}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            booking.status === "confirmed" || booking.status === "completed"
                              ? "success"
                              : booking.status === "cancelled" || booking.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {formatBookingStatus(booking.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {booking.status !== "completed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              type="button"
                              disabled={updateStatusMutation.isPending}
                              onClick={() => handleUpdateStatus(booking.id, "completed")}
                            >
                              Complete
                            </Button>
                          )}
                          {booking.status !== "cancelled" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              type="button"
                              disabled={updateStatusMutation.isPending}
                              onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
