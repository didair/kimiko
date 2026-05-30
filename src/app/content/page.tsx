export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { RetryPublishButton } from "@/components/retry-publish-button";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function ContentPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { subject: true },
  });

  return (
    <AppShell currentPath="/content" title="Content" description="Generated article history and WordPress publish outcomes.">
      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.id} className="rounded-3xl border-border/70 bg-white/85 shadow-sm backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle>{article.title}</CardTitle>
                <CardDescription>{article.subject.title}</CardDescription>
              </div>
              <StatusBadge tone={article.status === "draft_published" ? "success" : article.status === "publish_failed" ? "danger" : "warning"}>
                {article.status}
              </StatusBadge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Created: {formatDate(article.createdAt)}</p>
              <p>Word count: {article.wordCount}</p>
              <p>WordPress post ID: {article.wordpressPostId ?? "n/a"}</p>
              {article.status === "publish_failed" ? (
                <div className="flex items-center gap-3">
                  <RetryPublishButton articleId={article.id} />
                </div>
              ) : null}
              <div className="rounded-2xl border border-border bg-muted/35 p-4 text-foreground" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
