export const runtime = "nodejs";

import { runCrawlJob } from "@/lib/jobs";

export async function POST() {
  return Response.json(await runCrawlJob());
}
