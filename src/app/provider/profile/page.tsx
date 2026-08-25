"use client";

import { AlertTriangle, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState, PageHeader } from "@/components/dashboard/dashboard-primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeleteProviderAccount } from "@/hooks/use-providers";
import { getApiErrorMessage } from "@/lib/api-error";
import { useAuthStore } from "@/store/auth-store";

export default function ProviderProfilePage() {
  const router = useRouter();
  const { resolvedRole, user, logout } = useAuthStore();
  const deleteProviderMutation = useDeleteProviderAccount();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleDeleteAccount() {
    try {
      await deleteProviderMutation.mutateAsync();
      toast.success("Your provider account has been deactivated successfully.");
      logout();
      router.push("/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to deactivate provider account"));
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Provider profile"
        description="Account details and status for your provider account."
      />

      <Card>
        <CardHeader>
          <CardTitle>Provider Account Details</CardTitle>
          <CardDescription>
            Account information associated with your service provider profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-muted-foreground">Provider name</p>
            <p className="mt-1 font-medium">{user?.name ?? "Provider"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Identifier / Email</p>
            <p className="mt-1 font-medium">{resolvedRole?.subject ?? user?.email ?? "Unknown"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Account role</p>
            <p className="mt-1 font-medium capitalize">{resolvedRole?.jwtRole ?? user?.role ?? "provider"}</p>
          </div>
        </CardContent>
      </Card>

      <EmptyState
        icon={User}
        title="Profile editing unavailable"
        description="Direct profile editing endpoints are not configured. To change your listing or service details, manage them from your Services dashboard."
      />

      {/* Danger Zone: Provider Account Deactivation */}
      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanently deactivate your provider account and delist services.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Deactivating your provider account will disable your account and immediately hide all your services from customer search and explore pages.
          </p>

          {!showDeleteConfirm ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="mr-2 size-4" aria-hidden="true" />
              Deactivate my provider account
            </Button>
          ) : (
            <div className="space-y-3 rounded-lg border border-destructive/40 bg-background p-4">
              <p className="text-sm font-semibold text-destructive">
                Are you sure you want to deactivate your provider account?
              </p>
              <p className="text-xs text-muted-foreground">
                All your active service listings will be removed from search and explore immediately. You will be signed out.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={deleteProviderMutation.isPending}
                  onClick={handleDeleteAccount}
                >
                  {deleteProviderMutation.isPending ? "Deactivating…" : "Yes, deactivate my account"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={deleteProviderMutation.isPending}
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

