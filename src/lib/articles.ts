import { ArticleStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getPromptContextPages } from "@/lib/context";
import { renderArticleHtml, getArticleWordCount } from "@/lib/html";
import { logEvent } from "@/lib/logger";
import { OpenAIProvider } from "@/lib/openai-provider";
import { markSubjectUsed, moveSubjectToTop } from "@/lib/subjects";
import { createDraftPost } from "@/lib/wordpress";

type GenerateArticleResult =
  | { skipped: true; reason: string }
  | { skipped: false; articleId: string; subjectId: string };

export async function generateArticleForSubject(subjectId?: string): Promise<GenerateArticleResult> {
  if (subjectId) {
    await moveSubjectToTop(subjectId);
  }

  const subject = await prisma.subject.findFirst({
    where: { status: "queued" },
    orderBy: { position: "asc" },
  });

  if (!subject) {
    return { skipped: true as const, reason: "No queued subjects available" };
  }

  const provider = new OpenAIProvider();
  const pages = await getPromptContextPages();
  const draft = await provider.generateArticle({ subject, pages });
  const contentHtml = renderArticleHtml(draft);
  const article = await prisma.article.create({
    data: {
      subjectId: subject.id,
      title: draft.title,
      excerpt: draft.excerpt,
      slug: draft.slug,
      contentHtml,
      metaDescription: draft.metaDescription,
      wordCount: getArticleWordCount(draft),
      status: ArticleStatus.generated,
    },
  });

  try {
    const wordpress = await createDraftPost({
      title: draft.title,
      contentHtml,
      excerpt: draft.excerpt,
      slug: draft.slug,
      metaDescription: draft.metaDescription,
    });

    await prisma.article.update({
      where: { id: article.id },
      data: {
        status: ArticleStatus.draft_published,
        wordpressPostId: wordpress.postId,
      },
    });
  } catch (error) {
    await prisma.article.update({
      where: { id: article.id },
      data: { status: ArticleStatus.publish_failed },
    });
    throw error;
  } finally {
    await markSubjectUsed(subject.id);
  }

  return { skipped: false as const, articleId: article.id, subjectId: subject.id };
}

export async function retryFailedArticlePublish(articleId: string) {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    throw new Error("Article not found");
  }

  if (article.status !== ArticleStatus.publish_failed) {
    throw new Error("Only failed article publishes can be retried");
  }

  const wordpress = await createDraftPost({
    title: article.title,
    contentHtml: article.contentHtml,
    excerpt: article.excerpt,
    slug: article.slug,
    metaDescription: article.metaDescription,
  });

  const updatedArticle = await prisma.article.update({
    where: { id: article.id },
    data: {
      status: ArticleStatus.draft_published,
      wordpressPostId: wordpress.postId,
    },
  });

  await logEvent({
    scope: "content",
    message: `Retried publish for article ${article.id}`,
    details: {
      articleId: article.id,
      wordpressPostId: wordpress.postId,
    },
  });

  return updatedArticle;
}
