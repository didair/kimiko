export const dynamic = "force-dynamic";

import { ExternalLinkIcon } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ArticlePreviewDialog } from "@/components/article-preview-dialog";
import { PageSection } from "@/components/page-section";
import { RetryPublishButton } from "@/components/retry-publish-button";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-lg border bg-white shadow-none">
          <CardHeader>
            <CardTitle>Articles stored</CardTitle>
            <CardDescription>Total generated entries available for review.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold tracking-tight">{articles.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg border bg-white shadow-none">
          <CardHeader>
            <CardTitle>Failed publishes</CardTitle>
            <CardDescription>Retry these after fixing WordPress connectivity.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold tracking-tight">{failedArticles}</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg border bg-white shadow-none">
          <CardHeader>
            <CardTitle>Latest draft</CardTitle>
            <CardDescription>Most recent article generation timestamp.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{articles[0] ? formatDate(articles[0].createdAt) : "n/a"}</p>
          </CardContent>
        </Card>
      </section>

      <PageSection title="Article library" description="Compact list of generated drafts. Open a preview only when you need the full article.">
        <Card className="overflow-hidden rounded-lg border bg-white shadow-none">
          <CardContent className="p-0">
            <ScrollArea className="h-[min(680px,calc(100vh-18rem))]">
            <Table>
              <TableHeader className="bg-muted/35">
                <TableRow>
                  <TableHead className="pl-4">Article</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Word count</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="pr-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="pl-4 py-4 align-top whitespace-normal">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{article.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{article.subject.title}</p>
                        <p className="mt-2 text-xs leading-5 text-muted-foreground">{article.excerpt}</p>
                      </div>
                    </TableCell>
                    <TableCell title={article.wordpressPostId ? `ID: ${article.wordpressPostId}` : "n/a"}>
                      <StatusBadge tone={article.status === "draft_published" ? "success" : article.status === "publish_failed" ? "danger" : "warning"}>
                        {article.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{article.wordCount}</TableCell>
                    <TableCell>{formatDate(article.createdAt)}</TableCell>
                    <TableCell className="pr-4">
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
