import Link from "next/link";
import { Calendar, Mail, Phone, User } from "lucide-react";

import { BookingStatusBadge } from "@/components/dashboard/booking-status-badge";
import { useServicesMap } from "@/hooks/use-services";
import { formatPrice } from "@/lib/format";
import type { Booking } from "@/services/bookings";

interface BookingListProps {
  bookings: Booking[];
  showServiceLink?: boolean;
  showCustomerDetails?: boolean;
  actions?: (booking: Booking) => React.ReactNode;
}

export function BookingList({
  bookings,
  showServiceLink = true,
  showCustomerDetails = false,
  actions,
}: BookingListProps) {
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
              {showCustomerDetails && (
                <th className="px-4 py-3 font-medium">Customer & Contact</th>
              )}
              {showCustomerDetails && (
                <th className="px-4 py-3 font-medium">Date & Time</th>
              )}
              <th className="px-4 py-3 font-medium">Status</th>
              {actions && <th className="px-4 py-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const service = booking.service ?? booking.services;
              const serviceName =
                service?.name ??
                serviceMap.get(booking.service_id) ??
                `Service #${booking.service_id}`;
              const customer = booking.customer ?? booking.user;

              return (
                <tr key={booking.id} className="border-b last:border-b-0 hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3 font-medium text-muted-foreground font-mono text-xs">
                    #{booking.id}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <div className="flex flex-col">
                      {showServiceLink ? (
                        <Link
                          href={`/services/${booking.service_id}`}
                          className="hover:text-foreground hover:underline text-foreground"
                        >
                          {serviceName}
                        </Link>
                      ) : (
                        <span className="text-foreground">{serviceName}</span>
                      )}
                      {service?.price !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          {formatPrice(service.price)}
                        </span>
                      )}
                    </div>
                  </td>

                  {showCustomerDetails && (
                    <td className="px-4 py-3">
                      {customer ? (
                        <div className="flex flex-col gap-1 min-w-[200px]">
                          <div className="flex items-center gap-1.5 font-medium text-foreground">
                            <User className="size-3.5 text-muted-foreground shrink-0" />
                            <span>{customer.name}</span>
                          </div>
                          {customer.phone ? (
                            <a
                              href={`tel:${customer.phone}`}
                              className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                              title="Call customer"
                            >
                              <Phone className="size-3 text-primary shrink-0" />
                              <span>{customer.phone}</span>
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground italic flex items-center gap-1.5">
                              <Phone className="size-3 text-muted-foreground shrink-0 opacity-40" />
                              No phone
                            </span>
                          )}
                          {customer.email ? (
                            <a
                              href={`mailto:${customer.email}`}
                              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:underline"
                              title="Email customer"
                            >
                              <Mail className="size-3 text-muted-foreground shrink-0" />
                              <span className="truncate max-w-[220px]">{customer.email}</span>
                            </a>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                  )}

                  {showCustomerDetails && (
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">
                      {booking.booking_time ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                          <span>
                            {new Date(booking.booking_time).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  )}

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
