"use client";

import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Droplets,
  Heart,
  Laptop,
  Paintbrush,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { CategoryCard } from "@/components/common/category-card";
import { ServiceCard } from "@/components/common/service-card";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { useProviders } from "@/hooks/use-providers";
import { useServiceCategories, useServices } from "@/hooks/use-services";
import { cn } from "@/lib/utils";

const QUICK_TAGS = [
  { label: "Deep Cleaning", query: "Cleaning", icon: Sparkles },
  { label: "AC Service", query: "AC", icon: Wrench },
  { label: "Electrician", query: "Electrical", icon: Zap },
  { label: "Plumber", query: "Plumbing", icon: Droplets },
  { label: "Laptop Repair", query: "Tech", icon: Laptop },
  { label: "Salon at Home", query: "Beauty", icon: Heart },
  { label: "Pest Control", query: "Pest", icon: ShieldCheck },
  { label: "Carpentry", query: "Carpentry", icon: Paintbrush },
];

const TRUST_STATS = [
  {
    icon: ShieldCheck,
    title: "100% Verified Pros",
    description: "Background-checked & skill-certified specialists",
    color: "text-emerald-800 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60",
  },
  {
    icon: BadgeCheck,
    title: "Upfront Fixed Pricing",
    description: "Clear prices with zero hidden charges",
    color: "text-indigo-800 dark:text-indigo-300 bg-indigo-100/90 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60",
  },
  {
    icon: Clock,
    title: "On-Time Arrival",
    description: "Punctual doorstep arrival on your chosen slot",
    color: "text-amber-900 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60",
  },
  {
    icon: Star,
    title: "4.9/5 Average Rating",
    description: "Authentic reviews from verified local homeowners",
    color: "text-purple-800 dark:text-purple-300 bg-purple-100/90 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-800/60",
  },
];

const HOW_IT_WORKS = [
  {
    number: "01",
    title: "Discover & Compare",
    description: "Explore verified professionals, transparent rates, and authentic customer ratings nearby.",
    icon: Search,
  },
  {
    number: "02",
    title: "Instant Booking",
    description: "Select your preferred slot and request service with a single click. No endless phone calls.",
    icon: CalendarCheck2,
  },
  {
    number: "03",
    title: "Relax & Pay with Confidence",
    description: "Your specialist arrives equipped and completes the job with satisfaction guaranteed.",
    icon: CheckCircle2,
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Thomas",
    location: "Indiranagar",
    service: "Apartment Deep Cleaning",
    rating: 5,
    quote:
      "Priya and her team did a phenomenal job on our 3BHK deep clean. Every corner and kitchen appliance looked brand new. Super professional!",
  },
  {
    name: "John Doe",
    location: "Koramangala",
    service: "AC Jet Pump Service",
    rating: 5,
    quote:
      "Vikram arrived right on time with the jet washer and splash cover. Odorless foam cleaning and our AC is chilling like day one. Highly recommended!",
  },
  {
    name: "Meera Kapoor",
    location: "HSR Layout",
    service: "Hydrating Facial & Glow",
    rating: 5,
    quote:
      "Ananya brings a completely hygienic salon kit right home. Incredibly relaxing, and the glow lasted all week without the salon rush.",
  },
];

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<number | null>(null);

  const categoriesQuery = useServiceCategories();
  const servicesQuery = useServices({ limit: 12 });
  const providersQuery = useProviders();

  const categories = categoriesQuery.data ?? [];
  const allServices = servicesQuery.data?.items ?? [];
  const providers = providersQuery.data ?? [];

  const categoryNames = useMemo(() => new Map(categories.map((c) => [c.id, c.name])), [categories]);
  const providerNames = useMemo(() => new Map(providers.map((p) => [p.id, p.name])), [providers]);

  // Dynamically filtered services based on the active tab on the home page
  const filteredServices = useMemo(() => {
    if (selectedCategoryTab === null) return allServices.slice(0, 8);
    return allServices.filter((s) => s.category_id === selectedCategoryTab);
  }, [allServices, selectedCategoryTab]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/explore");
    }
  }

  function handleTagClick(query: string) {
    router.push(`/explore?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/40 py-16 sm:py-24 lg:py-28">
          {/* Subtle Ambient Radial Glows */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_oklch,var(--primary),transparent_85%),transparent)]" />
          <div className="pointer-events-none absolute right-0 top-1/4 -z-10 size-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="pointer-events-none absolute left-0 bottom-1/4 -z-10 size-96 rounded-full bg-secondary/60 blur-3xl" />

          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              {/* Pill Announcement */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Over 25+ Verified Local Specialists Ready to Assist</span>
              </div>

              {/* Main Headline */}
              <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Everyday services done right,{" "}
                <span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  right at your doorstep.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Connect with certified local professionals for home cleaning, electrical, plumbing, AC repairs,
                tech diagnostics, and personal grooming.
              </p>

              {/* Search Box */}
              <form
                onSubmit={handleSearchSubmit}
                className="mt-8 flex flex-col gap-2 rounded-2xl border bg-card p-2.5 shadow-xl shadow-primary/5 sm:flex-row sm:items-center sm:gap-3"
              >
                <div className="flex flex-1 items-center gap-3 px-3 py-1.5">
                  <Search className="size-5 text-muted-foreground shrink-0" aria-hidden="true" />
                  <input
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
                    placeholder="Search services (e.g. AC repair, deep cleaning, electrician...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <Button size="lg" className="w-full rounded-xl sm:w-auto font-semibold shadow-sm" type="submit">
                  <Search className="size-4 mr-1.5" aria-hidden="true" />
                  Search Services
                </Button>
              </form>

              {/* Popular Search Quick Tags */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Popular:</span>
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => handleTagClick(tag.query)}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-xs transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-foreground cursor-pointer"
                  >
                    <tag.icon className="size-3 text-primary transition-transform group-hover:scale-110" />
                    <span>{tag.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges Strip */}
        <section className="border-b border-border/40 bg-secondary/30 py-8">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {TRUST_STATS.map((stat) => (
                <div
                  key={stat.title}
                  className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-xs transition hover:border-primary/30"
                >
                  <div className={cn("grid size-12 place-items-center rounded-xl shrink-0", stat.color)}>
                    <stat.icon className="size-6" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{stat.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold tracking-widest text-primary uppercase">Browse Services</p>
                <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Popular Categories
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Explore top-rated local professionals across core everyday services.
                </p>
              </div>

              <Link
                href="/explore"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl font-medium")}
              >
                View all categories
                <ArrowRight className="size-3.5 ml-1.5" />
              </Link>
            </div>

            {categoriesQuery.isLoading ? (
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-36 animate-pulse rounded-2xl bg-muted" />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
                No categories available yet.
              </div>
            ) : (
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    description={category.description || "Browse top verified specialists"}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Services with Dynamic Tab Filter */}
        <section id="featured-services" className="border-y border-border/40 bg-secondary/20 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold tracking-widest text-primary uppercase">Active Bookings</p>
                <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Featured Services
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Book top-rated, certified service providers with transparent pricing and live availability.
                </p>
              </div>

              <Link
                href="/explore"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl font-medium")}
              >
                Explore all {allServices.length} services
                <ArrowRight className="size-3.5 ml-1.5" />
              </Link>
            </div>

            {/* Interactive Category Filter Pills */}
            <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategoryTab(null)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                  selectedCategoryTab === null
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                All Services ({allServices.length})
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryTab(cat.id)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer",
                    selectedCategoryTab === cat.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Services Grid */}
            {servicesQuery.isLoading ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed bg-card p-12 text-center text-muted-foreground">
                <p className="font-semibold text-foreground">No services found for this category.</p>
                <p className="mt-1 text-sm">Try selecting another category or browse the explore catalog.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-xl"
                  onClick={() => setSelectedCategoryTab(null)}
                >
                  Reset Filter
                </Button>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    title={service.name}
                    description={service.description}
                    category={categoryNames.get(service.category_id) ?? "Service"}
                    provider={providerNames.get(service.owner_id) ?? "Verified Specialist"}
                    price={service.price}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How It Works Journey */}
        <section id="how-it-works" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold tracking-widest text-primary uppercase">Simple & Seamless</p>
              <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                How LocaBazaar Works
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Get high-quality service at your doorstep in three quick steps.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {HOW_IT_WORKS.map((step, idx) => (
                <div
                  key={step.number}
                  className="relative flex flex-col rounded-2xl border bg-card p-8 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-3xl font-black text-primary/30">{step.number}</span>
                    <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                      <step.icon className="size-6" strokeWidth={1.8} />
                    </span>
                  </div>

                  <h3 className="mt-6 font-heading text-xl font-bold tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Testimonials Showcase */}
        <section className="border-t border-border/40 bg-secondary/30 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold tracking-widest text-primary uppercase">Real Customer Feedback</p>
              <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                Trusted by Homeowners Across Town
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Read authentic feedback from genuine local customers after completed services.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-xs transition hover:border-primary/30"
                >
                  <div>
                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-foreground italic">“{t.quote}”</p>
                  </div>

                  <div className="mt-6 flex items-center gap-3 border-t pt-4">
                    <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{t.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {t.service} • {t.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dual Provider Call-To-Action Banner */}
        <section id="for-providers" className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-indigo-700 to-purple-800 p-8 text-primary-foreground sm:p-14 lg:p-16 shadow-2xl">
              {/* Background ambient lighting */}
              <div className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -left-16 -bottom-16 size-80 rounded-full bg-purple-500/20 blur-2xl" />

              <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    <Users className="size-3.5" />
                    For Skilled Professionals & Technicians
                  </span>
                  <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-tight sm:text-5xl">
                    Grow your business with verified local customers.
                  </h2>
                  <p className="mt-4 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
                    Join LocaBazaar as a service partner. List your services, get direct booking requests, and
                    build your verified local reputation with 0 hidden commission traps.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      href="/register"
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "rounded-xl bg-white text-primary font-bold hover:bg-white/90 shadow-lg"
                      )}
                    >
                      <span>Join as a Provider</span>
                      <ArrowRight className="size-4 ml-1.5" />
                    </Link>

                    <Link
                      href="/explore"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "rounded-xl border-white/30 text-white hover:bg-white/10"
                      )}
                    >
                      Explore Directory
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md sm:p-8 space-y-4">
                  <h3 className="font-heading text-xl font-bold text-white">Why Pros Choose LocaBazaar</h3>
                  <ul className="space-y-3">
                    {[
                      "Direct customer bookings with guaranteed payment",
                      "Full control over your service catalog and prices",
                      "Automated schedule and status management",
                      "Authentic customer reviews to build your profile",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-white/90">
                        <CheckCircle2 className="mt-0.5 size-4 text-emerald-300 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
