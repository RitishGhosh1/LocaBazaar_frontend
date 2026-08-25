"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, LocateFixed, MapPin, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ErrorState, PageHeader } from "@/components/dashboard/dashboard-primitives";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/use-categories";
import { useCreateService } from "@/hooks/use-provider-services";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  getBrowserLocation,
  LocationSuggestion,
  POPULAR_LOCATIONS,
  searchLocations,
} from "@/lib/geocoding";

const serviceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category_id: z.coerce.number().int().positive("Select a category"),
  description: z.string().optional(),
  price: z.coerce.number().int().positive("Price must be a positive whole number"),
  latitude: z.preprocess((val) => (val === "" || val === undefined || val === null ? undefined : Number(val)), z.number().min(-90, "Latitude must be >= -90").max(90, "Latitude must be <= 90").optional()),
  longitude: z.preprocess((val) => (val === "" || val === undefined || val === null ? undefined : Number(val)), z.number().min(-180, "Longitude must be >= -180").max(180, "Longitude must be <= 180").optional()),
});

type ServiceFormInput = z.input<typeof serviceSchema>;
type ServiceFormOutput = z.output<typeof serviceSchema>;

export default function NewProviderServicePage() {
  const router = useRouter();
  const categoriesQuery = useCategories();
  const createMutation = useCreateService();

  const [areaInput, setAreaInput] = useState("");
  const [selectedAreaName, setSelectedAreaName] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const suggestionBoxRef = useRef<HTMLDivElement>(null);

  const form = useForm<ServiceFormInput, unknown, ServiceFormOutput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      category_id: 0,
      description: "",
      price: 0,
      latitude: undefined,
      longitude: undefined,
    },
  });

  async function handleAreaInputChange(value: string) {
    setAreaInput(value);
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

  // Click outside to close dropdown
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

  function handleSelectLocation(loc: LocationSuggestion) {
    form.setValue("latitude", loc.lat);
    form.setValue("longitude", loc.lng);
    setSelectedAreaName(loc.name);
    setAreaInput(loc.name);
    setShowSuggestions(false);
    toast.success(`Service area set to ${loc.name}`);
  }

  function handleClearLocation() {
    form.setValue("latitude", undefined);
    form.setValue("longitude", undefined);
    setSelectedAreaName(null);
    setAreaInput("");
    setSuggestions([]);
  }

  async function handleUseCurrentLocation() {
    setIsLocating(true);
    try {
      const pos = await getBrowserLocation();
      form.setValue("latitude", pos.lat);
      form.setValue("longitude", pos.lng);
      setSelectedAreaName("Current Location");
      setAreaInput("Current Location");
      setShowSuggestions(false);
      toast.success("Current location captured");
    } catch {
      toast.error("Could not auto-detect location. Please type your city/area name.");
    } finally {
      setIsLocating(false);
    }
  }

  async function onSubmit(values: ServiceFormOutput) {
    try {
      await createMutation.mutateAsync({
        name: values.name,
        category_id: values.category_id,
        description: values.description || null,
        price: values.price,
        latitude: values.latitude ?? null,
        longitude: values.longitude ?? null,
      });
      toast.success("Service created successfully");
      router.push("/provider/services");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create service"));
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="Create service"
        description="Add a new service listing to connect with local customers in your area."
        action={
          <Link href="/provider/services" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <ArrowLeft aria-hidden="true" />
            Back
          </Link>
        }
      />

      {categoriesQuery.isError ? (
        <ErrorState
          title="Unable to load categories"
          description="Categories are required to create a service."
          onRetry={() => categoriesQuery.refetch()}
        />
      ) : (
        <form className="space-y-6 rounded-lg border bg-card p-6 shadow-sm" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">Service name</Label>
            <Input id="name" {...form.register("name")} aria-invalid={Boolean(form.formState.errors.name)} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Category</Label>
            <Select
              id="category_id"
              defaultValue=""
              {...form.register("category_id")}
              aria-invalid={Boolean(form.formState.errors.category_id)}
            >
              <option value="" disabled>
                {categoriesQuery.isLoading ? "Loading categories…" : "Select a category"}
              </option>
              {categoriesQuery.data?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            {form.formState.errors.category_id && (
              <p className="text-sm text-destructive">{form.formState.errors.category_id.message}</p>
            )}
            {(categoriesQuery.data?.length ?? 0) === 0 && !categoriesQuery.isLoading && (
              <p className="text-sm text-muted-foreground">
                No categories exist yet. Ask a superadmin to create categories first.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" rows={4} {...form.register("description")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (INR, whole number)</Label>
            <Input
              id="price"
              type="number"
              min={1}
              step={1}
              {...form.register("price")}
              aria-invalid={Boolean(form.formState.errors.price)}
            />
            {form.formState.errors.price && (
              <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
            )}
          </div>

          {/* Location Area Picker */}
          <div className="space-y-3 rounded-lg border bg-secondary/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                <Label className="text-sm font-semibold">Service Area (optional)</Label>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
              >
                <LocateFixed className="mr-1.5 size-3.5" />
                {isLocating ? "Detecting…" : "Use current location"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Select your neighborhood or city so nearby customers can discover your service.
            </p>

            <div className="relative" ref={suggestionBoxRef}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Type city or area (e.g. Koramangala, Indiranagar, Whitefield)"
                  value={areaInput}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => handleAreaInputChange(e.target.value)}
                />
                {areaInput && (
                  <button
                    type="button"
                    onClick={handleClearLocation}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              {/* Suggestions dropdown */}
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
                      onClick={() => handleSelectLocation(loc)}
                      className="flex w-full items-start gap-2 rounded px-2.5 py-2 text-left text-xs transition hover:bg-muted"
                    >
                      <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground">{loc.name}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{loc.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Popular Locations */}
            <div>
              <p className="text-[11px] font-medium text-muted-foreground mb-1">Popular Bangalore areas:</p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_LOCATIONS.slice(0, 6).map((loc) => (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => handleSelectLocation(loc)}
                    className={`rounded-full border px-2.5 py-0.5 text-xs transition ${
                      selectedAreaName === loc.name
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {loc.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {selectedAreaName && (
              <div className="flex items-center justify-between rounded-md border border-primary/20 bg-primary/5 p-2.5 text-xs text-primary">
                <div className="flex items-center gap-1.5 font-medium">
                  <Check className="size-4" />
                  <span>Service area set to: <strong>{selectedAreaName}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={handleClearLocation}
                  className="text-muted-foreground hover:text-destructive text-[11px] underline"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          <Button type="submit" disabled={createMutation.isPending || categoriesQuery.isLoading}>
            {createMutation.isPending ? "Creating…" : "Create service"}
          </Button>
        </form>
      )}
    </div>
  );
}


