"use client";

import { AlertTriangle, Briefcase, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/dashboard-primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeleteCustomerAccount } from "@/hooks/use-customers";
import { useBecomeProvider } from "@/hooks/use-providers";
import { getApiErrorMessage } from "@/lib/api-error";
import { useAuthStore } from "@/store/auth-store";

export default function CustomerProfilePage() {
  const router = useRouter();
  const { resolvedRole, user, accessToken, setSession, logout } = useAuthStore();
  const becomeProviderMutation = useBecomeProvider();
  const deleteCustomerMutation = useDeleteCustomerAccount();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  async function handleDeleteAccount() {
    try {
      await deleteCustomerMutation.mutateAsync();
      toast.success("Your account has been deactivated successfully.");
      logout();
      router.push("/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to deactivate account"));
    }
  }

  const isProvider = resolvedRole?.jwtRole === "provider" || user?.role === "provider";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile"
        description="Account details and settings."
      />

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>
            Personal information associated with your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-muted-foreground">Full name</p>
              <p className="mt-1 font-medium">{user?.name ?? "Customer User"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email address</p>
              <p className="mt-1 font-medium">{resolvedRole?.subject ?? user?.email ?? "Unknown"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Account role</p>
              <p className="mt-1 font-medium capitalize">{resolvedRole?.jwtRole ?? user?.role ?? "customer"}</p>
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

      {/* Danger Zone: Account Deactivation */}
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanently deactivate your customer account and access.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Deactivating your account will prevent you from signing in, hide your profile, and cancel any pending booking requests.
          </p>

          {!showDeleteConfirm ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="mr-2 size-4" aria-hidden="true" />
              Deactivate my account
            </Button>
          ) : (
            <div className="space-y-3 rounded-lg border border-destructive/40 bg-background p-4">
              <p className="text-sm font-semibold text-destructive">
                Are you sure you want to deactivate your account?
              </p>
              <p className="text-xs text-muted-foreground">
                This action is immediate. You will be signed out and unable to log in until reactivated by an administrator.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={deleteCustomerMutation.isPending}
                  onClick={handleDeleteAccount}
                >
                  {deleteCustomerMutation.isPending ? "Deactivating…" : "Yes, deactivate my account"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={deleteCustomerMutation.isPending}
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


