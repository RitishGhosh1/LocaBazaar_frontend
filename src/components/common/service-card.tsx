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

interface CategoryTheme {
  icon: LucideIcon;
  gradient: string;
  badgeClass: string;
  iconBg: string;
  iconColor: string;
}

function getCategoryTheme(categoryName?: string): CategoryTheme {
  const norm = (categoryName || "").toLowerCase();

  if (norm.includes("clean")) {
    return {
      icon: Sparkles,
      gradient: "from-emerald-100/90 via-teal-50/70 to-emerald-50/30 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-emerald-950/10",
      badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
      iconBg: "bg-emerald-200/80 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300",
      iconColor: "text-emerald-700 dark:text-emerald-300",
    };
  }
  if (norm.includes("tech") || norm.includes("support") || norm.includes("computer")) {
    return {
      icon: Laptop,
      gradient: "from-indigo-100/90 via-blue-50/70 to-violet-50/30 dark:from-indigo-950/40 dark:via-blue-950/20 dark:to-violet-950/10",
      badgeClass: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60",
      iconBg: "bg-indigo-200/80 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300",
      iconColor: "text-indigo-700 dark:text-indigo-300",
    };
  }
  if (norm.includes("appliance") || norm.includes("repair")) {
    return {
      icon: Wrench,
      gradient: "from-sky-100/90 via-cyan-50/70 to-blue-50/30 dark:from-sky-950/40 dark:via-cyan-950/20 dark:to-blue-950/10",
      badgeClass: "bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border-sky-200 dark:border-sky-800/60",
      iconBg: "bg-sky-200/80 text-sky-800 dark:bg-sky-900/60 dark:text-sky-300",
      iconColor: "text-sky-700 dark:text-sky-300",
    };
  }
  if (norm.includes("electr")) {
    return {
      icon: Zap,
      gradient: "from-amber-100/90 via-yellow-50/70 to-orange-50/30 dark:from-amber-950/40 dark:via-yellow-950/20 dark:to-orange-950/10",
      badgeClass: "bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
      iconBg: "bg-amber-200/80 text-amber-900 dark:bg-amber-900/60 dark:text-amber-300",
      iconColor: "text-amber-700 dark:text-amber-300",
    };
  }
  if (norm.includes("plumb")) {
    return {
      icon: Droplets,
      gradient: "from-cyan-100/90 via-teal-50/70 to-blue-50/30 dark:from-cyan-950/40 dark:via-teal-950/20 dark:to-blue-950/10",
      badgeClass: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/60",
      iconBg: "bg-cyan-200/80 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300",
      iconColor: "text-cyan-700 dark:text-cyan-300",
    };
  }
  if (norm.includes("paint") || norm.includes("carpent")) {
    return {
      icon: Paintbrush,
      gradient: "from-purple-100/90 via-violet-50/70 to-pink-50/30 dark:from-purple-950/40 dark:via-violet-950/20 dark:to-pink-950/10",
      badgeClass: "bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
      iconBg: "bg-purple-200/80 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300",
      iconColor: "text-purple-700 dark:text-purple-300",
    };
  }
  if (norm.includes("pest")) {
    return {
      icon: ShieldCheck,
      gradient: "from-lime-100/90 via-green-50/70 to-emerald-50/30 dark:from-lime-950/40 dark:via-green-950/20 dark:to-emerald-950/10",
      badgeClass: "bg-lime-100 text-lime-900 dark:bg-lime-950/70 dark:text-lime-300 border-lime-200 dark:border-lime-800/60",
      iconBg: "bg-lime-200/80 text-lime-900 dark:bg-lime-900/60 dark:text-lime-300",
      iconColor: "text-lime-700 dark:text-lime-300",
    };
  }
  if (norm.includes("beauty") || norm.includes("salon") || norm.includes("wellness")) {
    return {
      icon: Heart,
      gradient: "from-rose-100/90 via-pink-50/70 to-fuchsia-50/30 dark:from-rose-950/40 dark:via-pink-950/20 dark:to-fuchsia-950/10",
      badgeClass: "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800/60",
      iconBg: "bg-rose-200/80 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300",
      iconColor: "text-rose-700 dark:text-rose-300",
    };
  }

  return {
    icon: Wrench,
    gradient: "from-purple-100/70 via-indigo-50/50 to-pink-50/30 dark:from-purple-950/30 dark:to-indigo-950/20",
    badgeClass: "bg-secondary text-secondary-foreground border-border",
    iconBg: "bg-primary/15 text-primary",
    iconColor: "text-primary",
  };
}

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
}: ServiceCardProps) {
  const theme = getCategoryTheme(category);
  const IconComponent = theme.icon;

  const targetHref = id !== undefined ? `/services/${id}` : "/explore";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
      {/* Visual Header with Category Theme Gradient & Animated Hover */}
      <div
        className={cn(
          "relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden bg-gradient-to-br transition-all duration-300",
          theme.gradient
        )}
      >
        {/* Subtle Decorative Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:12px_12px]" />

        {/* Floating Top Category Badge */}
        {category && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md shadow-xs",
                theme.badgeClass
              )}
            >
              <IconComponent className="size-3" aria-hidden="true" />
              {category}
            </span>
          </div>
        )}

        {/* Floating Rating or Verified Tag */}
        <div className="absolute top-3 right-3 z-10">
          {rating !== undefined ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-background/85 px-2 py-0.5 text-xs font-semibold text-foreground backdrop-blur-md shadow-xs">
              <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden="true" />
              {rating.toFixed(1)}
              {reviewCount !== undefined && (
                <span className="text-[10px] text-muted-foreground">({reviewCount})</span>
              )}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground backdrop-blur-md shadow-xs">
              <BadgeCheck className="size-3 text-emerald-500" />
              Verified
            </span>
          )}
        </div>

        {/* Center Illuminated Icon Badge */}
        <div
          className={cn(
            "relative grid size-16 place-items-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2",
            theme.iconBg
          )}
        >
          <IconComponent className="size-8 transition-transform duration-300" strokeWidth={1.75} aria-hidden="true" />
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
