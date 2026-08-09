import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
}

export function CategoryCard({ name, description, icon: Icon }: CategoryCardProps) {
  return (
    <Link href="#featured-services" className="group block rounded-lg border bg-card p-5 transition hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span className="grid size-11 place-items-center rounded-md bg-secondary text-foreground transition group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-5 font-semibold tracking-tight">{name}</h3>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
    </Link>
  );
}
