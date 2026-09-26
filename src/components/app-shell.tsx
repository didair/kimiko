import Link from "next/link";
import {
  CircleDotIcon,
  LayoutGridIcon,
  LogsIcon,
  NotebookTextIcon,
  PanelsTopLeftIcon,
  Settings2Icon,
  SparklesIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    <div className="min-h-screen bg-background text-foreground">
      <div className="min-h-screen lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
        <aside className="hidden min-h-screen flex-col bg-[#17211d] px-4 py-5 text-white lg:sticky lg:top-0 lg:flex lg:h-screen">
          <div className="px-3 pb-7 pt-2">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-[#f2c94c] text-lg font-bold text-[#17211d]">K</div>
              <div>
                <h1 className="font-heading text-2xl leading-none tracking-tight">Kimiko</h1>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/45">Content operations</p>
              </div>
            </div>
          </div>
          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                    currentPath === link.href
                      ? "bg-white text-[#17211d]"
                      : "text-white/65 hover:bg-white/8 hover:text-white",
                  )}
                >
                  <Icon className={cn("size-4", currentPath === link.href ? "text-[#b48800]" : "text-white/45 group-hover:text-white/80")} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-3.5">
            <div className="flex items-center gap-2 text-xs font-medium text-white/55">
              <CircleDotIcon className="size-3.5 text-emerald-400" />
              Active workspace
            </div>
            <p className="mt-2 truncate font-heading text-lg text-white">{siteLabel}</p>
          </div>
        </aside>
        <main className="min-w-0">
          <div className="border-b border-black/8 bg-[#17211d] px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] text-white lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="grid size-8 place-items-center rounded-lg bg-[#f2c94c] font-bold text-[#17211d]">K</div>
                <span className="font-heading text-xl">Kimiko</span>
              </div>
              <Badge className="border-white/10 bg-white/10 text-white hover:bg-white/10">{siteLabel}</Badge>
            </div>
            <nav className="-mx-1 mt-3 flex gap-1 overflow-x-auto px-1 pb-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium",
                      currentPath === link.href ? "bg-white text-[#17211d]" : "text-white/60",
                    )}
                  >
                    <Icon className="size-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <header className="px-5 pb-5 pt-7 lg:px-10 lg:pb-7 lg:pt-10">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a7612]">Operations</p>
                <h2 className="font-heading text-4xl leading-none tracking-tight text-[#17211d] lg:text-5xl">{title}</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
              <Badge className="hidden w-fit rounded-full border border-[#dec36d] bg-[#fff6cf] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#725500] shadow-none hover:bg-[#fff6cf] lg:inline-flex">
                <CircleDotIcon className="mr-1.5 size-3.5 fill-emerald-500 text-emerald-500" />
                {siteLabel}
              </Badge>
            </div>
          </header>
          <div className="mx-auto max-w-[1440px] space-y-8 px-5 pb-12 lg:px-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
