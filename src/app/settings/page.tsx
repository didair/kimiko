export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSettingsData } from "@/lib/dashboard";

export default async function SettingsPage() {
  const settings = await getSettingsData();

  return (
    <AppShell currentPath="/settings" title="Settings" description="Read-only effective configuration with secrets masked.">
      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm text-slate-100">{JSON.stringify(settings, null, 2)}</pre>
        </CardContent>
      </Card>
    </AppShell>
  );
}
