import Link from "next/link";
import { LayoutGridIcon, LogsIcon, NotebookTextIcon, PanelsTopLeftIcon, Settings2Icon, SparklesIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getConfig } from "@/lib/config";
import { getSiteLabel } from "@/lib/site-label";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutGridIcon },
  { href: "/subjects", label: "Subjects", icon: SparklesIcon },
  { href: "/runs", label: "Runs", icon: PanelsTopLeftIcon },
  { href: "/logs", label: "Logs", icon: LogsIcon },
  { href: "/content", label: "Content", icon: NotebookTextIcon },
  { href: "/settings", label: "Settings", icon: Settings2Icon },
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
  const siteLabel = getSiteLabel(getConfig().SITE_URL);

  return (
    <div className="min-h-screen bg-slate-50 text-foreground">
      <div className="mx-auto grid min-h-screen max-w-[1480px] lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="border-r bg-white px-4 py-5 lg:sticky lg:top-0 lg:h-screen">
          <div className="mb-5 space-y-3 px-2">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-amber-400/80">Kimiko</h1>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Content engine</p>
            </div>
          </div>
          <Separator className="mb-3" />
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex h-9 items-center gap-2 rounded-md px-2.5 text-sm font-medium transition-colors",
                    currentPath === link.href
                      ? "bg-slate-950 text-white!"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  )}
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0">
          <header className="border-b bg-white px-5 py-5 lg:px-8">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
              <Badge className="w-fit rounded-md border border-amber-300 bg-amber-300 px-6 py-4 text-lg font-medium uppercase text-slate-900 shadow-sm hover:bg-amber-300">
                {siteLabel}
              </Badge>
            </div>
          </header>
          <div className="space-y-6 px-5 py-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
