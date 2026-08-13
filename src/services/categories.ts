import type { components } from "@/types/api";

import api from "@/services/api";

export type Category = components["schemas"]["CategoryRead"];
export type CategoryCreate = components["schemas"]["CategoryCreate"];
export type CategoryWithServices = components["schemas"]["CategoryReadWithServices"];

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/categories/");
  return data;
}

export async function getCategory(categoryId: number): Promise<CategoryWithServices> {
  const { data } = await api.get<CategoryWithServices>(`/categories/${categoryId}`);
  return data;
}

export async function createCategory(payload: CategoryCreate): Promise<Category> {
  const { data } = await api.post<Category>("/categories/create", payload);
  return data;
}
