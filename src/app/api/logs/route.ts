export const runtime = "nodejs";

import { LogLevel } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const scope = url.searchParams.get("scope");
  const level = url.searchParams.get("level");
  const resolvedLevel = level && Object.values(LogLevel).includes(level as LogLevel) ? (level as LogLevel) : undefined;
  const logs = await prisma.appLog.findMany({
    where: {
      scope: scope || undefined,
      level: resolvedLevel,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return Response.json(logs);
}
