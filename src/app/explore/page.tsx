"use client";

import { AlertCircle, ChevronLeft, ChevronRight, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import { ServiceCard } from "@/components/common/service-card";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { useServiceCategories, useServices } from "@/hooks/use-services";

const PAGE_SIZE = 12;

function ServiceCardSkeleton() {
  return <div className="overflow-hidden rounded-lg border bg-card"><div className="aspect-[16/10] animate-pulse bg-muted" /><div className="space-y-3 p-5"><div className="h-3 w-20 animate-pulse rounded bg-muted" /><div className="h-5 w-3/4 animate-pulse rounded bg-muted" /><div className="h-4 w-full animate-pulse rounded bg-muted" /><div className="h-4 w-2/3 animate-pulse rounded bg-muted" /></div></div>;
}

export default function ExplorePage() {
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [skip, setSkip] = useState(0);
  const { data: categories = [], isLoading: areCategoriesLoading } = useServiceCategories();
  const params = useMemo(() => ({ q: query || undefined, category_id: categoryId, skip, limit: PAGE_SIZE }), [categoryId, query, skip]);
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
  const total = servicesQuery.data?.total ?? 0;
  const hasPreviousPage = skip > 0;
  const hasNextPage = Boolean(servicesQuery.data && (servicesQuery.data.next_cursor !== null && servicesQuery.data.next_cursor !== undefined || skip + PAGE_SIZE < total));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b bg-secondary/40"><div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16"><p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Discover local help</p><h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Explore services</h1><p className="mt-4 max-w-2xl text-muted-foreground">Browse currently available services and find the right fit for your next task.</p><form className="mt-8 grid gap-3 rounded-lg border bg-card p-3 shadow-sm sm:grid-cols-[1fr_1fr_auto]" onSubmit={applySearch}><label className="flex items-center gap-3 border-b px-3 py-3 sm:border-r sm:border-b-0"><Search className="size-5 text-muted-foreground" aria-hidden="true" /><span className="sr-only">Search services</span><input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search services..." /></label><label className="flex items-center gap-3 border-b px-3 py-3 sm:border-r sm:border-b-0"><MapPin className="size-5 text-muted-foreground" aria-hidden="true" /><span className="sr-only">Location</span><input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Location filtering coming soon" disabled /></label><Button type="submit"><Search aria-hidden="true" />Search</Button></form></div></section>

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14"><div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]"><aside><div className="flex items-center gap-2"><SlidersHorizontal className="size-4" aria-hidden="true" /><h2 className="font-semibold">Categories</h2></div><div className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible"><button type="button" onClick={() => selectCategory(null)} className={`shrink-0 rounded-md px-3 py-2 text-left text-sm transition ${categoryId === null ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"}`}>All services</button>{areCategoriesLoading ? <div className="h-9 w-32 animate-pulse rounded bg-muted" /> : categories.map((category) => <button key={category.id} type="button" onClick={() => selectCategory(category.id)} className={`shrink-0 rounded-md px-3 py-2 text-left text-sm transition ${categoryId === category.id ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"}`}>{category.name}</button>)}</div></aside>
            <div><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="font-heading text-3xl font-semibold tracking-tight">Services near you</h2>{servicesQuery.data && <p className="mt-2 text-sm text-muted-foreground">{total} service{total === 1 ? "" : "s"} found</p>}</div>{query && <p className="text-sm text-muted-foreground">Results for “{query}”</p>}</div>
              {servicesQuery.isLoading ? <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <ServiceCardSkeleton key={index} />)}</div> : servicesQuery.isError ? <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-6"><div className="flex gap-3"><AlertCircle className="mt-0.5 size-5 text-destructive" aria-hidden="true" /><div><h3 className="font-semibold">Unable to load services</h3><p className="mt-1 text-sm text-muted-foreground">Please check your connection and try again.</p><Button className="mt-4" size="sm" variant="outline" type="button" onClick={() => servicesQuery.refetch()}>Try again</Button></div></div></div> : servicesQuery.data?.items.length === 0 ? <div className="mt-8 rounded-lg border border-dashed p-10 text-center"><h3 className="font-semibold">No services found</h3><p className="mt-2 text-sm text-muted-foreground">Try a different search term or category.</p></div> : <><div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{servicesQuery.data?.items.map((service) => <ServiceCard key={service.id} id={service.id} title={service.name} description={service.description} category={categoryNames.get(service.category_id) ?? `Category #${service.category_id}`} price={service.price} />)}</div><div className="mt-10 flex items-center justify-between border-t pt-6"><Button type="button" variant="outline" disabled={!hasPreviousPage} onClick={() => setSkip((current) => Math.max(0, current - PAGE_SIZE))}><ChevronLeft aria-hidden="true" />Previous</Button><p className="text-sm text-muted-foreground">Showing {total === 0 ? 0 : skip + 1}–{Math.min(skip + PAGE_SIZE, total)} of {total}</p><Button type="button" variant="outline" disabled={!hasNextPage} onClick={() => setSkip((current) => current + PAGE_SIZE)}>Next<ChevronRight aria-hidden="true" /></Button></div></>}</div>
          </div></section>
      </main>
      <Footer />
    </div>
  );
}
