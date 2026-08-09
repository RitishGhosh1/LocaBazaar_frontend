import {
  BookOpenCheck,
  Dumbbell,
  Hammer,
  Paintbrush,
  PlugZap,
  ShowerHead,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface LandingCategory {
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface FeaturedService {
  title: string;
  provider: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  location: string;
  icon: LucideIcon;
  accentClassName: string;
}

export const popularCategories: LandingCategory[] = [
  { name: "Home Cleaning", description: "Fresh spaces, less effort", icon: Sparkles },
  { name: "Plumbing", description: "Everyday fixes, handled", icon: ShowerHead },
  { name: "Electrical", description: "Reliable help at home", icon: PlugZap },
  { name: "Tutoring", description: "Learn with local experts", icon: BookOpenCheck },
  { name: "Beauty & Wellness", description: "Care close to you", icon: Paintbrush },
  { name: "Repairs", description: "Bring your essentials back", icon: Wrench },
  { name: "Photography", description: "Capture what matters", icon: Paintbrush },
  { name: "Fitness", description: "Move at your pace", icon: Dumbbell },
];

export const featuredServices: FeaturedService[] = [
  {
    title: "Deep home cleaning",
    provider: "Maya's Home Care",
    category: "Home Cleaning",
    price: 899,
    rating: 4.9,
    reviewCount: 128,
    location: "Indiranagar",
    icon: Sparkles,
    accentClassName: "bg-amber-100 text-amber-800",
  },
  {
    title: "Same-day plumbing visit",
    provider: "AquaFix Services",
    category: "Plumbing",
    price: 499,
    rating: 4.8,
    reviewCount: 86,
    location: "Koramangala",
    icon: ShowerHead,
    accentClassName: "bg-sky-100 text-sky-800",
  },
  {
    title: "Personal strength coaching",
    provider: "Arjun Fitness Studio",
    category: "Fitness",
    price: 699,
    rating: 4.9,
    reviewCount: 64,
    location: "HSR Layout",
    icon: Dumbbell,
    accentClassName: "bg-emerald-100 text-emerald-800",
  },
  {
    title: "Furniture repair at home",
    provider: "The Repair Collective",
    category: "Repairs",
    price: 599,
    rating: 4.7,
    reviewCount: 42,
    location: "Jayanagar",
    icon: Hammer,
    accentClassName: "bg-orange-100 text-orange-800",
  },
];
