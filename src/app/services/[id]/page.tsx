interface ServiceDetailPlaceholderProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPlaceholder({ params }: ServiceDetailPlaceholderProps) {
  const { id } = await params;

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <section className="max-w-md rounded-lg border bg-card p-8 text-center shadow-sm">
        <p className="font-heading text-3xl font-semibold">Service details</p>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">Service #{id} is ready for its full detail experience in the next iteration.</p>
      </section>
    </main>
  );
}
