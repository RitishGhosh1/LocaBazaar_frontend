import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-14 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && (
        <Link href={action.href} className={cn(buttonVariants({ size: "sm" }), "mt-6")}>
          {action.label}
        </Link>
      )}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className="grid size-10 place-items-center rounded-md bg-muted">
          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export function QuickActionCard({ href, label, description, icon: Icon }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group rounded-lg border bg-card p-5 shadow-sm transition hover:border-foreground/20 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary transition group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-4" aria-hidden="true" />
        </div>
        <div>
          <p className="font-medium">{label}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export function LoadingScreen({ message = "Loading…" }: { message?: string }) {
  return (
    <div className="grid min-h-[40vh] place-items-center text-sm text-muted-foreground">{message}</div>
  );
}

export function ErrorState({
  title,
  description,
  onRetry,
}: {
  title: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button className="mt-4" size="sm" variant="outline" type="button" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={cn("font-heading text-xl font-semibold tracking-tight", className)}>{children}</h2>;
}
