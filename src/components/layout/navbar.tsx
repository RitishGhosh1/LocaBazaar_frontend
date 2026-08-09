"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#for-providers", label: "Become a provider" },
];

export function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { initialize, isAuthenticated, isInitializing, logout } = useAuthStore();

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

  const accountLinks = isAuthenticated
    ? [{ href: "/dashboard", label: "Dashboard" }]
    : [
        { href: "/login", label: "Login" },
        { href: "/login", label: "Get Started" },
      ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Main navigation">
        <Link href="/" className="font-heading text-2xl font-semibold tracking-tight" onClick={closeMenu}>LocaBazaar</Link>
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition hover:text-foreground">{link.label}</Link>)}
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {!isInitializing && accountLinks.map((link, index) => (
            <Link key={link.label} href={link.href} className={cn(index === accountLinks.length - 1 && !isAuthenticated ? buttonVariants({ size: "sm" }) : "px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground")}>{link.label}</Link>
          ))}
          {!isInitializing && isAuthenticated && <Button size="sm" variant="outline" type="button" onClick={handleLogout}>Logout</Button>}
        </div>
        <button className="grid size-10 place-items-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden" type="button" aria-expanded={isMenuOpen} aria-controls="mobile-navigation" aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"} onClick={() => setIsMenuOpen((open) => !open)}>
          {isMenuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </nav>
      {isMenuOpen && (
        <div id="mobile-navigation" className="border-t bg-background px-5 py-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => <Link key={link.href} href={link.href} className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted" onClick={closeMenu}>{link.label}</Link>)}
            <div className="my-2 border-t" />
            {!isInitializing && accountLinks.map((link) => <Link key={link.label} href={link.href} className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted" onClick={closeMenu}>{link.label}</Link>)}
            {!isInitializing && isAuthenticated && <Button className="mt-2" variant="outline" type="button" onClick={handleLogout}>Logout</Button>}
          </div>
        </div>
      )}
    </header>
  );
}
