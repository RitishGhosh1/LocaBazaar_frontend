"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Tags } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  EmptyState,
  ErrorState,
  LoadingScreen,
  PageHeader,
} from "@/components/dashboard/dashboard-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCategories, useCreateCategory } from "@/hooks/use-categories";
import { getApiErrorMessage } from "@/lib/api-error";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const categoriesQuery = useCategories();
  const createMutation = useCreateCategory();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "" },
  });

  async function onSubmit(values: CategoryFormValues) {
    try {
      await createMutation.mutateAsync({
        name: values.name,
        description: values.description || null,
      });
      toast.success("Category created");
      form.reset();
      setShowForm(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create category"));
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Categories"
        description="Create categories to organize marketplace services. Edit and delete are not supported by the API."
        action={
          <Button size="sm" type="button" onClick={() => setShowForm((v) => !v)}>
            <Plus aria-hidden="true" />
            {showForm ? "Cancel" : "New category"}
          </Button>
        }
      />

      {showForm && (
        <form
          className="space-y-4 rounded-lg border bg-card p-6 shadow-sm"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} aria-invalid={Boolean(form.formState.errors.name)} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" rows={3} {...form.register("description")} />
          </div>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating…" : "Create category"}
          </Button>
        </form>
      )}

      {categoriesQuery.isLoading ? (
        <LoadingScreen message="Loading categories…" />
      ) : categoriesQuery.isError ? (
        <ErrorState
          title="Unable to load categories"
          description="Please try again."
          onRetry={() => categoriesQuery.refetch()}
        />
      ) : (categoriesQuery.data?.length ?? 0) === 0 ? (
        <EmptyState
          icon={Tags}
          title="No categories yet"
          description="Create your first category to enable providers to list services."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {categoriesQuery.data?.map((category) => (
                  <tr key={category.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3 text-muted-foreground">#{category.id}</td>
                    <td className="px-4 py-3 font-medium">{category.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{category.description ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
