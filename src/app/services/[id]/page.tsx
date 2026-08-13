"use client";

import { use } from "react";
import { ArrowLeft, Calendar, CheckCircle2, ShieldAlert, Star, Tag, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateBooking } from "@/hooks/use-bookings";
import { useService, useServiceCategories } from "@/hooks/use-services";
import { useProviders } from "@/hooks/use-providers";
import { useReviewsForService } from "@/hooks/use-reviews";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatPrice } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = use(params);
  const serviceId = Number.parseInt(id, 10);
  const router = useRouter();

  const { isAuthenticated, user, resolvedRole } = useAuthStore();
  const serviceQuery = useService(serviceId);
  const categoriesQuery = useServiceCategories();
  const providersQuery = useProviders();
  const reviewsQuery = useReviewsForService(serviceId);
  const createBookingMutation = useCreateBooking();

  const service = serviceQuery.data;
  const categories = categoriesQuery.data ?? [];
  const providers = providersQuery.data ?? [];

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  const providerMap = new Map(providers.map((p) => [p.id, p.name]));

  const categoryName = service ? categoryMap.get(service.category_id) ?? "Service Category" : "";
  const providerName = service ? providerMap.get(service.owner_id) ?? "Verified Provider" : "";

  const reviewsList = reviewsQuery.data?.items ?? service?.reviews ?? [];

  const isCustomer = !resolvedRole || resolvedRole.appRole === "customer";
  const isOwnService = Boolean(user && service && user.id === service.owner_id);

  async function handleBooking() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isOwnService) {
      toast.error("Cannot book your own service.");
      return;
    }

    try {
      await createBookingMutation.mutateAsync({ service_id: serviceId });
      toast.success("Booking created successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create booking"));
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
          <Link
            href="/explore"
            className={buttonVariants({ variant: "ghost", size: "sm", className: "mb-6 text-muted-foreground" })}
          >
            <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
            Back to Explore
          </Link>

          {serviceQuery.isLoading ? (
            <div className="space-y-6 rounded-lg border bg-card p-6 sm:p-8">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-48" />
            </div>
          ) : serviceQuery.isError || !service ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
              <ShieldAlert className="mx-auto size-10 text-destructive" aria-hidden="true" />
              <h2 className="mt-4 font-heading text-xl font-semibold">Service not found</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The service you are looking for does not exist or has been removed.
              </p>
              <Link href="/explore" className={buttonVariants({ variant: "outline", className: "mt-6" })}>
                Browse available services
              </Link>
            </div>
          ) : (
            <article className="space-y-8">
              {/* Header Section */}
              <header className="rounded-lg border bg-card p-6 shadow-sm sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                      <Tag className="size-3.5" aria-hidden="true" />
                      {categoryName}
                    </span>
                    <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                      {service.name}
                    </h1>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Price</p>
                    <p className="font-heading text-3xl font-bold text-primary">
                      {formatPrice(service.price)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-6 border-t pt-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-primary" aria-hidden="true" />
                    <span>{providerName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />
                    <span>{service.is_active ? "Available for booking" : "Currently inactive"}</span>
                  </div>

                  {reviewsList.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                      <span>{reviewsList.length} review(s)</span>
                    </div>
                  )}
                </div>
              </header>

              {/* Description & Details */}
              <section className="rounded-lg border bg-card p-6 shadow-sm sm:p-8 space-y-4">
                <h2 className="font-heading text-xl font-semibold">Description</h2>
                <p className="leading-relaxed text-muted-foreground">
                  {service.description || "No description provided for this service."}
                </p>
              </section>

              {/* Reviews Section */}
              <section className="rounded-lg border bg-card p-6 shadow-sm sm:p-8 space-y-6">
                <h2 className="font-heading text-xl font-semibold">Customer Reviews</h2>
                {reviewsList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No reviews yet for this service. Customers with completed bookings can leave reviews from their Bookings dashboard.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reviewsList.map((review) => (
                      <div key={review.id} className="rounded-md border p-4 text-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Verified Customer</span>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="size-4 fill-amber-400" />
                            <span>{review.rating}/5</span>
                          </div>
                        </div>
                        {review.comment && <p className="text-muted-foreground">{review.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Booking CTA */}
              <section className="rounded-lg border bg-card p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-heading text-lg font-semibold">Ready to book this service?</h3>
                  <p className="text-sm text-muted-foreground">
                    {isAuthenticated
                      ? "Submit a booking request to connect with the provider."
                      : "Sign in to your customer account to place a booking."}
                  </p>
                </div>

                {isOwnService ? (
                  <Button disabled variant="outline">
                    Your service
                  </Button>
                ) : isCustomer ? (
                  <Button
                    size="lg"
                    disabled={!service.is_active || createBookingMutation.isPending}
                    onClick={handleBooking}
                  >
                    <Calendar className="mr-2 size-5" aria-hidden="true" />
                    {createBookingMutation.isPending ? "Booking…" : "Book Service Now"}
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Bookings are reserved for customer accounts.
                  </p>
                )}
              </section>
            </article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
