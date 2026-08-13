import type { BookingStatus } from "@/services/bookings";

import { Badge } from "@/components/ui/badge";
import { formatBookingStatus } from "@/lib/format";

const statusVariant: Record<
  BookingStatus,
  "warning" | "success" | "destructive" | "muted" | "secondary"
> = {
  pending: "warning",
  confirmed: "success",
  cancelled: "muted",
  completed: "secondary",
  rejected: "destructive",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge variant={statusVariant[status]}>{formatBookingStatus(status)}</Badge>;
}
