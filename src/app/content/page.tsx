export const dynamic = "force-dynamic";

import { ExternalLinkIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ArticlePreviewDialog } from "@/components/article-preview-dialog";
import { MetricCard } from "@/components/metric-card";
import { PageSection } from "@/components/page-section";
import { RetryPublishButton } from "@/components/retry-publish-button";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getConfig } from "@/lib/config";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { getWordPressEditUrl } from "@/lib/wordpress-url";

export default async function ContentPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { subject: true },
  });
  const failedArticles = articles.filter((article) => article.status === "publish_failed").length;
  const { WORDPRESS_URL } = getConfig();

  return (
    <AppShell currentPath="/content" title="Content" description="Generated article history and WordPress publish outcomes.">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Articles stored" value={articles.length} hint="Generated entries available for review." />
        <MetricCard label="Failed publishes" value={failedArticles} hint="Drafts that still need a WordPress retry." />
        <MetricCard label="Latest draft" value={articles[0] ? formatDate(articles[0].createdAt) : "n/a"} hint="Most recent generation timestamp." />
      </section>

      <PageSection title="Article library" description="Compact list of generated drafts. Open a preview only when you need the full article.">
        <div className="space-y-3 md:hidden">
          {articles.map((article) => (
            <article key={article.id} className="rounded-2xl bg-card p-4 shadow-[0_1px_0_rgba(23,33,29,0.06),0_12px_28px_rgba(23,33,29,0.045)] ring-1 ring-foreground/6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-heading text-lg leading-snug">{article.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{article.subject.title}</p>
                </div>
                <StatusBadge tone={article.status === "draft_published" ? "success" : article.status === "publish_failed" ? "danger" : "warning"}>
                  {article.status}
                </StatusBadge>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{article.excerpt}</p>
              <div className="mt-4 flex items-center justify-between border-t border-black/6 pt-3 text-xs text-muted-foreground">
                <span>{article.wordCount} words</span>
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <ArticlePreviewDialog
                  title={article.title}
                  subjectTitle={article.subject.title}
                  excerpt={article.excerpt}
                  contentHtml={article.contentHtml}
                />
                {article.wordpressPostId ? (
                  <Button asChild variant="outline" size="sm">
                    <a href={getWordPressEditUrl(WORDPRESS_URL, article.wordpressPostId)} target="_blank" rel="noreferrer">
                      <ExternalLinkIcon />
                      Edit
                    </a>
                  </Button>
                ) : null}
                {article.status === "publish_failed" ? <RetryPublishButton articleId={article.id} /> : null}
              </div>
            </article>
          ))}
        </div>

        <Card className="hidden overflow-hidden py-0 md:flex">
          <CardContent className="p-0">
            <ScrollArea className="h-[min(680px,calc(100vh-18rem))]">
            <Table>
              <TableHeader className="bg-muted/45">
                <TableRow>
                  <TableHead className="pl-5">Article</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Word count</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="pr-5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="pl-5 py-4 align-top whitespace-normal">
                      <div className="min-w-0">
                        <p className="font-heading text-base font-medium text-foreground">{article.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{article.subject.title}</p>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{article.excerpt}</p>
                      </div>
                    </TableCell>
                    <TableCell title={article.wordpressPostId ? `ID: ${article.wordpressPostId}` : "n/a"}>
                      <StatusBadge tone={article.status === "draft_published" ? "success" : article.status === "publish_failed" ? "danger" : "warning"}>
                        {article.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{article.wordCount}</TableCell>
                    <TableCell>{formatDate(article.createdAt)}</TableCell>
                    <TableCell className="pr-5">
                      <div className="flex justify-end gap-2">
                        <ArticlePreviewDialog
                          title={article.title}
                          subjectTitle={article.subject.title}
                          excerpt={article.excerpt}
                          contentHtml={article.contentHtml}
                        />
                        {article.wordpressPostId ? (
                          <Button asChild variant="outline" size="sm">
                            <a href={getWordPressEditUrl(WORDPRESS_URL, article.wordpressPostId)} target="_blank" rel="noreferrer">
                              <ExternalLinkIcon />
                              Edit
                            </a>
                          </Button>
                        ) : null}
                        {article.status === "publish_failed" ? <RetryPublishButton articleId={article.id} /> : null}
                      </div>
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
