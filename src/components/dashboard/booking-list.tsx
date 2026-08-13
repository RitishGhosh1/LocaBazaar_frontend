import Link from "next/link";

import { BookingStatusBadge } from "@/components/dashboard/booking-status-badge";
import { useServicesMap } from "@/hooks/use-services";
import type { Booking } from "@/services/bookings";

interface BookingListProps {
  bookings: Booking[];
  showServiceLink?: boolean;
  actions?: (booking: Booking) => React.ReactNode;
}

export function BookingList({ bookings, showServiceLink = true, actions }: BookingListProps) {
  const serviceMap = useServicesMap();

  if (bookings.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-4 py-3 font-medium">Booking ID</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Status</th>
              {actions && <th className="px-4 py-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const serviceName = serviceMap.get(booking.service_id) ?? `Service #${booking.service_id}`;

              return (
                <tr key={booking.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-medium">#{booking.id}</td>
                  <td className="px-4 py-3 text-muted-foreground font-medium">
                    {showServiceLink ? (
                      <Link href={`/services/${booking.service_id}`} className="hover:text-foreground hover:underline text-foreground">
                        {serviceName}
                      </Link>
                    ) : (
                      <span>{serviceName}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <BookingStatusBadge status={booking.status} />
                  </td>
                  {actions && <td className="px-4 py-3">{actions(booking)}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
