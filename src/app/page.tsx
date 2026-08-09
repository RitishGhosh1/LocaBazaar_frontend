import { ArrowRight, BadgeCheck, CalendarCheck2, CheckCircle2, MapPin, Search, ShieldCheck, Sparkles, Star, UsersRound } from "lucide-react";
import Link from "next/link";

import { CategoryCard } from "@/components/common/category-card";
import { ServiceCard } from "@/components/common/service-card";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { featuredServices, popularCategories } from "@/constants/landing";
import { cn } from "@/lib/utils";

const steps = [
  { number: "01", title: "Discover", description: "Find a service that fits your needs, nearby.", icon: Search },
  { number: "02", title: "Book", description: "Choose a provider and send a booking request.", icon: CalendarCheck2 },
  { number: "03", title: "Get it done", description: "Connect, coordinate, and get back to your day.", icon: CheckCircle2 },
];

const trustPoints = [
  { title: "Clear provider profiles", description: "See the service information shared by providers before you enquire.", icon: BadgeCheck },
  { title: "Secure sign-in", description: "Use email or Google sign-in to access your LocaBazaar account.", icon: ShieldCheck },
  { title: "Reviews that help", description: "Reviews give customers a clearer view of service experiences.", icon: Star },
  { title: "Simple booking flow", description: "Move from discovering a service to requesting a booking in fewer steps.", icon: CalendarCheck2 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklch,var(--secondary),transparent_15%),transparent_42%)]" />
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-28">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"><span className="size-2 rounded-full bg-emerald-500" />Services that feel closer to home</p>
              <h1 className="mt-6 max-w-3xl font-heading text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">Find trusted services, right around the corner.</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">Discover local professionals for the jobs, moments, and everyday needs that matter most.</p>
              <div className="mt-9 grid gap-3 rounded-lg border bg-card p-3 shadow-lg sm:grid-cols-[1fr_1fr_auto]">
                <label className="flex min-w-0 items-center gap-3 border-b px-3 py-3 sm:border-r sm:border-b-0"><Search className="size-5 text-muted-foreground" aria-hidden="true" /><span className="sr-only">Service needed</span><input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="What service do you need?" /></label>
                <label className="flex min-w-0 items-center gap-3 border-b px-3 py-3 sm:border-r sm:border-b-0"><MapPin className="size-5 text-muted-foreground" aria-hidden="true" /><span className="sr-only">Location</span><input className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Your neighbourhood" /></label>
                <Button className="w-full sm:w-auto" type="button"><Search aria-hidden="true" />Search</Button>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3"><Link href="#featured-services" className={buttonVariants({ size: "lg" })}>Find a service<ArrowRight aria-hidden="true" /></Link><Link href="#categories" className={buttonVariants({ size: "lg", variant: "outline" })}>Explore services</Link></div>
            </div>
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="rounded-lg border bg-card p-5 shadow-xl sm:p-7">
                <div className="flex items-center justify-between"><p className="text-sm font-semibold">Popular near you</p><span className="text-xs text-muted-foreground">This week</span></div>
                <div className="mt-6 space-y-4">
                  {["Home cleaning", "Plumbing support", "Fitness coaching"].map((service, index) => <div key={service} className="flex items-center gap-4 rounded-md border p-3"><div className={`grid size-11 place-items-center rounded-md ${index === 0 ? "bg-amber-100" : index === 1 ? "bg-sky-100" : "bg-emerald-100"}`}><Sparkles className="size-5" aria-hidden="true" /></div><div className="min-w-0 flex-1"><p className="font-medium">{service}</p><p className="mt-0.5 text-sm text-muted-foreground">Available in your area</p></div><ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" /></div>)}
                </div>
              </div>
              <div className="absolute -right-4 -bottom-6 hidden rounded-md border bg-background p-4 shadow-lg sm:block"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-full bg-emerald-100 text-emerald-700"><UsersRound className="size-4" aria-hidden="true" /></div><div><p className="text-sm font-semibold">Built around you</p><p className="text-xs text-muted-foreground">Local services, local people</p></div></div></div>
            </div>
          </div>
        </section>

        <section id="categories" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="max-w-2xl"><p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Browse by need</p><h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Popular categories</h2><p className="mt-4 text-base leading-7 text-muted-foreground">Start with the service you need today. More local options are on the way.</p></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{popularCategories.map((category) => <CategoryCard key={category.name} {...category} />)}</div>
        </section>

        <section id="featured-services" className="border-y bg-secondary/40"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div className="max-w-2xl"><p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Local favourites</p><h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Popular services near you</h2><p className="mt-4 text-base leading-7 text-muted-foreground">A small preview of the kinds of services LocaBazaar will help you discover.</p></div><p className="text-sm text-muted-foreground">Presentation examples — not live listings.</p></div><div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{featuredServices.map((service) => <ServiceCard key={service.title} {...service} />)}</div></div></section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">How LocaBazaar works</p><h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Local help, without the runaround.</h2><p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">A straightforward path from finding the right service to getting your task done.</p></div><ol className="grid gap-4 sm:grid-cols-3">{steps.map((step) => <li key={step.number} className="border-t pt-5"><p className="text-sm font-semibold text-muted-foreground">{step.number}</p><step.icon className="mt-7 size-6" strokeWidth={1.6} aria-hidden="true" /><h3 className="mt-5 text-lg font-semibold">{step.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p></li>)}</ol></div></section>

        <section id="for-providers" className="bg-primary text-primary-foreground"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><div><p className="text-sm font-semibold tracking-widest text-primary-foreground/65 uppercase">For local professionals</p><h2 className="mt-4 max-w-2xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl">Turn your skills into your next opportunity.</h2><p className="mt-5 max-w-xl text-base leading-7 text-primary-foreground/75">Create services, connect with customers nearby, and build the local reputation your work deserves.</p><Link href="/login" className={cn(buttonVariants({ size: "lg" }), "mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90")}>Become a provider<ArrowRight aria-hidden="true" /></Link></div><div className="border border-primary-foreground/20 p-6 sm:p-8"><p className="font-heading text-2xl font-semibold">Your craft has a place here.</p><ul className="mt-7 space-y-4">{["List services you are proud of", "Connect with nearby customers", "Manage interest in one place"].map((item) => <li key={item} className="flex gap-3 text-sm text-primary-foreground/80"><CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />{item}</li>)}</ul></div></div></section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28"><div className="max-w-2xl"><p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">Designed for confidence</p><h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">A clearer way to choose local services.</h2></div><div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">{trustPoints.map((point) => <div key={point.title}><point.icon className="size-6" strokeWidth={1.6} aria-hidden="true" /><h3 className="mt-5 font-semibold">{point.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{point.description}</p></div>)}</div></section>
      </main>
      <Footer />
    </div>
  );
}
