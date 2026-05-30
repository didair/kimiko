export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { JsonBlock } from "@/components/json-block";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function LogsPage() {
  const logs = await prisma.appLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <AppShell currentPath="/logs" title="Logs" description="Structured operational logs for the current instance.">
      <div className="grid gap-4">
        {logs.map((log) => (
          <Card key={log.id} className="rounded-3xl border-border/70 bg-white/85 shadow-sm backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle>{log.scope}</CardTitle>
                <CardDescription>{log.message}</CardDescription>
              </div>
              <StatusBadge tone={log.level === "error" ? "danger" : log.level === "warn" ? "warning" : "neutral"}>{log.level}</StatusBadge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{formatDate(log.createdAt)}</p>
              <JsonBlock value={log.detailsJson} />
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
