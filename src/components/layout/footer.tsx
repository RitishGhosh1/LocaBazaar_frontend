import Link from "next/link";

const footerGroups = [
  { title: "Explore", links: ["Services", "Categories", "How it works"] },
  { title: "For Providers", links: ["Become a provider", "Provider resources", "Help centre"] },
  { title: "Company", links: ["About us", "Contact", "Careers"] },
  { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
];

export function Footer() {
  return (
    <footer className="border-t bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.35fr_3fr]">
        <div>
          <Link href="/" className="font-heading text-2xl font-semibold tracking-tight">LocaBazaar</Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">A more thoughtful way to discover the people and services around you.</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => <li key={link}><Link href="#" className="text-sm text-muted-foreground transition hover:text-foreground">{link}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t"><div className="mx-auto max-w-7xl px-5 py-5 text-sm text-muted-foreground sm:px-8">© 2026 LocaBazaar. Built for better local living.</div></div>
    </footer>
  );
}
