export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { JsonDetailsDialog } from "@/components/json-details-dialog";
import { PageSection } from "@/components/page-section";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function RunsPage() {
  const runs = await prisma.jobRun.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <AppShell currentPath="/runs" title="Runs" description="Inspect crawl, subject generation, and article generation outcomes.">
      <PageSection title="Job history" description="Recent crawl, subject generation, and article generation runs.">
        <Card className="overflow-hidden rounded-lg border bg-white shadow-none">
          <CardContent className="p-0">
            <ScrollArea className="h-[min(700px,calc(100vh-13rem))]">
            <Table>
              <TableHeader className="bg-muted/35">
                <TableRow>
                  <TableHead className="pl-4">Job</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Finished</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead className="pr-4 text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="pl-4 capitalize">{run.jobType}</TableCell>
                    <TableCell>
                      <StatusBadge tone={run.status === "success" ? "success" : run.status === "failed" ? "danger" : "warning"}>{run.status}</StatusBadge>
                    </TableCell>
                    <TableCell>{formatDate(run.startedAt)}</TableCell>
                    <TableCell>{formatDate(run.finishedAt)}</TableCell>
                    <TableCell className="max-w-md whitespace-normal text-muted-foreground">{run.summary}</TableCell>
                    <TableCell className="pr-4 text-right">
                      <JsonDetailsDialog
                        title={`${run.jobType} run`}
                        description={run.summary}
                        value={run.detailsJson}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </PageSection>
    </AppShell>
  );
}
