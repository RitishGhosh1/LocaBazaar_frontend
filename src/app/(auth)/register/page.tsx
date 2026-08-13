"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Eye, EyeOff, LoaderCircle, User, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/services/api";
import { createCustomer } from "@/services/customers";
import { createProvider } from "@/services/providers";
import { getApiErrorMessage } from "@/lib/api-error";
import { getDefaultDashboardPath } from "@/lib/roles";
import { useAuthStore } from "@/store/auth-store";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialAccountType = searchParams.get("role") === "provider" ? "provider" : "customer";

  const [accountType, setAccountType] = useState<"customer" | "provider">(initialAccountType);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const login = useAuthStore((state) => state.login);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", phone: "", bio: "" },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        phone: values.phone?.trim() || null,
        bio: values.bio?.trim() || null,
      };

      if (accountType === "provider") {
        await createProvider(payload);
        toast.success("Provider account created successfully!");
      } else {
        await createCustomer(payload);
        toast.success("Customer account registered successfully!");
      }

      // Seamless login flow right after registration
      await login(values.email.trim(), values.password);
      const role = useAuthStore.getState().resolvedRole;
      router.replace(role ? getDefaultDashboardPath(role.appRole) : accountType === "provider" ? "/provider/dashboard" : "/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Registration failed. Please try again."));
    }
  }

  function continueWithGoogle() {
    if (!API_BASE_URL) {
      toast.error("Google sign-in is unavailable because the API URL is not configured.");
      return;
    }
    window.location.replace(`${API_BASE_URL}/auth/login/google`);
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <p className="font-heading text-3xl font-bold tracking-tight">Get started</p>
        <p className="mt-1.5 text-sm text-muted-foreground">Choose your account type to register on LocaBazaar.</p>
      </div>

      {/* Account Type Selector */}
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg border bg-muted/50 p-1">
        <button
          type="button"
          onClick={() => setAccountType("customer")}
          className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition ${
            accountType === "customer"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="size-4" />
          Customer
        </button>
        <button
          type="button"
          onClick={() => setAccountType("provider")}
          className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition ${
            accountType === "provider"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Briefcase className="size-4" />
          Service Provider
        </button>
      </div>

      <form className="space-y-4" noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            aria-invalid={Boolean(form.formState.errors.name)}
            disabled={isSubmitting}
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            aria-invalid={Boolean(form.formState.errors.email)}
            disabled={isSubmitting}
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="password">Password</label>
          <div className="relative">
            <input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              autoComplete="new-password"
              className="h-11 w-full rounded-md border bg-background px-3 pr-11 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              aria-invalid={Boolean(form.formState.errors.password)}
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
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="phone">Phone number (optional)</label>
          <input
            id="phone"
            type="tel"
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            disabled={isSubmitting}
            {...form.register("phone")}
          />
        </div>

        {accountType === "provider" && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="bio">Professional Bio / Business Description (optional)</label>
            <textarea
              id="bio"
              rows={3}
              placeholder="Tell customers about your services, skills, or business..."
              className="w-full rounded-md border bg-background p-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              disabled={isSubmitting}
              {...form.register("bio")}
            />
          </div>
        )}

        <Button className="w-full mt-2" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <LoaderCircle className="animate-spin" aria-hidden="true" />
          ) : (
            <UserPlus aria-hidden="true" />
          )}
          {isSubmitting
            ? "Creating account…"
            : accountType === "provider"
            ? "Register as Provider"
            : "Create account"}
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
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen bg-muted/40 lg:grid-cols-2">
      <section className="hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <p className="font-heading text-3xl font-bold tracking-tight">LocaBazaar</p>
        <div className="max-w-md">
          <p className="font-heading text-5xl leading-tight">Join our hyperlocal marketplace.</p>
          <p className="mt-6 text-base leading-7 text-primary-foreground/75">
            Create an account to book trusted local service providers or list your own professional services effortlessly.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/65">Local expertise. Better everyday services.</p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-8">
        <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-lg bg-card" />}>
          <RegisterForm />
        </Suspense>
      </section>
    </main>
  );
}
