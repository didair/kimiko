export const runtime = "nodejs";

import { prisma } from "@/lib/db";

export async function GET() {
  const runs = await prisma.jobRun.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return Response.json(runs);
}
