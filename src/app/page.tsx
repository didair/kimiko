export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { JobButton } from "@/components/job-button";
import { MetricCard } from "@/components/metric-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Manual controls</CardTitle>
              <p className="mt-1 text-sm text-slate-500">Use the same service layer as the scheduler.</p>
            </div>
            <Badge tone="warning">{config.TIMEZONE}</Badge>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <JobButton endpoint="/api/jobs/crawl" label="Run crawl now" />
            <JobButton endpoint="/api/jobs/generate-subjects" label="Generate subjects now" />
            <JobButton endpoint="/api/jobs/generate-article" label="Generate next article now" variant="default" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>
              Crawl: <span className="font-medium text-slate-950">{config.CRON_CRAWL}</span>
            </p>
            <p>
              Subjects: <span className="font-medium text-slate-950">{config.CRON_SUBJECTS}</span>
            </p>
            <p>
              Article: <span className="font-medium text-slate-950">{config.CRON_ARTICLE}</span>
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent runs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <tr>
                  <TH>Job</TH>
                  <TH>Status</TH>
                  <TH>Finished</TH>
                </tr>
              </THead>
              <TBody>
                {dashboard.recentRuns.map((run) => (
                  <tr key={run.id}>
                    <TD>{run.jobType}</TD>
                    <TD>
                      <Badge tone={run.status === "success" ? "success" : run.status === "failed" ? "danger" : "warning"}>{run.status}</Badge>
                    </TD>
                    <TD>{formatDate(run.finishedAt)}</TD>
                  </tr>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent content</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <THead>
                <tr>
                  <TH>Title</TH>
                  <TH>Status</TH>
                  <TH>Created</TH>
                </tr>
              </THead>
              <TBody>
                {dashboard.recentArticles.map((article) => (
                  <tr key={article.id}>
                    <TD>
                      <p className="font-medium text-slate-900">{article.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{article.subject.title}</p>
                    </TD>
                    <TD>
                      <Badge tone={article.status === "draft_published" ? "success" : article.status === "publish_failed" ? "danger" : "warning"}>
                        {article.status}
                      </Badge>
                    </TD>
                    <TD>{formatDate(article.createdAt)}</TD>
                  </tr>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
