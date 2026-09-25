"use client";

import {
  ArrowRight,
  BadgeCheck,
  Droplets,
  Heart,
  Laptop,
  MapPin,
  Paintbrush,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getCategoryIcon(categoryName?: string): LucideIcon {
  const norm = (categoryName || "").toLowerCase();
  if (norm.includes("clean")) return Sparkles;
  if (norm.includes("tech") || norm.includes("support") || norm.includes("computer")) return Laptop;
  if (norm.includes("appliance") || norm.includes("repair")) return Wrench;
  if (norm.includes("electr")) return Zap;
  if (norm.includes("plumb")) return Droplets;
  if (norm.includes("paint") || norm.includes("carpent")) return Paintbrush;
  if (norm.includes("pest")) return ShieldCheck;
  if (norm.includes("beauty") || norm.includes("salon") || norm.includes("wellness")) return Heart;
  return Wrench;
}

import { useState } from "react";
import { getFullImageUrl } from "@/services/uploads";

interface ServiceCardProps {
  id?: number;
  title: string;
  description?: string | null;
  category?: string;
  price: number;
  provider?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  icon?: LucideIcon;
  accentClassName?: string;
  imageUrl?: string | null;
  image_url?: string | null;
}

export function ServiceCard({
  title,
  description,
  provider,
  category,
  price,
  rating,
  reviewCount,
  location,
  id,
  imageUrl,
  image_url,
}: ServiceCardProps) {
  const [imageError, setImageError] = useState(false);
  const IconComponent = getCategoryIcon(category);
  const targetHref = id !== undefined ? `/services/${id}` : "/explore";

  const rawImage = imageUrl || image_url;
  const fullImage = rawImage ? getFullImageUrl(rawImage) : null;
  const showImage = Boolean(fullImage && !imageError);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      {/* Visual Header with Real Image or Clean Neutral Gradient */}
      <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-muted/60 via-muted/30 to-background/50 border-b border-border/40">
        {showImage ? (
          <>
            <img
              src={fullImage!}
              alt={title}
              className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
          </>
        ) : (
          <>
            {/* Subtle Decorative Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:12px_12px]" />

            {/* Center Modern Icon Badge */}
            <div className="relative grid size-14 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-xs transition-transform duration-200 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
              <IconComponent className="size-7" strokeWidth={1.75} aria-hidden="true" />
            </div>
          </>
        )}

        {/* Floating Top Category Badge */}
        {category && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-md shadow-xs">
              <IconComponent className="size-3 text-primary" aria-hidden="true" />
              {category}
            </span>
          </div>
        )}

        {/* Floating Rating or Verified Tag */}
        <div className="absolute top-3 right-3 z-10">
          {rating !== undefined ? (
            <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/30 bg-background/90 px-2 py-0.5 text-xs font-semibold text-foreground backdrop-blur-md shadow-xs">
              <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden="true" />
              {rating.toFixed(1)}
              {reviewCount !== undefined && (
                <span className="text-[10px] text-muted-foreground">({reviewCount})</span>
              )}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-background/90 px-2 py-0.5 text-[11px] font-medium text-muted-foreground backdrop-blur-md shadow-xs">
              <BadgeCheck className="size-3 text-emerald-500" />
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <h3 className="line-clamp-1 font-heading text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {description || "High quality local service delivered by trained and verified professionals."}
        </p>

        {/* Provider & Location Row */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          {provider && (
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {provider.charAt(0).toUpperCase()}
              </span>
              <span className="truncate max-w-[140px]">{provider}</span>
              <BadgeCheck className="size-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
            </div>
          )}

          {location && (
            <div className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
              <MapPin className="size-3 text-muted-foreground" aria-hidden="true" />
              <span>{location}</span>
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                Starting from
              </p>
              <p className="font-heading text-xl font-bold text-foreground">
                ₹{price.toLocaleString("en-IN")}
              </p>
            </div>

            <Link
              href={targetHref}
              className={cn(
                buttonVariants({ size: "sm" }),
                "group/btn inline-flex items-center gap-1.5 rounded-xl font-semibold shadow-sm transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground"
              )}
            >
              <span>View Details</span>
              <ArrowRight
                className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
