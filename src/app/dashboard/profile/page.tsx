"use client";

import { AlertCircle, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/dashboard-primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBecomeProvider } from "@/hooks/use-providers";
import { getApiErrorMessage } from "@/lib/api-error";
import { useAuthStore } from "@/store/auth-store";

export default function CustomerProfilePage() {
  const router = useRouter();
  const { resolvedRole, decodedToken, user, accessToken, setSession } = useAuthStore();
  const becomeProviderMutation = useBecomeProvider();

  async function handleBecomeProvider() {
    try {
      const updatedUser = await becomeProviderMutation.mutateAsync();
      if (accessToken) {
        setSession(accessToken, {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          is_superuser: false,
        });
      }
      toast.success("Congratulations! You are now a registered Provider.");
      router.push("/provider/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to upgrade to Provider account"));
    }
  }

  const isProvider = resolvedRole?.jwtRole === "provider" || user?.role === "provider";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile"
        description="Account details and membership options."
      />

      <Card>
        <CardHeader>
          <CardTitle>Session information</CardTitle>
          <CardDescription>
            Account details associated with your active session.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="mt-1 font-medium">{user?.name ?? "Customer User"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Identifier / Email</p>
              <p className="mt-1 font-medium">{resolvedRole?.subject ?? user?.email ?? "Unknown"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Role</p>
              <p className="mt-1 font-medium capitalize">{resolvedRole?.jwtRole ?? user?.role ?? "customer"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Session expires</p>
              <p className="mt-1 font-medium">
                {decodedToken?.expiresAt
                  ? new Date(decodedToken.expiresAt * 1000).toLocaleString()
                  : "Not available"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="size-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle>Become a Local Service Provider</CardTitle>
              <CardDescription>
                Offer your expertise, list services, and manage customer bookings on LocaBazaar.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isProvider ? (
            <p className="text-sm text-muted-foreground">
              You are already a registered Provider.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upgrade your current account role to <strong>Provider</strong> instantly with one click.
              </p>
              <Button
                type="button"
                disabled={becomeProviderMutation.isPending}
                onClick={handleBecomeProvider}
              >
                <Briefcase className="mr-2 size-4" aria-hidden="true" />
                {becomeProviderMutation.isPending ? "Upgrading account…" : "Become a Provider"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="text-muted-foreground">
          Account deactivation is supported via <code className="text-xs">DELETE /api/v1/customers/me</code>.
        </p>
      </div>
    </div>
  );
}

