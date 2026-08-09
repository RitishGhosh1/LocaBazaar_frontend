import { MapPin, Star, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  icon: Icon = Wrench,
  accentClassName = "bg-secondary text-foreground",
}: ServiceCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border bg-card transition hover:shadow-lg">
      <div className={`grid aspect-[16/10] place-items-center ${accentClassName}`}>
        <Icon className="size-12" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div className="p-5">
        {category && <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">{category}</p>}
        <h3 className="mt-2 text-lg font-semibold tracking-tight">{title}</h3>
        {description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{description}</p>}
        {provider && <p className="mt-2 text-sm text-muted-foreground">by {provider}</p>}
        {rating !== undefined && reviewCount !== undefined && <div className="mt-4 flex items-center gap-3 text-sm"><span className="inline-flex items-center gap-1 font-medium"><Star className="size-4 fill-amber-400 text-amber-400" aria-hidden="true" />{rating.toFixed(1)}</span><span className="text-muted-foreground">({reviewCount} reviews)</span></div>}
        {location && <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="size-4" aria-hidden="true" />{location}</p>}
        <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4">
          <p className="text-sm"><span className="font-semibold">₹{price.toLocaleString("en-IN")}</span> <span className="text-muted-foreground">onwards</span></p>
          {id !== undefined ? <Link href={`/services/${id}`} className={cn(buttonVariants({ size: "sm", variant: "outline" }))}>View service</Link> : <Button size="sm" variant="outline" type="button">View service</Button>}
        </div>
      </div>
    </article>
  );
}
