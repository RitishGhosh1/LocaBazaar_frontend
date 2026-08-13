import api from "@/services/api";

/** Shape is not defined in OpenAPI; treat as a loose record. */
export type PlatformStats = Record<string, number | string | null | undefined>;

export async function getPlatformStats(): Promise<PlatformStats> {
  const { data } = await api.get<PlatformStats>("/admin/dashboard/stats");
  return data;
}

export async function deactivateUser(userId: number): Promise<unknown> {
  const { data } = await api.patch(`/admin/users/${userId}/deactivate`);
  return data;
}

export async function deleteUser(userId: number): Promise<unknown> {
  const { data } = await api.delete(`/admin/users/${userId}`);
  return data;
}

export async function suspendService(serviceId: number): Promise<unknown> {
  const { data } = await api.patch(`/admin/services/${serviceId}/suspend`);
  return data;
}
