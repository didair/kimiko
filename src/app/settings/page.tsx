export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { PageSection } from "@/components/page-section";
import { Card, CardContent } from "@/components/ui/card";
import { getSettingsData } from "@/lib/dashboard";

export default async function SettingsPage() {
  const settings = await getSettingsData();

  return (
    <AppShell currentPath="/settings" title="Settings" description="Read-only effective configuration with secrets masked.">
      <PageSection title="Environment" description="Effective runtime configuration with sensitive values masked.">
        <Card>
          <CardContent className="p-0">
            <dl className="grid gap-x-8 gap-y-0 sm:grid-cols-2 xl:grid-cols-3">
              {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="min-w-0 border-b border-black/6 px-5 py-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{key.replaceAll("_", " ")}</dt>
                  <dd className="mt-1.5 break-all font-mono text-sm font-medium text-foreground">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </PageSection>
    </AppShell>
  );
}
