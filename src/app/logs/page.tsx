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

export default async function LogsPage() {
  const logs = await prisma.appLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <AppShell currentPath="/logs" title="Logs" description="Structured operational logs for the current instance.">
      <PageSection title="Operational logs" description="Compact event stream with JSON details available on demand.">
        <Card className="overflow-hidden rounded-lg border bg-white shadow-none">
          <CardContent className="p-0">
            <ScrollArea className="h-[min(700px,calc(100vh-13rem))]">
            <Table>
              <TableHeader className="bg-muted/35">
                <TableRow>
                  <TableHead className="pl-4">Scope</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="pr-4 text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="pl-4 font-medium">{log.scope}</TableCell>
                    <TableCell>
                      <StatusBadge tone={log.level === "error" ? "danger" : log.level === "warn" ? "warning" : "neutral"}>{log.level}</StatusBadge>
                    </TableCell>
                    <TableCell className="max-w-xl whitespace-normal text-muted-foreground">{log.message}</TableCell>
                    <TableCell>{formatDate(log.createdAt)}</TableCell>
                    <TableCell className="pr-4 text-right">
                      <JsonDetailsDialog
                        title={`${log.scope} log entry`}
                        description={log.message}
                        value={log.detailsJson}
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
