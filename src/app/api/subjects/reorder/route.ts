export const runtime = "nodejs";

import { reorderSubjects } from "@/lib/subjects";

export async function POST(request: Request) {
  const body = (await request.json()) as { ids: string[] };
  await reorderSubjects(body.ids);
  return Response.json({ ok: true });
}
