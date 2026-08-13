"use client";

import { AlertCircle, User } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/dashboard/dashboard-primitives";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";

export default function ProviderProfilePage() {
  const { resolvedRole, decodedToken } = useAuthStore();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Provider profile"
        description="Session details for your provider account."
      />

      <Card>
        <CardHeader>
          <CardTitle>Session information</CardTitle>
          <CardDescription>
            Provider profile read/update endpoints are not available. Details come from your JWT.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-muted-foreground">Identifier</p>
            <p className="mt-1 font-medium">{resolvedRole?.subject ?? "Unknown"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Role</p>
            <p className="mt-1 font-medium capitalize">{resolvedRole?.jwtRole ?? "provider"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Session expires</p>
            <p className="mt-1 font-medium">
              {decodedToken?.expiresAt
                ? new Date(decodedToken.expiresAt * 1000).toLocaleString()
                : "Not available"}
            </p>
          </div>
        </CardContent>
      </Card>

      <EmptyState
        icon={User}
        title="Profile editing unavailable"
        description="The API supports provider deletion via DELETE /providers/me but not profile updates."
      />

      <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="text-muted-foreground">
          Public provider listings are available at <code className="text-xs">GET /api/v1/providers/</code>.
        </p>
      </div>
    </div>
  );
}
