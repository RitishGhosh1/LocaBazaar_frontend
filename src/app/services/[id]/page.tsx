"use client";

import { use } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  User,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateBooking } from "@/hooks/use-bookings";
import { useProviders } from "@/hooks/use-providers";
import { useReviewsForService } from "@/hooks/use-reviews";
import { useService, useServiceCategories } from "@/hooks/use-services";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
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
  const provider = providers.find((p) => p.id === service?.owner_id);

  const categoryName = service ? categoryMap.get(service.category_id) ?? "Home Service" : "";
  const providerName = provider?.name ?? (service ? "Verified Provider" : "");

  const reviewsList = reviewsQuery.data?.items ?? service?.reviews ?? [];
  const averageRating =
    reviewsList.length > 0
      ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length).toFixed(1)
      : null;

  const isCustomer = !resolvedRole || resolvedRole.appRole === "customer";
  const isOwnService = Boolean(user && service && user.id === service.owner_id);

  async function handleBooking() {
    if (!isAuthenticated) {
      toast.info("Please sign in to book this service.");
      router.push("/login");
      return;
    }

    if (isOwnService) {
      toast.error("You cannot book your own service listing.");
      return;
    }

    try {
      await createBookingMutation.mutateAsync({ service_id: serviceId });
      toast.success("Booking request submitted successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create booking"));
    }
  }

  function scrollToBooking() {
    const el = document.getElementById("booking-card");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
          {/* Breadcrumb / Back Link */}
          <Link
            href="/explore"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-6 inline-flex items-center text-muted-foreground hover:text-foreground"
            )}
          >
            <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
            Back to Explore Catalog
          </Link>

          {serviceQuery.isLoading ? (
            <div className="grid gap-8 lg:grid-cols-[1.8fr_1.2fr]">
              <div className="space-y-6 rounded-2xl border bg-card p-8">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
              <div className="h-72 rounded-2xl border bg-card p-8">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="mt-4 h-12 w-full" />
                <Skeleton className="mt-4 h-12 w-full" />
              </div>
            </div>
          ) : serviceQuery.isError || !service ? (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-12 text-center max-w-xl mx-auto">
              <ShieldAlert className="mx-auto size-12 text-destructive" aria-hidden="true" />
              <h2 className="mt-4 font-heading text-2xl font-bold">Service Not Found</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The requested service listing does not exist or has been retired.
              </p>
              <Link href="/explore" className={cn(buttonVariants({ variant: "outline" }), "mt-6 rounded-xl")}>
                Browse All Available Services
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.8fr_1.2fr] items-start">
              {/* Left Column: Details, Provider Bio, Reviews */}
              <div className="space-y-8">
                {/* Header Banner Card */}
                <div className="overflow-hidden rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      <Tag className="size-3.5" aria-hidden="true" />
                      {categoryName}
                    </span>

                    {/* Interactive Clickable Available Badge */}
                    <button
                      type="button"
                      onClick={scrollToBooking}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition cursor-pointer",
                        service.is_active
                          ? "border-emerald-200 bg-emerald-100/90 text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/70 dark:text-emerald-300 hover:bg-emerald-200/90"
                          : "border-border bg-muted text-muted-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          service.is_active ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                        )}
                      />
                      <span>{service.is_active ? "Available for Booking (Click to Book)" : "Currently Inactive"}</span>
                    </button>
                  </div>

                  <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    {service.name}
                  </h1>

                  {/* Rating & Review Counter */}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {averageRating ? (
                      <div className="flex items-center gap-1 font-semibold text-amber-500">
                        <Star className="size-4 fill-amber-400 text-amber-400" />
                        <span>{averageRating}</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          ({reviewsList.length} verified {reviewsList.length === 1 ? "review" : "reviews"})
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="size-3.5 text-muted-foreground" />
                        New Service Listing
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="size-3.5" />
                      Verified Specialist
                    </span>
                  </div>

                  {/* Service Description */}
                  <div className="mt-6 border-t pt-6">
                    <h2 className="text-sm font-bold tracking-wide uppercase text-muted-foreground">
                      Service Overview & Scope
                    </h2>
                    <p className="mt-3 text-base leading-7 text-muted-foreground whitespace-pre-line">
                      {service.description ||
                        "Full end-to-end service executed by trained local professionals using certified equipment."}
                    </p>
                  </div>

                  {/* Included Highlights */}
                  <div className="mt-6 rounded-2xl border border-border/70 bg-secondary/30 p-5">
                    <h3 className="text-xs font-bold tracking-wider uppercase text-foreground">
                      What&apos;s Included in This Service
                    </h3>
                    <div className="mt-3 grid gap-2.5 sm:grid-cols-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        <span>Dedicated certified technician</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        <span>Complete diagnostic & safety check</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        <span>High-grade commercial tools</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        <span>30-day workmanship assurance</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Provider Profile Card */}
                {provider && (
                  <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
                    <h2 className="text-sm font-bold tracking-wider uppercase text-muted-foreground">
                      Service Partner Details
                    </h2>
                    <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-indigo-500/10 text-xl font-bold text-primary">
                          {provider.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading text-xl font-bold">{provider.name}</h3>
                            <BadgeCheck className="size-5 text-emerald-500" />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            LocaBazaar Verified Service Partner
                          </p>
                        </div>
                      </div>

                      {provider.phone && (
                        <div className="flex items-center gap-2 rounded-xl border bg-secondary/40 px-3 py-1.5 text-xs font-semibold text-foreground">
                          <Phone className="size-3.5 text-primary" />
                          <span>+91 {provider.phone}</span>
                        </div>
                      )}
                    </div>

                    {provider.bio && (
                      <p className="mt-4 text-xs leading-5 text-muted-foreground border-t pt-4">
                        {provider.bio}
                      </p>
                    )}
                  </div>
                )}

                {/* Customer Reviews Section */}
                <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-xl font-bold">Verified Customer Reviews</h2>
                    {reviewsList.length > 0 && (
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                        {reviewsList.length} Total
                      </span>
                    )}
                  </div>

                  {reviewsList.length === 0 ? (
                    <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground text-sm">
                      No customer reviews submitted yet. Be the first to book and review this service!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviewsList.map((review) => (
                        <div
                          key={review.id}
                          className="rounded-2xl border bg-secondary/20 p-5 text-sm space-y-3 transition hover:border-primary/30"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                U
                              </div>
                              <div>
                                <span className="font-bold text-foreground text-xs">Verified Customer</span>
                                <p className="text-[10px] text-muted-foreground">Completed Booking</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                              <Star className="size-3.5 fill-amber-400" />
                              <span>{review.rating}.0</span>
                            </div>
                          </div>

                          {review.comment && (
                            <p className="text-xs leading-relaxed text-muted-foreground italic">
                              “{review.comment}”
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Sticky Booking Card */}
              <div id="booking-card" className="lg:sticky lg:top-24 space-y-6">
                <div className="rounded-3xl border bg-card p-6 sm:p-8 shadow-xl shadow-primary/5 space-y-6">
                  <div>
                    <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
                      Transparent Pricing
                    </span>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-heading text-4xl font-extrabold text-foreground">
                        {formatPrice(service.price)}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">all-inclusive</span>
                    </div>
                  </div>

                  {/* Availability Badge inside Card */}
                  <div className="rounded-2xl border border-emerald-200/80 bg-emerald-100/80 p-3.5 text-xs text-emerald-900 dark:border-emerald-800/60 dark:bg-emerald-950/70 dark:text-emerald-300 flex items-center gap-2.5">
                    <Clock className="size-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    <span>Slots available for today and tomorrow. Rapid doorstep coordination.</span>
                  </div>

                  {/* Action Buttons */}
                  <div>
                    {isOwnService ? (
                      <Button disabled variant="outline" className="w-full rounded-xl py-6 font-bold">
                        This is your service listing
                      </Button>
                    ) : isCustomer ? (
                      <Button
                        size="lg"
                        className="w-full rounded-xl py-6 font-bold text-base shadow-md cursor-pointer"
                        disabled={!service.is_active || createBookingMutation.isPending}
                        onClick={handleBooking}
                      >
                        <Calendar className="mr-2 size-5" aria-hidden="true" />
                        {createBookingMutation.isPending ? "Confirming Booking…" : "Book Service Now"}
                      </Button>
                    ) : (
                      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-center text-xs text-amber-800 dark:text-amber-300">
                        Provider accounts cannot create bookings. Sign in as a customer to book.
                      </div>
                    )}

                    {!isAuthenticated && (
                      <p className="mt-3 text-center text-xs text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-primary underline">
                          Log in
                        </Link>
                      </p>
                    )}
                  </div>

                  {/* Guarantees Checklist */}
                  <div className="border-t pt-5 space-y-3">
                    <p className="text-xs font-bold text-foreground">LocaBazaar Platform Assurance</p>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                        <span>No upfront charges • Pay upon completion</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                        <span>Free rescheduling anytime</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                        <span>Dedicated customer support assistance</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
