"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Eye,
  EyeOff,
  LoaderCircle,
  LogIn,
  Mail,
  ShieldAlert,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/services/api";
import { AuthApiError } from "@/services/auth";
import { getDefaultDashboardPath } from "@/lib/roles";
import { useAuthStore } from "@/store/auth-store";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface FormFeedback {
  type: "inactive" | "credentials" | "server" | "network" | "general";
  title: string;
  message: string;
  action?: {
    label: string;
    href: string;
  };
}

function parseAuthError(error: unknown): FormFeedback {
  if (error instanceof AuthApiError) {
    const errorMsg = (error.message || "").toLowerCase();

    // Inactive or Deactivated account check (HTTP 403 or specific message)
    if (
      error.status === 403 ||
      errorMsg.includes("not active") ||
      errorMsg.includes("inactive") ||
      errorMsg.includes("deactivated") ||
      errorMsg.includes("suspended")
    ) {
      return {
        type: "inactive",
        title: "Account Deactivated",
        message:
          "Your LocaBazaar account is currently deactivated or suspended. You cannot sign in at this time. If you believe this is an error or would like to request reactivation, please reach out to our support team.",
        action: {
          label: "Contact Support",
          href: "mailto:support@locabazaar.com?subject=LocaBazaar%20Account%20Reactivation%20Request",
        },
      };
    }

    // Invalid credentials (HTTP 400 or 401)
    if (error.status === 400 || error.status === 401) {
      return {
        type: "credentials",
        title: "Incorrect Email or Password",
        message:
          "The email address or password you entered does not match our records. Please double-check your credentials and try again.",
      };
    }

    // Validation error
    if (error.status === 422) {
      return {
        type: "general",
        title: "Invalid Information",
        message: "Please ensure your email and password are provided in a valid format.",
      };
    }

    // Server error
    if (error.status && error.status >= 500) {
      return {
        type: "server",
        title: "Server Temporarily Unavailable",
        message:
          "Our authentication service is experiencing temporary issues. Please try again in a few moments.",
      };
    }

    // Network error
    if (!error.status) {
      return {
        type: "network",
        title: "Network Connection Error",
        message:
          "Unable to connect to the LocaBazaar server. Please verify your internet connection and try again.",
      };
    }
  }

  return {
    type: "general",
    title: "Sign-in Failed",
    message: error instanceof Error ? error.message : "Unable to sign in. Please try again.",
  };
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Check URL query parameters on initial mount (e.g. redirected from Google OAuth or session expiry)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "account_inactive" || errorParam === "inactive") {
      setFeedback({
        type: "inactive",
        title: "Account Deactivated",
        message:
          "Your LocaBazaar account is currently deactivated or suspended. You cannot sign in at this time. If you believe this is an error or would like to request reactivation, please reach out to our support team.",
        action: {
          label: "Contact Support",
          href: "mailto:support@locabazaar.com?subject=LocaBazaar%20Account%20Reactivation%20Request",
        },
      });
    }
  }, [searchParams]);

  async function onSubmit({ email, password }: LoginFormValues) {
    setFeedback(null);
    try {
      await login(email, password);
      toast.success("Signed in successfully.");
      const role = useAuthStore.getState().resolvedRole;
      router.replace(role ? getDefaultDashboardPath(role.appRole) : "/dashboard");
    } catch (error) {
      const parsed = parseAuthError(error);
      setFeedback(parsed);
    }
  }

  function continueWithGoogle() {
    setFeedback(null);
    if (!API_BASE_URL) {
      setFeedback({
        type: "server",
        title: "Configuration Error",
        message: "Google sign-in is currently unavailable because the API URL is not configured.",
      });
      return;
    }

    window.location.replace(`${API_BASE_URL}/auth/login/google`);
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <p className="font-heading text-3xl font-semibold tracking-tight">Welcome back</p>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to continue to LocaBazaar.</p>
      </div>

      {/* Prominent In-UI Feedback Alert for Inactive Accounts / Errors */}
      {feedback && (
        <div
          role="alert"
          aria-live="assertive"
          className={`mb-6 rounded-lg border p-4 transition-all duration-200 ${
            feedback.type === "inactive"
              ? "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-200"
              : "border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/40 dark:bg-destructive/15"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`grid size-9 shrink-0 place-items-center rounded-full ${
                feedback.type === "inactive"
                  ? "bg-amber-500/20 text-amber-600 dark:bg-amber-500/30 dark:text-amber-300"
                  : "bg-destructive/20 text-destructive"
              }`}
            >
              {feedback.type === "inactive" ? (
                <ShieldAlert className="size-5" aria-hidden="true" />
              ) : (
                <AlertCircle className="size-5" aria-hidden="true" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold leading-tight">{feedback.title}</p>
                <button
                  type="button"
                  onClick={() => setFeedback(null)}
                  className="rounded p-0.5 text-muted-foreground transition hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
                  aria-label="Dismiss message"
                >
                  <X className="size-4" />
                </button>
              </div>

              <p
                className={`text-xs leading-relaxed ${
                  feedback.type === "inactive"
                    ? "text-amber-900/90 dark:text-amber-200/90"
                    : "opacity-90"
                }`}
              >
                {feedback.message}
              </p>

              {feedback.action && (
                <div className="pt-2">
                  <a
                    href={feedback.action.href}
                    className="inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-amber-700 dark:bg-amber-500 dark:text-amber-950 dark:hover:bg-amber-400"
                  >
                    <Mail className="size-3.5" aria-hidden="true" />
                    {feedback.action.label}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <form className="space-y-5" noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            aria-invalid={Boolean(form.formState.errors.email)}
            aria-describedby={form.formState.errors.email ? "email-error" : undefined}
            disabled={isSubmitting}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p id="email-error" className="text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              autoComplete="current-password"
              className="h-11 w-full rounded-md border bg-background px-3 pr-11 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              aria-invalid={Boolean(form.formState.errors.password)}
              aria-describedby={form.formState.errors.password ? "password-error" : undefined}
              disabled={isSubmitting}
              {...form.register("password")}
            />
            <button
              className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              type="button"
              onClick={() => setIsPasswordVisible((visible) => !visible)}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            >
              {isPasswordVisible ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {form.formState.errors.password && (
            <p id="password-error" className="text-sm text-destructive">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          ) : (
            <LogIn aria-hidden="true" />
          )}
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
        OR
      </div>

      <Button
        className="w-full"
        type="button"
        variant="outline"
        disabled={isSubmitting}
        onClick={continueWithGoogle}
      >
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-muted/40 lg:grid-cols-2">
      <section className="hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <p className="font-heading text-3xl font-semibold tracking-tight">LocaBazaar</p>
        <div className="max-w-md">
          <p className="font-heading text-5xl leading-tight">
            Trusted local services, thoughtfully connected.
          </p>
          <p className="mt-6 text-base leading-7 text-primary-foreground/75">
            Sign in to manage bookings and discover the people who keep your neighbourhood moving.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/65">
          Local expertise. Better everyday services.
        </p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-8">
        <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-lg bg-card" />}>
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
