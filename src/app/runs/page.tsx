export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { JsonBlock } from "@/components/json-block";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function RunsPage() {
  const runs = await prisma.jobRun.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <AppShell currentPath="/runs" title="Runs" description="Inspect crawl, subject generation, and article generation outcomes.">
      <div className="grid gap-4">
        {runs.map((run) => (
          <Card key={run.id} className="rounded-3xl border-border/70 bg-white/85 shadow-sm backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle>{run.jobType}</CardTitle>
                <CardDescription>{run.summary}</CardDescription>
              </div>
              <StatusBadge tone={run.status === "success" ? "success" : run.status === "failed" ? "danger" : "warning"}>{run.status}</StatusBadge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Started: {formatDate(run.startedAt)}</p>
              <p>Finished: {formatDate(run.finishedAt)}</p>
              <JsonBlock value={run.detailsJson} />
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
