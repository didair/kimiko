export const runtime = "nodejs";

import { SubjectStatus } from "@prisma/client";
import { runArticleGenerationJob } from "@/lib/jobs";
import { deleteSubject, updateSubject } from "@/lib/subjects";

export async function PATCH(request: Request, context: RouteContext<"/api/subjects/[id]">) {
  const { id } = await context.params;
  const body = (await request.json()) as {
    title?: string;
    brief?: string;
    status?: SubjectStatus;
    action?: "generate_article";
  };

  if (body.action === "generate_article") {
    const result = await runArticleGenerationJob(id);
    return Response.json(result);
  }

  const subject = await updateSubject(id, body);
  return Response.json(subject);
}

export async function DELETE(_request: Request, context: RouteContext<"/api/subjects/[id]">) {
  const { id } = await context.params;
  await deleteSubject(id);
  return Response.json({ ok: true });
}
