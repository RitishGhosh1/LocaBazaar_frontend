"use client";

import { AlertCircle, User } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/dashboard/dashboard-primitives";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";

export default function CustomerProfilePage() {
  const { resolvedRole, decodedToken } = useAuthStore();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile"
        description="Account details available from your current session."
      />

      <Card>
        <CardHeader>
          <CardTitle>Session information</CardTitle>
          <CardDescription>
            The API does not expose a profile or `/me` endpoint yet. Details below come from your JWT.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Identifier</p>
              <p className="mt-1 font-medium">{resolvedRole?.subject ?? "Unknown"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Role</p>
              <p className="mt-1 font-medium capitalize">{resolvedRole?.jwtRole ?? "customer"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Role source</p>
              <p className="mt-1 font-medium capitalize">{resolvedRole?.source ?? "unknown"}</p>
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

      <EmptyState
        icon={User}
        title="Profile editing unavailable"
        description="Customer profile update endpoints are not available in the current API."
      />

      <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="text-muted-foreground">
          Account deletion is supported via <code className="text-xs">DELETE /api/v1/customers/me</code> but
          is not exposed in this UI to prevent accidental data loss.
        </p>
      </div>
    </div>
  );
}
