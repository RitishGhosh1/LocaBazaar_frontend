"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserCog } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PageHeader } from "@/components/dashboard/dashboard-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeactivateUser, useDeleteUser } from "@/hooks/use-admin";
import { getApiErrorMessage } from "@/lib/api-error";

const userIdSchema = z.object({
  userId: z.coerce.number().int().positive("Enter a valid user ID"),
});

type UserIdFormValues = z.infer<typeof userIdSchema>;

export default function AdminUsersPage() {
  const deactivateMutation = useDeactivateUser();
  const deleteMutation = useDeleteUser();

  const form = useForm<UserIdFormValues>({
    resolver: zodResolver(userIdSchema),
    defaultValues: { userId: 0 },
  });

  async function handleDeactivate(values: UserIdFormValues) {
    try {
      await deactivateMutation.mutateAsync(values.userId);
      toast.success(`User #${values.userId} deactivated`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to deactivate user"));
    }
  }

  async function handleDelete(values: UserIdFormValues) {
    if (!window.confirm(`Permanently delete user #${values.userId}? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(values.userId);
      toast.success(`User #${values.userId} deleted`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete user"));
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="User management"
        description="Admin actions by user ID. A list-users endpoint is not available in the current API."
      />

      <div className="flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
        <UserCog className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="text-muted-foreground">
          Available endpoints:{" "}
          <code className="text-xs">PATCH /admin/users/{"{id}"}/deactivate</code> and{" "}
          <code className="text-xs">DELETE /admin/users/{"{id}"}</code>. No user listing or search exists.
        </p>
      </div>

      <form className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="userId">User ID</Label>
          <Input
            id="userId"
            type="number"
            min={1}
            {...form.register("userId")}
            aria-invalid={Boolean(form.formState.errors.userId)}
          />
          {form.formState.errors.userId && (
            <p className="text-sm text-destructive">{form.formState.errors.userId.message}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={deactivateMutation.isPending}
            onClick={form.handleSubmit(handleDeactivate)}
          >
            {deactivateMutation.isPending ? "Deactivating…" : "Deactivate user"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={form.handleSubmit(handleDelete)}
          >
            {deleteMutation.isPending ? "Deleting…" : "Hard delete user"}
          </Button>
        </div>
      </form>
    </div>
  );
}
