export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { JobButton } from "@/components/job-button";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getConfig } from "@/lib/config";
import { getDashboardData } from "@/lib/dashboard";
import { formatDate } from "@/lib/format";

export default async function Home() {
  const dashboard = await getDashboardData();
  const config = getConfig();

  return (
    <AppShell currentPath="/" title="Dashboard" description="Daily crawl, queue, and publishing status for the current site instance.">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Queued subjects" value={dashboard.queuedSubjects} hint="Ready to become future drafts." />
        <MetricCard label="Used subjects" value={dashboard.usedSubjects} hint="Already converted into articles." />
        <MetricCard label="Failed publishes" value={dashboard.failedArticles} hint="Generated locally but WordPress needs a retry." />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card className="rounded-3xl border-border/70 bg-white/85 shadow-sm backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Manual controls</CardTitle>
              <CardDescription>Use the same service layer as the scheduler.</CardDescription>
            </div>
            <StatusBadge tone="warning">{config.TIMEZONE}</StatusBadge>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <JobButton endpoint="/api/jobs/crawl" label="Run crawl now" />
            <JobButton endpoint="/api/jobs/generate-subjects" label="Generate subjects now" variant="outline" />
            <JobButton endpoint="/api/jobs/generate-article" label="Generate next article now" variant="default" />
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/70 bg-white/85 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle>Schedules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Crawl: <span className="font-medium text-foreground">{config.CRON_CRAWL}</span>
            </p>
            <p>
              Subjects: <span className="font-medium text-foreground">{config.CRON_SUBJECTS}</span>
            </p>
            <p>
              Article: <span className="font-medium text-foreground">{config.CRON_ARTICLE}</span>
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card className="rounded-3xl border-border/70 bg-white/85 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle>Recent runs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="pl-4">Job</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-4">Finished</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard.recentRuns.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="pl-4 capitalize">{run.jobType}</TableCell>
                    <TableCell>
                      <StatusBadge tone={run.status === "success" ? "success" : run.status === "failed" ? "danger" : "warning"}>{run.status}</StatusBadge>
                    </TableCell>
                    <TableCell className="pr-4">{formatDate(run.finishedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/70 bg-white/85 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle>Recent content</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="pl-4">Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-4">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard.recentArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="pl-4 py-4 align-top whitespace-normal">
                      <p className="font-medium text-foreground">{article.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{article.subject.title}</p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge tone={article.status === "draft_published" ? "success" : article.status === "publish_failed" ? "danger" : "warning"}>
                        {article.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="pr-4">{formatDate(article.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
