export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { RetryPublishButton } from "@/components/retry-publish-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          <Card key={article.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle>{article.title}</CardTitle>
                <p className="mt-1 text-sm text-slate-500">{article.subject.title}</p>
              </div>
              <Badge tone={article.status === "draft_published" ? "success" : article.status === "publish_failed" ? "danger" : "warning"}>
                {article.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>Created: {formatDate(article.createdAt)}</p>
              <p>Word count: {article.wordCount}</p>
              <p>WordPress post ID: {article.wordpressPostId ?? "n/a"}</p>
              {article.status === "publish_failed" ? (
                <div className="flex items-center gap-3">
                  <RetryPublishButton articleId={article.id} />
                </div>
              ) : null}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
