"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getDefaultDashboardPath, resolveRoleFromToken } from "@/lib/roles";
import { useAuthStore } from "@/store/auth-store";

export default function AuthCallbackPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const errorParam = searchParams.get("error") || fragment.get("error");

    if (errorParam === "account_inactive" || errorParam === "inactive") {
      router.replace("/login?error=account_inactive");
      return;
    }

    const accessToken = fragment.get("access_token");
    const tokenType = fragment.get("token_type");

    if (!accessToken || !tokenType) {
      const animationFrameId = window.requestAnimationFrame(() => {
        setError("We could not complete Google sign-in. Redirecting you back to login.");
      });
      const timeoutId = window.setTimeout(() => router.replace("/login"), 2_000);
      return () => {
        window.cancelAnimationFrame(animationFrameId);
        window.clearTimeout(timeoutId);
      };
    }

    setSession(accessToken);
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);

    const role = resolveRoleFromToken(accessToken);
    router.replace(role ? getDefaultDashboardPath(role.appRole) : "/dashboard");
  }, [router, setSession]);

  return (
    <main className="grid min-h-screen place-items-center bg-muted/40 p-6">
      <section className="w-full max-w-sm rounded-lg border bg-card p-8 text-center shadow-sm" aria-live="polite">
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : (
          <>
            <LoaderCircle className="mx-auto size-6 animate-spin text-muted-foreground" aria-hidden="true" />
            <p className="mt-4 font-medium">Completing your sign-in…</p>
            <p className="mt-2 text-sm text-muted-foreground">Please wait a moment.</p>
          </>
        )}
      </section>
    </main>
  );
}
