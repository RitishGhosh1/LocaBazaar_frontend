"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { becomeProvider } from "@/services/providers";
import { useAuthStore } from "@/store/auth-store";
import { getApiErrorMessage } from "@/lib/api-error";

export function Footer() {
  const router = useRouter();
  const { accessToken, setSession, isAuthenticated, user } = useAuthStore();

  async function handleBecomeProvider(e: React.MouseEvent) {
    e.preventDefault();

    if (!isAuthenticated) {
      router.push("/register");
      return;
    }

    if (user?.role === "provider") {
      router.push("/provider/dashboard");
      return;
    }

    try {
      const updatedUser = await becomeProvider();
      if (accessToken) {
        setSession(accessToken, { ...updatedUser, is_superuser: Boolean(user?.is_superuser) });
      }
      toast.success("Congratulations! Your account has been upgraded to Provider.");
      router.push("/provider/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to upgrade account to Provider."));
    }
  }

  return (
    <footer className="border-t bg-secondary/30">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[1.35fr_3fr]">
        <div>
          <Link href="/" className="font-heading text-2xl font-bold tracking-tight text-primary">
            LocaBazaar
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
            A thoughtful local services marketplace connecting nearby experts with community needs.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-foreground">For Providers</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={handleBecomeProvider}
                  className="text-muted-foreground transition hover:text-primary text-left font-medium cursor-pointer"
                >
                  Become a provider
                </button>
              </li>
              <li>
                <Link href="/explore" className="text-muted-foreground transition hover:text-foreground">
                  Explore directory
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-wide text-foreground">Company</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><span>About LocaBazaar</span></li>
              <li><span>Contact Support</span></li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-wide text-foreground">Legal</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><span>Privacy Policy</span></li>
              <li><span>Terms of Service</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-4 text-xs text-muted-foreground sm:px-8">
          © 2026 LocaBazaar. Built for better local living.
        </div>
      </div>
    </footer>
  );
}
