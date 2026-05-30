export const runtime = "nodejs";

import { prisma } from "@/lib/db";

export async function GET() {
  const content = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { subject: true },
  });

  return Response.json(content);
}
