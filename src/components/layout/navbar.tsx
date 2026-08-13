"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { initialize, isAuthenticated, isInitializing, logout, resolvedRole } = useAuthStore();

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

  // Role-specific navigation links
  const appRole = resolvedRole?.appRole;

  const roleNavLinks = !isAuthenticated
    ? [
        { href: "/explore", label: "Explore" },
        { href: "/#how-it-works", label: "How it works" },
      ]
    : appRole === "superadmin"
    ? [
        { href: "/explore", label: "Explore" },
        { href: "/admin/dashboard", label: "Admin Dashboard" },
      ]
    : appRole === "provider"
    ? [
        { href: "/explore", label: "Explore" },
        { href: "/provider/dashboard", label: "Provider Dashboard" },
      ]
    : [
        { href: "/explore", label: "Explore" },
        { href: "/dashboard", label: "Dashboard" },
      ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Main navigation">
        <Link href="/" className="font-heading text-2xl font-bold tracking-tight text-primary hover:opacity-90 transition" onClick={closeMenu}>
          LocaBazaar
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-7 md:flex">
          {roleNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Action Buttons & Theme Toggle */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {!isInitializing && !isAuthenticated && (
            <>
              <Link href="/login" className="px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground">
                Login
              </Link>
              <Link href="/register" className={buttonVariants({ size: "sm" })}>
                Get Started
              </Link>
            </>
          )}

          {!isInitializing && isAuthenticated && (
            <Button size="sm" variant="outline" type="button" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle & Theme Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="grid size-10 place-items-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
        <div id="mobile-navigation" className="border-t bg-background px-5 py-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {roleNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}

            <div className="my-2 border-t" />

            {!isInitializing && !isAuthenticated && (
              <div className="flex flex-col gap-2">
                <Link href="/login" className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted" onClick={closeMenu}>
                  Login
                </Link>
                <Link href="/register" className={buttonVariants({ size: "sm" })} onClick={closeMenu}>
                  Get Started
                </Link>
              </div>
            )}

            {!isInitializing && isAuthenticated && (
              <Button className="mt-2" variant="outline" type="button" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


