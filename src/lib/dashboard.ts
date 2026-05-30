import { prisma } from "@/lib/db";
import { getMaskedConfig } from "@/lib/config";

export async function getDashboardData() {
  const [queuedSubjects, usedSubjects, failedArticles, recentRuns, recentArticles] = await Promise.all([
    prisma.subject.count({ where: { status: "queued" } }),
    prisma.subject.count({ where: { status: "used" } }),
    prisma.article.count({ where: { status: "publish_failed" } }),
    prisma.jobRun.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { subject: true },
    }),
  ]);

  return {
    queuedSubjects,
    usedSubjects,
    failedArticles,
    recentRuns,
    recentArticles,
  };
}

export async function getSettingsData() {
  return getMaskedConfig();
}
