"use client";

import { LogOut, MapPin, Menu, ShieldCheck, Sparkles, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { initialize, isAuthenticated, isInitializing, logout, resolvedRole, user } = useAuthStore();

  useEffect(() => {
    void initialize();
  }, [initialize]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
    router.replace("/");
  }

  const appRole = resolvedRole?.appRole;

  const roleNavLinks = !isAuthenticated
    ? [
        { href: "/explore", label: "Explore Services" },
        { href: "/#categories", label: "Categories" },
        { href: "/#how-it-works", label: "How It Works" },
      ]
    : appRole === "superadmin"
    ? [
        { href: "/explore", label: "Explore Catalog" },
        { href: "/admin/dashboard", label: "Admin Console" },
      ]
    : appRole === "provider"
    ? [
        { href: "/explore", label: "Explore Catalog" },
        { href: "/provider/dashboard", label: "Provider Hub" },
      ]
    : [
        { href: "/explore", label: "Explore Services" },
        { href: "/dashboard", label: "My Bookings" },
      ];

  const roleBadgeLabel =
    appRole === "superadmin"
      ? "Superadmin"
      : appRole === "provider"
      ? "Provider"
      : "Customer";

  const roleBadgeClass =
    appRole === "superadmin"
      ? "bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60"
      : appRole === "provider"
      ? "bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800/60"
      : "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60";

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Main navigation">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition"
          onClick={closeMenu}
        >
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <Sparkles className="size-5" />
          </span>
          <span className="font-heading text-xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">
            Loca<span className="text-primary">Bazaar</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 md:flex">
          {roleNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-secondary text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop User Status & Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {!isInitializing && !isAuthenticated && (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-3.5 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground hover:bg-muted/40"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "sm" }), "rounded-xl font-semibold shadow-xs")}
              >
                Get Started
              </Link>
            </div>
          )}

          {!isInitializing && isAuthenticated && (
            <div className="flex items-center gap-3">
              {/* User Chip */}
              <div className="flex items-center gap-2 rounded-full border border-border/80 bg-secondary/50 py-1 pl-2.5 pr-3 text-xs">
                <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
                <span className="font-medium text-foreground max-w-[120px] truncate">
                  {user?.name || user?.email}
                </span>
                <span className={cn("rounded-full border px-2 py-0.2 text-[10px] font-bold", roleBadgeClass)}>
                  {roleBadgeLabel}
                </span>
              </div>

              <Button
                size="sm"
                variant="ghost"
                type="button"
                className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="size-4 mr-1" />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="grid size-10 place-items-center rounded-xl border border-border hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div id="mobile-navigation" className="border-t border-border/60 bg-background/95 backdrop-blur-md px-5 py-5 md:hidden space-y-4">
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 rounded-2xl border bg-secondary/40 p-3">
              <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-base font-bold text-primary">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">{user.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <span className={cn("mt-1 inline-block rounded-full border px-2 py-0.2 text-[10px] font-bold", roleBadgeClass)}>
                  {roleBadgeLabel}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            {roleNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-muted"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t pt-4">
            {!isInitializing && !isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-xl font-semibold")}
                  onClick={closeMenu}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className={cn(buttonVariants(), "w-full rounded-xl font-semibold")}
                  onClick={closeMenu}
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <Button
                variant="destructive"
                className="w-full rounded-xl font-semibold"
                onClick={handleLogout}
              >
                <LogOut className="size-4 mr-2" />
                Sign Out
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
