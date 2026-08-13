import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { createCategory, getCategories, getCategory } from "@/services/categories";

export const categoryQueryKeys = {
  all: ["categories"] as const,
  list: () => [...categoryQueryKeys.all, "list"] as const,
  detail: (id: number) => [...categoryQueryKeys.all, "detail", id] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryQueryKeys.list(),
    queryFn: getCategories,
    staleTime: 5 * 60_000,
  });
}

export function useCategory(categoryId: number) {
  return useQuery({
    queryKey: categoryQueryKeys.detail(categoryId),
    queryFn: () => getCategory(categoryId),
    enabled: categoryId > 0,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: categoryQueryKeys.all });
    },
  });
}
