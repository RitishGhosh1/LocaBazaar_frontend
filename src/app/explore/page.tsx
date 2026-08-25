"use client";

import { AlertCircle, Briefcase, ChevronLeft, ChevronRight, Search, SlidersHorizontal, Users, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { ServiceCard } from "@/components/common/service-card";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProviders } from "@/hooks/use-providers";
import { useReviewsForService } from "@/hooks/use-reviews";
import { useServiceCategories, useServices } from "@/hooks/use-services";
import type { ServiceShort } from "@/services/services";

const PAGE_SIZE = 12;

function ServiceCardWithReviews({
  service,
  categoryName,
  providerName,
}: {
  service: ServiceShort;
  categoryName: string;
  providerName?: string;
}) {
  const reviewsQuery = useReviewsForService(service.id);
  const reviews = reviewsQuery.data?.items ?? [];
  const reviewCount = reviews.length;
  const rating =
    reviewCount > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
      : undefined;

  return (
    <ServiceCard
      id={service.id}
      title={service.name}
      description={service.description}
      category={categoryName}
      provider={providerName}
      price={service.price}
      rating={rating}
      reviewCount={reviewCount > 0 ? reviewCount : undefined}
    />
  );
}

function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="aspect-[16/10] animate-pulse bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<"services" | "providers">("services");
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const [skip, setSkip] = useState(0);

  const { data: categories = [], isLoading: areCategoriesLoading } = useServiceCategories();
  const providersQuery = useProviders();
  const params = useMemo(
    () => ({ q: query || undefined, category_id: categoryId ?? undefined, skip, limit: PAGE_SIZE }),
    [categoryId, query, skip],
  );
  const servicesQuery = useServices(params);

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSkip(0);
    setQuery(searchInput.trim());
  }

  function selectCategory(id: number | null) {
    setSkip(0);
    setCategoryId(id);
  }

  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
  const providerData = providersQuery.data;
  const providerNames = useMemo(
    () => new Map((providerData ?? []).map((provider) => [provider.id, provider.name])),
    [providerData],
  );

  // Filter out superusers from provider exploration
  const eligibleProviders = useMemo(
    () => (providerData ?? []).filter((p) => (p as { is_superuser?: boolean }).is_superuser !== true && p.role === "provider"),
    [providerData],
  );

  const rawItems = servicesQuery.data?.items ?? [];
  const filteredServices = selectedProviderId
    ? rawItems.filter((s) => s.owner_id === selectedProviderId)
    : rawItems;

  const total = selectedProviderId ? filteredServices.length : (servicesQuery.data?.total ?? 0);
  const hasPreviousPage = skip > 0;
  const hasNextPage = Boolean(
    servicesQuery.data &&
      (servicesQuery.data.next_cursor !== null && servicesQuery.data.next_cursor !== undefined ||
        skip + PAGE_SIZE < total),
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b bg-secondary/40">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                  Discover local help
                </p>
                <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
                  {activeTab === "services" ? "Explore Services" : "Explore Service Providers"}
                </h1>
                <p className="mt-4 max-w-2xl text-muted-foreground">
                  {activeTab === "services"
                    ? "Browse currently available services, check ratings, and book local experts."
                    : "Discover registered local service providers on LocaBazaar."}
                </p>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center gap-2 rounded-lg border bg-background p-1.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => setActiveTab("services")}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                    activeTab === "services"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Briefcase className="size-4" />
                  Services
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("providers")}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                    activeTab === "providers"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Users className="size-4" />
                  Providers ({eligibleProviders.length})
                </button>
              </div>
            </div>

            {activeTab === "services" && (
              <form
                className="mt-8 grid gap-3 rounded-lg border bg-card p-3 shadow-sm sm:grid-cols-[1fr_auto]"
                onSubmit={applySearch}
              >
                <label className="flex items-center gap-3 px-3 py-3">
                  <Search className="size-5 text-muted-foreground" aria-hidden="true" />
                  <span className="sr-only">Search services</span>
                  <input
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search services by keyword or title..."
                  />
                </label>
                <Button type="submit">
                  <Search aria-hidden="true" />
                  Search
                </Button>
              </form>
            )}
          </div>
        </section>

        {activeTab === "services" ? (
          <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
            <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
              <aside>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="size-4" aria-hidden="true" />
                  <h2 className="font-semibold">Categories</h2>
                </div>
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
                  <button
                    type="button"
                    onClick={() => selectCategory(null)}
                    className={`shrink-0 rounded-md px-3 py-2 text-left text-sm transition ${
                      categoryId === null ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"
                    }`}
                  >
                    All services
                  </button>
                  {areCategoriesLoading ? (
                    <div className="h-9 w-32 animate-pulse rounded bg-muted" />
                  ) : (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => selectCategory(category.id)}
                        className={`shrink-0 rounded-md px-3 py-2 text-left text-sm transition ${
                          categoryId === category.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-muted"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))
                  )}
                </div>
              </aside>

              <div>
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div>
                    <h2 className="font-heading text-3xl font-semibold tracking-tight">Services near you</h2>
                    {servicesQuery.data && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {total} service{total === 1 ? "" : "s"} found
                      </p>
                    )}
                  </div>
                  {selectedProviderId && (
                    <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                      <span>Filtered by Provider: {providerNames.get(selectedProviderId) ?? `#${selectedProviderId}`}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedProviderId(null)}
                        className="hover:opacity-75"
                        aria-label="Clear provider filter"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  )}
                </div>

                {servicesQuery.isLoading ? (
                  <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }, (_, index) => (
                      <ServiceCardSkeleton key={index} />
                    ))}
                  </div>
                ) : servicesQuery.isError ? (
                  <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-6">
                    <div className="flex gap-3">
                      <AlertCircle className="mt-0.5 size-5 text-destructive" aria-hidden="true" />
                      <div>
                        <h3 className="font-semibold">Unable to load services</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Please check your connection and try again.
                        </p>
                        <Button
                          className="mt-4"
                          size="sm"
                          variant="outline"
                          type="button"
                          onClick={() => servicesQuery.refetch()}
                        >
                          Try again
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : filteredServices.length === 0 ? (
                  <div className="mt-8 rounded-lg border border-dashed p-10 text-center">
                    <h3 className="font-semibold">No services found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Try a different search term or category.</p>
                  </div>
                ) : (
                  <>
                    <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {filteredServices.map((service) => (
                        <ServiceCardWithReviews
                          key={service.id}
                          service={service}
                          categoryName={categoryNames.get(service.category_id) ?? "Service"}
                          providerName={providerNames.get(service.owner_id)}
                        />
                      ))}
                    </div>
                    <div className="mt-10 flex items-center justify-between border-t pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!hasPreviousPage}
                        onClick={() => setSkip((current) => Math.max(0, current - PAGE_SIZE))}
                      >
                        <ChevronLeft aria-hidden="true" />
                        Previous
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        Showing {total === 0 ? 0 : skip + 1}–{Math.min(skip + PAGE_SIZE, total)} of {total}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!hasNextPage}
                        onClick={() => setSkip((current) => current + PAGE_SIZE)}
                      >
                        Next
                        <ChevronRight aria-hidden="true" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        ) : (
          /* Providers Section */
          <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
            {providersQuery.isLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-44 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : providersQuery.isError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
                <h3 className="font-semibold">Unable to load providers</h3>
                <p className="mt-1 text-sm text-muted-foreground">Please try again.</p>
              </div>
            ) : eligibleProviders.length === 0 ? (
              <div className="rounded-lg border border-dashed p-10 text-center">
                <h3 className="font-semibold">No registered providers found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Provider accounts will appear here once registered.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {eligibleProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className="flex flex-col justify-between rounded-lg border bg-card p-6 shadow-sm transition hover:shadow-md"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">Verified Provider</Badge>
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-semibold">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground">{provider.email}</p>
                      </div>
                      {provider.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-3">{provider.bio}</p>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t pt-4">
                      <Badge variant={provider.is_active ? "success" : "muted"}>
                        {provider.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={() => {
                          setSelectedProviderId(provider.id);
                          setActiveTab("services");
                        }}
                      >
                        View Services
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

