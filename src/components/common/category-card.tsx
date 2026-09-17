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

function resolveIcon(name: string, fallback?: LucideIcon): { icon: LucideIcon; colorClass: string } {
  if (fallback) return { icon: fallback, colorClass: "text-primary bg-primary/10 border-primary/20" };
  const norm = name.toLowerCase();
  if (norm.includes("clean")) return { icon: Sparkles, colorClass: "text-emerald-800 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60" };
  if (norm.includes("tech") || norm.includes("computer")) return { icon: Laptop, colorClass: "text-indigo-800 dark:text-indigo-300 bg-indigo-100/90 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/60" };
  if (norm.includes("appliance") || norm.includes("repair")) return { icon: Wrench, colorClass: "text-sky-800 dark:text-sky-300 bg-sky-100/90 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800/60" };
  if (norm.includes("electr")) return { icon: Zap, colorClass: "text-amber-900 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60" };
  if (norm.includes("plumb")) return { icon: Droplets, colorClass: "text-cyan-800 dark:text-cyan-300 bg-cyan-100/90 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800/60" };
  if (norm.includes("paint") || norm.includes("carpent")) return { icon: Paintbrush, colorClass: "text-purple-800 dark:text-purple-300 bg-purple-100/90 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/60" };
  if (norm.includes("pest")) return { icon: ShieldCheck, colorClass: "text-lime-900 dark:text-lime-300 bg-lime-100/90 dark:bg-lime-950/60 border-lime-200 dark:border-lime-800/60" };
  if (norm.includes("beauty") || norm.includes("salon") || norm.includes("wellness")) return { icon: Heart, colorClass: "text-rose-800 dark:text-rose-300 bg-rose-100/90 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/60" };
  return { icon: Wrench, colorClass: "text-primary bg-primary/10 border-primary/20" };
}

export function CategoryCard({ id, name, description, icon, href }: CategoryCardProps) {
  const targetHref = href || (id !== undefined ? `/explore?category_id=${id}` : "#featured-services");
  const { icon: ResolvedIcon, colorClass } = resolveIcon(name, icon);

  return (
    <Link
      href={targetHref}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div>
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "grid size-12 place-items-center rounded-xl border transition-transform duration-300 group-hover:scale-110",
              colorClass
            )}
          >
            <ResolvedIcon className="size-6" aria-hidden="true" />
          </span>

          <span className="grid size-7 place-items-center rounded-full bg-secondary text-muted-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5">
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>

        <h3 className="mt-4 font-heading text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {name}
        </h3>
        <p className="mt-2 text-xs leading-5 text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-primary">
        <span>Explore services</span>
        <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
