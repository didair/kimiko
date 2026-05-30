export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { PageSection } from "@/components/page-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSettingsData } from "@/lib/dashboard";

export default async function SettingsPage() {
  const settings = await getSettingsData();

  return (
    <AppShell currentPath="/settings" title="Settings" description="Read-only effective configuration with secrets masked.">
      <PageSection title="Environment" description="Effective runtime configuration with sensitive values masked.">
        <Card className="overflow-hidden rounded-lg border bg-white shadow-none">
          <CardHeader>
            <CardTitle>Resolved config</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[min(700px,calc(100vh-13rem))]">
              <pre className="overflow-x-auto bg-slate-950 p-5 text-sm leading-6 text-slate-100">{JSON.stringify(settings, null, 2)}</pre>
            </ScrollArea>
          </CardContent>
        </Card>
      </PageSection>
    </AppShell>
  );
}
