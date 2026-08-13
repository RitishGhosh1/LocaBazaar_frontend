"use client";

import { ArrowRight, BadgeCheck, CalendarCheck2, CheckCircle2, Search, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { ServiceCard } from "@/components/common/service-card";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { useServiceCategories, useServices } from "@/hooks/use-services";
import { useProviders } from "@/hooks/use-providers";
import { cn } from "@/lib/utils";

const steps = [
  { number: "01", title: "Discover", description: "Find a service that fits your needs, nearby.", icon: Search },
  { number: "02", title: "Book", description: "Choose a provider and send a booking request.", icon: CalendarCheck2 },
  { number: "03", title: "Get it done", description: "Connect, coordinate, and get back to your day.", icon: CheckCircle2 },
];

const trustPoints = [
  { title: "Clear provider profiles", description: "See the service information shared by providers before you enquire.", icon: BadgeCheck },
  { title: "Secure sign-in", description: "Use email or Google sign-in to access your LocaBazaar account.", icon: ShieldCheck },
  { title: "Reviews that help", description: "Reviews give customers a clearer view of service experiences.", icon: Star },
  { title: "Simple booking flow", description: "Move from discovering a service to requesting a booking in fewer steps.", icon: CalendarCheck2 },
];

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const categoriesQuery = useServiceCategories();
  const servicesQuery = useServices({ limit: 4 });
  const providersQuery = useProviders();

  const categories = categoriesQuery.data ?? [];
  const services = servicesQuery.data?.items ?? [];
  const categoryNames = new Map(categories.map((c) => [c.id, c.name]));
  const providerNames = new Map((providersQuery.data ?? []).map((p) => [p.id, p.name]));

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/explore");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklch,var(--secondary),transparent_15%),transparent_42%)]" />
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-28">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <span className="size-2 rounded-full bg-emerald-500" />
                Services that feel closer to home
              </p>
              <h1 className="mt-6 max-w-3xl font-heading text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                Find trusted services, right around the corner.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                Discover local professionals for the jobs, moments, and everyday needs that matter most.
              </p>
              <form onSubmit={handleSearchSubmit} className="mt-9 grid gap-3 rounded-lg border bg-card p-3 shadow-lg sm:grid-cols-[1fr_auto]">
                <label className="flex min-w-0 items-center gap-3 px-3 py-3">
                  <Search className="size-5 text-muted-foreground" aria-hidden="true" />
                  <span className="sr-only">Service needed</span>
                  <input
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    placeholder="What service do you need?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </label>
                <Button className="w-full sm:w-auto" type="submit">
                  <Search aria-hidden="true" />
                  Search
                </Button>
              </form>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link href="/explore" className={buttonVariants({ size: "lg" })}>
                  Find a service
                  <ArrowRight aria-hidden="true" />
                </Link>
                <Link href="#categories" className={buttonVariants({ size: "lg", variant: "outline" })}>
                  Explore categories
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="rounded-lg border bg-card p-5 shadow-xl sm:p-7 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Available Categories</p>
                  <span className="text-xs text-muted-foreground">{categories.length} listed</span>
                </div>
                {categoriesQuery.isLoading ? (
                  <div className="h-24 animate-pulse rounded-md bg-muted" />
                ) : categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No categories listed yet.</p>
                ) : (
                  <div className="space-y-2">
                    {categories.slice(0, 4).map((category) => (
                      <Link
                        key={category.id}
                        href={`/explore?category_id=${category.id}`}
                        className="flex items-center justify-between rounded-md border p-3 text-sm font-medium hover:bg-muted/50 transition"
                      >
                        <span>{category.name}</span>
                        <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Browse by need</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Explore categories</h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">Select a category to filter local service offerings.</p>
          </div>
          {categoriesQuery.isLoading ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="mt-10 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No categories have been added to the platform yet.
            </div>
          ) : (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/explore?category_id=${category.id}`}
                  className="rounded-lg border bg-card p-5 transition hover:shadow-md"
                >
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {category.description || "Browse services in this category."}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Featured Live Services Section */}
        <section id="featured-services" className="border-y bg-secondary/40">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Live Listings</p>
                <h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Popular services near you</h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">Browse active service offerings from local providers.</p>
              </div>
              <Link href="/explore" className={buttonVariants({ variant: "outline", size: "sm" })}>
                View all services
              </Link>
            </div>

            {servicesQuery.isLoading ? (
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="mt-10 rounded-lg border border-dashed bg-card p-10 text-center text-muted-foreground">
                <p className="font-semibold text-foreground">No active service listings published yet.</p>
                <p className="mt-1 text-sm">Become a provider or check back later to discover new services.</p>
                <Link href="/register" className={cn(buttonVariants({ size: "sm" }), "mt-4")}>
                  Become a provider
                </Link>
              </div>
            ) : (
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    id={service.id}
                    title={service.name}
                    description={service.description}
                    category={categoryNames.get(service.category_id) ?? "Service"}
                    provider={providerNames.get(service.owner_id) ?? "Verified Provider"}
                    price={service.price}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">How LocaBazaar works</p>
              <h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Local help, without the runaround.</h2>
              <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">A straightforward path from finding the right service to getting your task done.</p>
            </div>
            <ol className="grid gap-4 sm:grid-cols-3">
              {steps.map((step) => (
                <li key={step.number} className="border-t pt-5">
                  <p className="text-sm font-semibold text-muted-foreground">{step.number}</p>
                  <step.icon className="mt-7 size-6" strokeWidth={1.6} aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Provider CTA */}
        <section id="for-providers" className="bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold tracking-widest text-primary-foreground/65 uppercase">For local professionals</p>
              <h2 className="mt-4 max-w-2xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Turn your skills into your next opportunity.</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-primary-foreground/75">Create services, connect with customers nearby, and build the local reputation your work deserves.</p>
              <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90")}>
                Become a provider
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
            <div className="border border-primary-foreground/20 p-6 sm:p-8">
              <p className="font-heading text-2xl font-semibold">Your craft has a place here.</p>
              <ul className="mt-7 space-y-4">
                {["List services you are proud of", "Connect with nearby customers", "Manage interest in one place"].map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-primary-foreground/80">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Trust Points */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Designed for confidence</p>
            <h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">A clearer way to choose local services.</h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((point) => (
              <div key={point.title}>
                <point.icon className="size-6" strokeWidth={1.6} aria-hidden="true" />
                <h3 className="mt-5 font-semibold">{point.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{point.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

