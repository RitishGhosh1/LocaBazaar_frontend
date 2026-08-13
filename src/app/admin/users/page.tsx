"use client";

import { UserCog } from "lucide-react";
import { toast } from "sonner";

import {
  EmptyState,
  ErrorState,
  LoadingScreen,
  PageHeader,
} from "@/components/dashboard/dashboard-primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminUsers, useDeactivateUser, useDeleteUser } from "@/hooks/use-admin";
import { getApiErrorMessage } from "@/lib/api-error";
import { useAuthStore } from "@/store/auth-store";

export default function AdminUsersPage() {
  const currentUser = useAuthStore((state) => state.user);
  const usersQuery = useAdminUsers();
  const deactivateMutation = useDeactivateUser();
  const deleteMutation = useDeleteUser();

  const users = usersQuery.data ?? [];

  async function handleDeactivate(userId: number, name: string) {
    if (!window.confirm(`Deactivate account for "${name}" (ID #${userId})?`)) {
      return;
    }

    try {
      await deactivateMutation.mutateAsync(userId);
      toast.success(`User "${name}" deactivated`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to deactivate user"));
    }
  }

  async function handleDelete(userId: number, name: string) {
    if (
      !window.confirm(
        `PERMANENTLY DELETE user "${name}" (ID #${userId})? This will erase all user records and cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(userId);
      toast.success(`User "${name}" permanently deleted`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete user"));
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="User management"
        description="All registered platform accounts. Review users, suspend active accounts, or permanently delete deactivated accounts."
      />

      {usersQuery.isLoading ? (
        <LoadingScreen message="Loading platform users…" />
      ) : usersQuery.isError ? (
        <ErrorState
          title="Unable to load users"
          description="Superuser authorization is required to list platform users."
          onRetry={() => usersQuery.refetch()}
        />
      ) : users.length === 0 ? (
        <EmptyState
          icon={UserCog}
          title="No users found"
          description="Registered user accounts will appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-left text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelf = currentUser?.id === user.id;
                  const isSuperuser = (user as { is_superuser?: boolean }).is_superuser === true;

                  return (
                    <tr key={user.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">#{user.id}</td>
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          <span>{user.name}</span>
                          {isSuperuser && (
                            <Badge variant="default" className="text-[10px] uppercase">
                              Admin
                            </Badge>
                          )}
                          {isSelf && (
                            <span className="text-xs text-muted-foreground font-normal">(You)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3 capitalize">{user.role}</td>
                      <td className="px-4 py-3">
                        <Badge variant={user.is_active ? "success" : "muted"}>
                          {user.is_active ? "Active" : "Suspended"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            type="button"
                            disabled={
                              deactivateMutation.isPending || !user.is_active || isSuperuser || isSelf
                            }
                            onClick={() => handleDeactivate(user.id, user.name)}
                          >
                            Deactivate
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            type="button"
                            disabled={
                              deleteMutation.isPending || user.is_active || isSuperuser || isSelf
                            }
                            onClick={() => handleDelete(user.id, user.name)}
                          >
                            Hard delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
