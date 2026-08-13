"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ErrorState, PageHeader } from "@/components/dashboard/dashboard-primitives";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/use-categories";
import { useCreateService } from "@/hooks/use-provider-services";
import { getApiErrorMessage } from "@/lib/api-error";

const serviceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category_id: z.coerce.number().int().positive("Select a category"),
  description: z.string().optional(),
  price: z.coerce.number().int().positive("Price must be a positive whole number"),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function NewProviderServicePage() {
  const router = useRouter();
  const categoriesQuery = useCategories();
  const createMutation = useCreateService();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      category_id: 0,
      description: "",
      price: 0,
    },
  });

  async function onSubmit(values: ServiceFormValues) {
    try {
      await createMutation.mutateAsync({
        name: values.name,
        category_id: values.category_id,
        description: values.description || null,
        price: values.price,
      });
      toast.success("Service created successfully");
      router.push("/provider/services");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create service"));
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageHeader
        title="Create service"
        description="Add a new service listing using the backend ServiceCreate schema."
        action={
          <Link href="/provider/services" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <ArrowLeft aria-hidden="true" />
            Back
          </Link>
        }
      />

      {categoriesQuery.isError ? (
        <ErrorState
          title="Unable to load categories"
          description="Categories are required to create a service."
          onRetry={() => categoriesQuery.refetch()}
        />
      ) : (
        <form className="space-y-6 rounded-lg border bg-card p-6 shadow-sm" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="name">Service name</Label>
            <Input id="name" {...form.register("name")} aria-invalid={Boolean(form.formState.errors.name)} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Category</Label>
            <Select
              id="category_id"
              defaultValue=""
              {...form.register("category_id")}
              aria-invalid={Boolean(form.formState.errors.category_id)}
            >
              <option value="" disabled>
                {categoriesQuery.isLoading ? "Loading categories…" : "Select a category"}
              </option>
              {categoriesQuery.data?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            {form.formState.errors.category_id && (
              <p className="text-sm text-destructive">{form.formState.errors.category_id.message}</p>
            )}
            {(categoriesQuery.data?.length ?? 0) === 0 && !categoriesQuery.isLoading && (
              <p className="text-sm text-muted-foreground">
                No categories exist yet. Ask a superadmin to create categories first.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" rows={4} {...form.register("description")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (INR, whole number)</Label>
            <Input
              id="price"
              type="number"
              min={1}
              step={1}
              {...form.register("price")}
              aria-invalid={Boolean(form.formState.errors.price)}
            />
            {form.formState.errors.price && (
              <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
            )}
          </div>

          <Button type="submit" disabled={createMutation.isPending || categoriesQuery.isLoading}>
            {createMutation.isPending ? "Creating…" : "Create service"}
          </Button>
        </form>
      )}
    </div>
  );
}
