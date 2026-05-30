import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/subjects", label: "Subjects" },
  { href: "/runs", label: "Runs" },
  { href: "/logs", label: "Logs" },
  { href: "/content", label: "Content" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({
  children,
  currentPath,
  title,
  description,
}: {
  children: React.ReactNode;
  currentPath: string;
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.16),transparent_24%),linear-gradient(180deg,#fcfcfd_0%,#f6f7fb_42%,#eef2ff_100%)] text-foreground">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[2rem] border border-white/70 bg-slate-950 px-6 py-6 text-slate-100 shadow-2xl shadow-slate-900/10">
          <div className="mb-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-amber-300/80">Kimiko content engine</h1>
            </div>
          </div>
          <Separator className="mb-5 bg-white/10" />
          <nav className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                  currentPath === link.href
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="space-y-6 py-1">
          <header className="">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
