import Link from "next/link";
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.24),_transparent_28%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl border border-white/70 bg-slate-950 px-5 py-6 text-slate-100 shadow-xl shadow-slate-900/10">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300">Kimiko</p>
            <h1 className="mt-2 text-2xl font-semibold">Content engine</h1>
            <p className="mt-3 text-sm text-slate-400">Local-first publishing control for one ecommerce site.</p>
          </div>
          <nav className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block rounded-xl px-3 py-2 text-sm transition-colors",
                  currentPath === link.href ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-900 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="space-y-6">
          <header className="rounded-3xl border border-white/70 bg-white/80 px-6 py-6 shadow-sm backdrop-blur">
            <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
