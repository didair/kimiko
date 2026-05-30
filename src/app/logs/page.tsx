export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { JsonBlock } from "@/components/json-block";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          <Card key={log.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle>{log.scope}</CardTitle>
                <p className="mt-1 text-sm text-slate-500">{log.message}</p>
              </div>
              <Badge tone={log.level === "error" ? "danger" : log.level === "warn" ? "warning" : "default"}>{log.level}</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>{formatDate(log.createdAt)}</p>
              <JsonBlock value={log.detailsJson} />
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
