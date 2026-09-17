"use client";

import { AlertCircle, Briefcase, Check, ChevronLeft, ChevronRight, LocateFixed, MapPin, Search, SlidersHorizontal, Users, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";

import { ServiceCard } from "@/components/common/service-card";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProviders } from "@/hooks/use-providers";
import { useReviewsForService } from "@/hooks/use-reviews";
import { useServiceCategories, useServices } from "@/hooks/use-services";
import {
  calculateDistanceKm,
  getBrowserLocation,
  LocationSuggestion,
  POPULAR_LOCATIONS,
  searchLocations,
} from "@/lib/geocoding";
import type { ServiceShort } from "@/services/services";

const PAGE_SIZE = 12;

const QUICK_LOCATIONS = [
  "Koramangala",
  "Indiranagar",
  "Whitefield",
  "HSR Layout",
  "Bangalore Central (MG Road)",
];

function ServiceCardWithReviews({
  service,
  categoryName,
  providerName,
  appliedLat,
  appliedLng,
}: {
  service: ServiceShort;
  categoryName: string;
  providerName?: string;
  appliedLat?: number | null;
  appliedLng?: number | null;
}) {
  const reviewsQuery = useReviewsForService(service.id);
  const reviews = reviewsQuery.data?.items ?? [];
  const reviewCount = reviews.length;
  const rating =
    reviewCount > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
      : undefined;

  let locationString: string | undefined = undefined;
  if (
    appliedLat != null &&
    appliedLng != null &&
    service.latitude != null &&
    service.longitude != null
  ) {
    const dist = calculateDistanceKm(
      appliedLat,
      appliedLng,
      service.latitude,
      service.longitude,
    );
    locationString = `📍 ${dist} km away`;
  }

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
      location={locationString}
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

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category_id") ? Number(searchParams.get("category_id")) : null;
  const initialLocation = searchParams.get("location") || "";
  const initialLat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null;
  const initialLng = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null;
  const initialRadius = searchParams.get("radius") ? parseFloat(searchParams.get("radius")!) : 10;

  const [activeTab, setActiveTab] = useState<"services" | "providers">("services");
  const [searchInput, setSearchInput] = useState(initialQ);
  const [query, setQuery] = useState(initialQ);
  const [categoryId, setCategoryId] = useState<number | null>(initialCategory);
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);

  // Friendly location filtering states
  const [locationInput, setLocationInput] = useState(initialLocation);
  const [appliedLocationName, setAppliedLocationName] = useState<string | null>(
    initialLocation || (initialLat !== null && initialLng !== null ? "Selected Location" : null),
  );
  const [appliedLat, setAppliedLat] = useState<number | null>(initialLat !== null && !isNaN(initialLat) ? initialLat : null);
  const [appliedLng, setAppliedLng] = useState<number | null>(initialLng !== null && !isNaN(initialLng) ? initialLng : null);
  const [radiusInput, setRadiusInput] = useState(String(initialRadius));
  const [appliedRadius, setAppliedRadius] = useState<number | null>(
    initialLat !== null && initialLng !== null ? initialRadius : null,
  );

  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);

  const suggestionBoxRef = useRef<HTMLDivElement>(null);

  async function handleLocationInputChange(value: string) {
    setLocationInput(value);
    setShowSuggestions(true);
    if (!value.trim() || value.length < 2) {
      setSuggestions([]);
      return;
    }
    setIsSearchingSuggestions(true);
    try {
      const results = await searchLocations(value);
      setSuggestions(results);
    } finally {
      setIsSearchingSuggestions(false);
    }
  }

  // Click outside to close suggestion dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionBoxRef.current &&
        !suggestionBoxRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: categories = [], isLoading: areCategoriesLoading } = useServiceCategories();
  const providersQuery = useProviders();
  const params = useMemo(
    () => ({
      q: query || undefined,
      category_id: categoryId ?? undefined,
      lat: appliedLat ?? undefined,
      lng: appliedLng ?? undefined,
      radius: appliedRadius ?? undefined,
      skip,
      limit: PAGE_SIZE,
    }),
    [categoryId, query, appliedLat, appliedLng, appliedRadius, skip],
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

  function selectLocationSuggestion(suggestion: LocationSuggestion) {
    const rad = Number(radiusInput) > 0 ? Number(radiusInput) : 10;
    setLocationInput(suggestion.name);
    setAppliedLocationName(suggestion.name);
    setAppliedLat(suggestion.lat);
    setAppliedLng(suggestion.lng);
    setAppliedRadius(rad);
    setLocationError(null);
    setShowSuggestions(false);
    setSkip(0);
  }

  function selectQuickLocation(name: string) {
    const found = POPULAR_LOCATIONS.find((loc) => loc.name === name);
    if (found) {
      selectLocationSuggestion(found);
    }
  }

  async function handleUseMyLocation() {
    setIsLocating(true);
    setLocationError(null);
    try {
      const pos = await getBrowserLocation();
      const rad = Number(radiusInput) > 0 ? Number(radiusInput) : 10;
      setLocationInput("Current Location");
      setAppliedLocationName("Current Location");
      setAppliedLat(pos.lat);
      setAppliedLng(pos.lng);
      setAppliedRadius(rad);
      setShowSuggestions(false);
      setSkip(0);
    } catch {
      setLocationError(
        "Could not detect location automatically. Please select or type your area above.",
      );
    } finally {
      setIsLocating(false);
    }
  }

  async function handleLocationSubmit(e: FormEvent) {
    e.preventDefault();
    if (!locationInput.trim()) return;

    // Check if matching suggestion already loaded
    if (suggestions.length > 0) {
      selectLocationSuggestion(suggestions[0]);
      return;
    }

    // Direct search
    setIsSearchingSuggestions(true);
    try {
      const results = await searchLocations(locationInput);
      if (results.length > 0) {
        selectLocationSuggestion(results[0]);
      } else {
        setLocationError(`No locations found for "${locationInput}". Try typing a major area or city.`);
      }
    } finally {
      setIsSearchingSuggestions(false);
    }
  }

  function clearLocationFilter() {
    setLocationInput("");
    setAppliedLocationName(null);
    setAppliedLat(null);
    setAppliedLng(null);
    setAppliedRadius(null);
    setLocationError(null);
    setSuggestions([]);
    setShowSuggestions(false);
    setSkip(0);
  }

  function handleRadiusChange(newRadius: string) {
    setRadiusInput(newRadius);
    const radNum = Number(newRadius);
    if (appliedLat !== null && appliedLng !== null && !isNaN(radNum) && radNum > 0) {
      setAppliedRadius(radNum);
      setSkip(0);
    }
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
            <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
              <aside>
                {/* Categories */}
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

                {/* Location & Proximity Filter */}
                <div className="mt-8 border-t pt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-primary" aria-hidden="true" />
                    <h2 className="font-semibold text-sm">Location Filter</h2>
                  </div>

                  <div className="space-y-3">
                    {/* Auto-detect button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center gap-2 text-xs"
                      onClick={handleUseMyLocation}
                      disabled={isLocating}
                    >
                      <LocateFixed className="size-3.5" />
                      {isLocating ? "Detecting location…" : "Use my location"}
                    </Button>

                    {/* Area / City Search Input with Dropdown */}
                    <div className="relative" ref={suggestionBoxRef}>
                      <form onSubmit={handleLocationSubmit} className="relative">
                        <input
                          type="text"
                          placeholder="Type city or area (e.g. Koramangala)"
                          className="w-full rounded-md border bg-background pl-2.5 pr-8 py-2 text-xs outline-none focus:ring-1 focus:ring-ring"
                          value={locationInput}
                          onFocus={() => setShowSuggestions(true)}
                          onChange={(e) => handleLocationInputChange(e.target.value)}
                        />
                        {locationInput && (
                          <button
                            type="button"
                            onClick={clearLocationFilter}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            <X className="size-3.5" />
                          </button>
                        )}
                      </form>

                      {/* Autocomplete Suggestions Box */}
                      {showSuggestions && (suggestions.length > 0 || isSearchingSuggestions) && (
                        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-md border bg-popover p-1 shadow-md">
                          {isSearchingSuggestions && (
                            <div className="p-2 text-center text-xs text-muted-foreground">
                              Searching areas…
                            </div>
                          )}
                          {suggestions.map((loc, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => selectLocationSuggestion(loc)}
                              className="flex w-full items-start gap-2 rounded px-2 py-1.5 text-left text-xs transition hover:bg-muted"
                            >
                              <MapPin className="mt-0.5 size-3 shrink-0 text-primary" />
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-foreground">{loc.name}</p>
                                <p className="truncate text-[10px] text-muted-foreground">{loc.description}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick Popular Area Chips */}
                    <div>
                      <p className="text-[11px] font-medium text-muted-foreground mb-1.5">Popular areas:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {QUICK_LOCATIONS.map((area) => (
                          <button
                            key={area}
                            type="button"
                            onClick={() => selectQuickLocation(area)}
                            className={`rounded-full border px-2 py-0.5 text-[11px] transition ${
                              appliedLocationName === area
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                            }`}
                          >
                            {area.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Proximity Radius */}
                    <div className="space-y-1">
                      <label htmlFor="radius-select" className="text-xs text-muted-foreground">
                        Search radius
                      </label>
                      <select
                        id="radius-select"
                        className="w-full rounded-md border bg-background px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-ring"
                        value={radiusInput}
                        onChange={(e) => handleRadiusChange(e.target.value)}
                      >
                        <option value="5">Within 5 km</option>
                        <option value="10">Within 10 km (Standard)</option>
                        <option value="20">Within 20 km</option>
                        <option value="50">Within 50 km (City-wide)</option>
                      </select>
                    </div>

                    {locationError && (
                      <p className="text-xs text-destructive">{locationError}</p>
                    )}

                    {appliedLocationName && (
                      <div className="rounded-md border border-primary/20 bg-primary/5 p-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-medium text-primary">
                            <Check className="size-3.5" />
                            <span>Filtering by {appliedLocationName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={clearLocationFilter}
                            className="text-muted-foreground hover:text-destructive text-[11px] underline"
                          >
                            Clear
                          </button>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Services within {appliedRadius ?? 10} km
                        </p>
                      </div>
                    )}
                  </div>
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
                  <div className="flex flex-wrap items-center gap-2">
                    {appliedLocationName && (
                      <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                        <MapPin className="size-3.5" />
                        <span>Within {appliedRadius ?? 10} km of {appliedLocationName}</span>
                        <button
                          type="button"
                          onClick={clearLocationFilter}
                          className="hover:opacity-75"
                          aria-label="Clear location filter"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    )}
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
                          appliedLat={appliedLat}
                          appliedLng={appliedLng}
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
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {eligibleProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className="group flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          <Check className="size-3" />
                          Verified Specialist
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground">ID #{provider.id}</span>
                      </div>

                      <div className="flex items-center gap-3.5">
                        <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/20 to-indigo-500/10 text-lg font-bold text-primary shrink-0">
                          {provider.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                            {provider.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">{provider.email}</p>
                        </div>
                      </div>

                      {provider.bio ? (
                        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                          {provider.bio}
                        </p>
                      ) : (
                        <p className="text-xs italic text-muted-foreground">
                          LocaBazaar verified service partner available for doorstep appointments.
                        </p>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t pt-4">
                      {provider.phone ? (
                        <span className="text-xs font-medium text-muted-foreground">
                          📞 +91 {provider.phone}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Online booking</span>
                      )}

                      <Button
                        size="sm"
                        variant="default"
                        type="button"
                        className="rounded-xl font-semibold cursor-pointer"
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

function ExploreWrapper() {
  const searchParams = useSearchParams();
  return <ExploreContent key={searchParams.toString()} />;
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background animate-pulse" />}>
      <ExploreWrapper />
    </Suspense>
  );
}


