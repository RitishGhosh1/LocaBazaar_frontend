"use client";

import {
  Briefcase,
  CalendarDays,
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  Tags,
  User,
  UserCog,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { AppRole } from "@/lib/roles";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const iconMap = {
  LayoutDashboard,
  Compass,
  CalendarDays,
  User,
  Briefcase,
  Users,
  Tags,
  UserCog,
} as const;

export interface ShellNavItem {
  href: string;
  label: string;
  iconName: keyof typeof iconMap;
  exact?: boolean;
}

interface AppShellProps {
  children: React.ReactNode;
  navItems: readonly ShellNavItem[];
  roleLabel: string;
  requiredRole: AppRole;
}

export function AppShell({ children, navItems, roleLabel }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, resolvedRole } = useAuthStore();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const subject = resolvedRole?.subject ?? "Account";

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-6">
        <Link href="/" className="font-heading text-2xl font-semibold tracking-tight" onClick={() => setMobileOpen(false)}>
          LocaBazaar
        </Link>
        <p className="mt-1 text-xs tracking-widest text-muted-foreground uppercase">{roleLabel}</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = iconMap[item.iconName];
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3">
        <Separator className="mb-3" />
        <div className="rounded-md bg-muted/50 px-3 py-3">
          <p className="truncate text-sm font-medium">{subject}</p>
          <p className="text-xs text-muted-foreground">Signed in</p>
        </div>
        <Button className="mt-3 w-full" variant="outline" type="button" onClick={handleLogout}>
          <LogOut aria-hidden="true" />
          Log out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background px-4 lg:hidden">
        <Link href="/" className="font-heading text-xl font-semibold">
          LocaBazaar
        </Link>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-md hover:bg-muted"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu overlay"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-[min(18rem,85vw)] border-r bg-background shadow-xl">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="mx-auto flex min-h-screen max-w-[90rem]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-background lg:block">
          {sidebar}
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
