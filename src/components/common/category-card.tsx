"use client";

import {
  ArrowRight,
  Droplets,
  Heart,
  Laptop,
  Paintbrush,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface CategoryCardProps {
  id?: number;
  name: string;
  description: string;
  icon?: LucideIcon;
  href?: string;
}

function resolveIcon(name: string, fallback?: LucideIcon): LucideIcon {
  if (fallback) return fallback;
  const norm = name.toLowerCase();
  if (norm.includes("clean")) return Sparkles;
  if (norm.includes("tech") || norm.includes("computer")) return Laptop;
  if (norm.includes("appliance") || norm.includes("repair")) return Wrench;
  if (norm.includes("electr")) return Zap;
  if (norm.includes("plumb")) return Droplets;
  if (norm.includes("paint") || norm.includes("carpent")) return Paintbrush;
  if (norm.includes("pest")) return ShieldCheck;
  if (norm.includes("beauty") || norm.includes("salon") || norm.includes("wellness")) return Heart;
  return Wrench;
}

export function CategoryCard({ id, name, description, icon, href }: CategoryCardProps) {
  const targetHref = href || (id !== undefined ? `/explore?category_id=${id}` : "#featured-services");
  const ResolvedIcon = resolveIcon(name, icon);

  return (
    <Link
      href={targetHref}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/80 bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="grid size-11 place-items-center rounded-lg border border-primary/15 bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
            <ResolvedIcon className="size-5" aria-hidden="true" />
          </span>

          <span className="grid size-7 place-items-center rounded-full bg-secondary text-muted-foreground opacity-60 transition-all duration-200 group-hover:opacity-100 group-hover:bg-primary/10 group-hover:text-primary group-hover:translate-x-0.5">
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>

        <h3 className="mt-4 font-heading text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {name}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary pt-3 border-t border-border/40">
        <span>Explore services</span>
        <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
