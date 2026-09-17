"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  LoaderCircle,
  LogIn,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthApiError, verifyEmail } from "@/services/auth";

type VerificationStatus =
  | "loading"
  | "success"
  | "already_verified"
  | "invalid_or_expired"
  | "missing_token"
  | "error";

interface VerificationState {
  status: VerificationStatus;
  title: string;
  message: string;
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() || null;

  const [state, setState] = useState<VerificationState>(() => {
    if (!token) {
      return {
        status: "missing_token",
        title: "Invalid verification link.",
        message:
          "No verification token was found in the link. Please make sure to click the full link sent to your email address.",
      };
    }
    return {
      status: "loading",
      title: "Verifying your email...",
      message: "Please wait a moment while we verify your email address.",
    };
  });

  const requestedTokenRef = useRef<string | null>(null);

  const executeVerification = useCallback((tokenToVerify: string) => {
    verifyEmail(tokenToVerify)
      .then((res) => {
        const responseMsg = res.message || "";
        if (responseMsg.toLowerCase().includes("already verified")) {
          setState({
            status: "already_verified",
            title: responseMsg || "Email already verified",
            message: "Your email address has already been verified. You can proceed directly to sign in.",
          });
        } else {
          setState({
            status: "success",
            title: "Email verified successfully",
            message: responseMsg || "Your email address has been verified. You can now log in to your account.",
          });
        }
      })
      .catch((err: unknown) => {
        if (err instanceof AuthApiError) {
          if (
            err.status === 400 ||
            err.message.toLowerCase().includes("invalid") ||
            err.message.toLowerCase().includes("expired")
          ) {
            setState({
              status: "invalid_or_expired",
              title: "Verification link expired or invalid",
              message: "This verification link is invalid or has expired.",
            });
            return;
          }

          if (err.status === 404) {
            setState({
              status: "error",
              title: "User Not Found",
              message: "We could not find an account associated with this verification link.",
            });
            return;
          }

          setState({
            status: "error",
            title: "Verification Failed",
            message: err.message || "An error occurred while verifying your email.",
          });
        } else if (err instanceof Error) {
          setState({
            status: "error",
            title: "Verification Failed",
            message: err.message,
          });
        } else {
          setState({
            status: "error",
            title: "Verification Failed",
            message: "An unexpected error occurred. Please try again.",
          });
        }
      });
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    // Prevent duplicate API calls caused by React development behavior / Strict Mode
    if (requestedTokenRef.current === token) {
      return;
    }
    requestedTokenRef.current = token;

    executeVerification(token);
  }, [token, executeVerification]);

  const handleRetry = () => {
    if (!token) return;
    setState({
      status: "loading",
      title: "Verifying your email...",
      message: "Please wait a moment while we verify your email address.",
    });
    executeVerification(token);
  };

  return (
    <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm sm:p-8 text-center">
      {/* Status Icon */}
      <div className="mb-6 flex justify-center">
        {state.status === "loading" && (
          <div className="grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
            <LoaderCircle className="size-8 animate-spin" aria-hidden="true" />
          </div>
        )}

        {state.status === "success" && (
          <div className="grid size-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <CheckCircle2 className="size-8" aria-hidden="true" />
          </div>
        )}

        {state.status === "already_verified" && (
          <div className="grid size-16 place-items-center rounded-full bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <ShieldCheck className="size-8" aria-hidden="true" />
          </div>
        )}

        {state.status === "invalid_or_expired" && (
          <div className="grid size-16 place-items-center rounded-full bg-destructive/15 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <AlertCircle className="size-8" aria-hidden="true" />
          </div>
        )}

        {state.status === "missing_token" && (
          <div className="grid size-16 place-items-center rounded-full bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <AlertCircle className="size-8" aria-hidden="true" />
          </div>
        )}

        {state.status === "error" && (
          <div className="grid size-16 place-items-center rounded-full bg-destructive/15 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <AlertCircle className="size-8" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Header & Description */}
      <div className="mb-8 space-y-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {state.title}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {state.message}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {state.status === "loading" && (
          <Button disabled className="w-full">
            <LoaderCircle className="mr-2 size-4 animate-spin" />
            Verifying your email...
          </Button>
        )}

        {(state.status === "success" || state.status === "already_verified") && (
          <Link href="/login" className={cn(buttonVariants(), "w-full")}>
            <LogIn className="mr-2 size-4" />
            Go to Login
            <ArrowRight className="ml-2 size-4" />
          </Link>
        )}

        {(state.status === "invalid_or_expired" || state.status === "missing_token") && (
          <div className="space-y-3">
            <Link href="/login" className={cn(buttonVariants(), "w-full")}>
              <LogIn className="mr-2 size-4" />
              Go to Login
            </Link>
            <div className="pt-2 text-center text-xs text-muted-foreground">
              Need a new account?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Sign up here
              </Link>
            </div>
          </div>
        )}

        {state.status === "error" && (
          <div className="space-y-3">
            {token && (
              <Button onClick={handleRetry} variant="outline" className="w-full">
                <RotateCcw className="mr-2 size-4" />
                Try Again
              </Button>
            )}
            <Link href="/login" className={cn(buttonVariants(), "w-full")}>
              <LogIn className="mr-2 size-4" />
              Go to Login
            </Link>
          </div>
        )}
      </div>

      <div className="mt-6 border-t pt-4">
        <Link
          href="/"
          className="text-xs text-muted-foreground transition hover:text-foreground"
        >
          ← Return to LocaBazaar Home
        </Link>
      </div>
    </div>
  );
}

function VerifyEmailLoadingFallback() {
  return (
    <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm sm:p-8 text-center animate-pulse">
      <div className="mx-auto size-16 rounded-full bg-muted" />
      <div className="mx-auto mt-6 h-7 w-3/4 rounded bg-muted" />
      <div className="mx-auto mt-3 h-4 w-5/6 rounded bg-muted" />
      <div className="mx-auto mt-8 h-10 w-full rounded bg-muted" />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="grid min-h-screen bg-muted/30 lg:grid-cols-2">
      {/* Left hero branding section (desktop) */}
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-indigo-900 to-purple-950 p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 size-80 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative z-10 flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-white/15 text-white backdrop-blur-md">
            <Sparkles className="size-5" />
          </span>
          <p className="font-heading text-2xl font-bold tracking-tight text-white">LocaBazaar</p>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
            <span>✨ Verified Local Services Marketplace</span>
          </div>
          <h2 className="font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Account Verification
          </h2>
          <p className="text-base leading-relaxed text-white/80">
            Confirming your email address helps keep our local marketplace safe, trustworthy, and connected.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-6 text-xs text-white/70">
          <span>100% Verified Specialists</span>
          <span>•</span>
          <span>Instant Scheduling</span>
          <span>•</span>
          <span>Secure Platform</span>
        </div>
      </section>

      {/* Right verification status card */}
      <section className="flex items-center justify-center px-5 py-12 sm:px-8">
        <Suspense fallback={<VerifyEmailLoadingFallback />}>
          <VerifyEmailContent />
        </Suspense>
      </section>
    </main>
  );
}
