"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
  const router = useRouter();
  const { initialize, isAuthenticated, isInitializing, logout } = useAuthStore();

  useEffect(() => {
    void initialize();
  }, [initialize]);

  useEffect(() => {
    // The JWT is client-side persisted, so middleware cannot read it safely.
    if (!isInitializing && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isInitializing, router]);

  if (isInitializing || !isAuthenticated) {
    return <main className="grid min-h-screen place-items-center text-sm text-muted-foreground">Checking your session…</main>;
  }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 p-6">
      <section className="w-full max-w-lg rounded-lg border bg-card p-8 shadow-sm">
        <p className="font-heading text-3xl font-semibold">LocaBazaar</p>
        <p className="mt-6 text-lg font-medium">Authentication successful</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Your session is active. User details are not included in the current login response.</p>
        <div className="mt-6 rounded-md bg-muted p-4 text-sm"><span className="font-medium">Authenticated state:</span> active</div>
        <Button className="mt-8" type="button" variant="outline" onClick={handleLogout}><LogOut aria-hidden="true" />Log out</Button>
      </section>
    </main>
  );
}
