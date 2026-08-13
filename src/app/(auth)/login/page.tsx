"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/services/api";
import { AuthApiError } from "@/services/auth";
import { getDefaultDashboardPath } from "@/lib/roles";
import { useAuthStore } from "@/store/auth-store";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function getLoginErrorMessage(error: unknown): string {
  if (error instanceof AuthApiError) {
    if (error.status === 401 || error.status === 403) return "Invalid email or password.";
    if (error.status === 422) return "Please check your information and try again.";
    if (error.status && error.status >= 500) return "The server is unavailable. Please try again shortly.";
    if (!error.status) return "Unable to connect to the server. Please try again.";
  }

  return "Unable to sign in. Please try again.";
}

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit({ email, password }: LoginFormValues) {
    try {
      await login(email, password);
      toast.success("Signed in successfully.");
      const role = useAuthStore.getState().resolvedRole;
      router.replace(role ? getDefaultDashboardPath(role.appRole) : "/dashboard");
    } catch (error) {
      toast.error(getLoginErrorMessage(error));
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
    <main className="grid min-h-screen bg-muted/40 lg:grid-cols-2">
      <section className="hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <p className="font-heading text-3xl font-semibold tracking-tight">LocaBazaar</p>
        <div className="max-w-md">
          <p className="font-heading text-5xl leading-tight">Trusted local services, thoughtfully connected.</p>
          <p className="mt-6 text-base leading-7 text-primary-foreground/75">Sign in to manage bookings and discover the people who keep your neighbourhood moving.</p>
        </div>
        <p className="text-sm text-primary-foreground/65">Local expertise. Better everyday services.</p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <p className="font-heading text-3xl font-semibold tracking-tight">Welcome back</p>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to continue to LocaBazaar.</p>
          </div>

          <form className="space-y-5" noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email address</label>
              <input id="email" type="email" autoComplete="email" className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30" aria-invalid={Boolean(form.formState.errors.email)} aria-describedby={form.formState.errors.email ? "email-error" : undefined} disabled={isSubmitting} {...form.register("email")} />
              {form.formState.errors.email && <p id="email-error" className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <div className="relative">
                <input id="password" type={isPasswordVisible ? "text" : "password"} autoComplete="current-password" className="h-11 w-full rounded-md border bg-background px-3 pr-11 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30" aria-invalid={Boolean(form.formState.errors.password)} aria-describedby={form.formState.errors.password ? "password-error" : undefined} disabled={isSubmitting} {...form.register("password")} />
                <button className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" type="button" onClick={() => setIsPasswordVisible((visible) => !visible)} aria-label={isPasswordVisible ? "Hide password" : "Show password"}>
                  {isPasswordVisible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                </button>
              </div>
              {form.formState.errors.password && <p id="password-error" className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <LogIn aria-hidden="true" />}
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">OR</div>
          <Button className="w-full" type="button" variant="outline" disabled={isSubmitting} onClick={continueWithGoogle}>Continue with Google</Button>
        </div>
      </section>
    </main>
  );
}
