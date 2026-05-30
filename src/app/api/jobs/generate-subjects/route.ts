export const runtime = "nodejs";

import { runSubjectGenerationJob } from "@/lib/jobs";

export async function POST() {
  return Response.json(await runSubjectGenerationJob());
}
