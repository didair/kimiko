export const runtime = "nodejs";

import { runArticleGenerationJob } from "@/lib/jobs";

export async function POST(request: Request) {
  let body: { subjectId?: string } = {};
  try {
    body = (await request.json()) as { subjectId?: string };
  } catch {
    body = {};
  }

  return Response.json(await runArticleGenerationJob(body.subjectId));
}
