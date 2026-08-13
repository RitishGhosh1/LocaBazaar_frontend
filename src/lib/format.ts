import type { BookingStatus } from "@/services/bookings";

export function countBookingsByStatus(
  items: { status: BookingStatus }[],
): Record<BookingStatus, number> {
  return items.reduce(
    (counts, booking) => {
      counts[booking.status] += 1;
      return counts;
    },
    {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
      rejected: 0,
    } satisfies Record<BookingStatus, number>,
  );
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatBookingStatus(status: BookingStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
