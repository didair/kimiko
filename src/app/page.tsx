export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { JobButton } from "@/components/job-button";
import { MetricCard } from "@/components/metric-card";
import { PageSection } from "@/components/page-section";
import { StatusBadge } from "@/components/status-badge";
import { Clock3Icon, ZapIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getConfig } from "@/lib/config";
import { getDashboardData } from "@/lib/dashboard";
import { formatDate } from "@/lib/format";
import { formatScheduledRun, getNextCronRun } from "@/lib/schedule";

export default async function Home() {
  const dashboard = await getDashboardData();
  const config = getConfig();
  const schedules = [
    { label: "Crawl", cron: config.CRON_CRAWL },
    { label: "Subjects", cron: config.CRON_SUBJECTS },
    { label: "Article", cron: config.CRON_ARTICLE },
  ].map((schedule) => ({
    ...schedule,
    nextRun: getNextCronRun(schedule.cron, config.TIMEZONE),
  }));

  return (
    <AppShell currentPath="/" title="Dashboard" description="Daily crawl, queue, and publishing status for the current site instance.">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Queued subjects" value={dashboard.queuedSubjects} hint="Ready to become future drafts." />
        <MetricCard label="Used subjects" value={dashboard.usedSubjects} hint="Already converted into articles." />
        <MetricCard label="Failed publishes" value={dashboard.failedArticles} hint="Generated locally but WordPress needs a retry." />
      </section>

      <PageSection title="Daily operations" description="Run the pipeline manually or check when the next automated jobs will start.">
        <section className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
          <Card className="border-0 bg-[#17211d] text-white ring-0">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <div className="mb-3 grid size-10 place-items-center rounded-xl bg-white/10">
                  <ZapIcon className="size-5 text-[#f2c94c]" />
                </div>
                <CardTitle className="text-xl text-white">Manual controls</CardTitle>
                <CardDescription className="mt-1 max-w-lg text-white/55">
                  Start a pipeline step immediately. Each action uses the same service layer as its scheduled job.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <JobButton endpoint="/api/jobs/crawl" label="Run crawl now" variant="outline" />
              <JobButton endpoint="/api/jobs/generate-subjects" label="Generate subjects" variant="outline" />
              <JobButton endpoint="/api/jobs/generate-article" label="Write next article" variant="secondary" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <div className="mb-3 grid size-10 place-items-center rounded-xl bg-[#f5edcf]">
                  <Clock3Icon className="size-5 text-[#80620b]" />
                </div>
                <CardTitle className="text-xl">Schedule</CardTitle>
              </div>
              <StatusBadge tone="warning">{config.TIMEZONE}</StatusBadge>
            </CardHeader>

            <CardContent className="grid gap-0 text-sm">
              {schedules.map((schedule, index) => (
                <div key={schedule.label} className="relative grid grid-cols-[18px_1fr] gap-3 pb-4 last:pb-0">
                  <div className="relative flex justify-center">
                    <span className="mt-1.5 size-2 rounded-full bg-[#d3aa2c]" />
                    {index < schedules.length - 1 ? <span className="absolute bottom-0 top-4 w-px bg-border" /> : null}
                  </div>
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-foreground">{schedule.label}</span>
                      <code className="text-[11px] text-muted-foreground">{schedule.cron}</code>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatScheduledRun(schedule.nextRun, config.TIMEZONE)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </PageSection>

      <PageSection title="Recent activity" description="The latest job runs and generated drafts without leaving the dashboard.">
        <section className="grid gap-4 xl:grid-cols-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl">Recent runs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/45">
                  <TableRow>
                    <TableHead className="pl-5">Job</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-5">Finished</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboard.recentRuns.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell className="pl-5 font-medium capitalize">{run.jobType}</TableCell>
                      <TableCell>
                        <StatusBadge tone={run.status === "success" ? "success" : run.status === "failed" ? "danger" : "warning"}>{run.status}</StatusBadge>
                      </TableCell>
                      <TableCell className="pr-5 text-muted-foreground">{formatDate(run.finishedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl">Recent content</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/45">
                  <TableRow>
                    <TableHead className="pl-5">Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-5">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboard.recentArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="pl-5 py-4 align-top whitespace-normal">
                        <p className="font-medium text-foreground">{article.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{article.subject.title}</p>
                      </TableCell>
                      <TableCell>
                        <StatusBadge tone={article.status === "draft_published" ? "success" : article.status === "publish_failed" ? "danger" : "warning"}>
                          {article.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="pr-5 text-muted-foreground">{formatDate(article.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </PageSection>
    </AppShell>
  );
}
