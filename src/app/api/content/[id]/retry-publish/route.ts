export const runtime = "nodejs";

import { retryFailedArticlePublish } from "@/lib/articles";

export async function POST(_request: Request, context: RouteContext<"/api/content/[id]/retry-publish">) {
  try {
    const { id } = await context.params;
    const article = await retryFailedArticlePublish(id);
    return Response.json(article);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Retry publish failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
