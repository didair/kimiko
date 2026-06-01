import { JobType, RunStatus } from "@prisma/client";
import { crawlSite } from "@/lib/crawler";
import { persistCrawlPages, getPromptContextPages } from "@/lib/context";
import { prisma } from "@/lib/db";
import { getConfig } from "@/lib/config";
import { logEvent } from "@/lib/logger";
import { OpenAIProvider } from "@/lib/openai-provider";
import { appendGeneratedSubjects } from "@/lib/subjects";
import { generateArticleForSubject } from "@/lib/articles";

const activeJobs = new Set<JobType>();

export async function runCrawlJob() {
  return runJob(JobType.crawl, async () => {
    const pages = await crawlSite();
    await persistCrawlPages(pages);
    return {
      summary: `Crawled ${pages.length} pages`,
      details: { count: pages.length },
      status: RunStatus.success,
    };
  });
}

export async function runSubjectGenerationJob() {
  return runJob(JobType.subjects, async () => {
    const config = getConfig();
    const activeSubjects = await prisma.subject.count({
      where: { status: "queued" },
    });

    if (activeSubjects >= config.MAX_ACTIVE_SUBJECTS) {
      return {
        summary: `Skipped subject generation because ${activeSubjects} active subjects meets the limit of ${config.MAX_ACTIVE_SUBJECTS}`,
        details: {
          activeSubjects,
          maxActiveSubjects: config.MAX_ACTIVE_SUBJECTS,
        },
        status: RunStatus.partial,
      };
    }

    const provider = new OpenAIProvider();
    const pages = await getPromptContextPages();
    const recentSubjects = await prisma.subject.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    const drafts = await provider.generateSubjects({ pages, recentSubjects });
    const inserted = await appendGeneratedSubjects(drafts);
    return {
      summary: `Added ${inserted.length} subjects`,
      details: { generated: drafts.length, inserted: inserted.length },
      status: RunStatus.success,
    };
  });
}

export async function runArticleGenerationJob(subjectId?: string) {
  return runJob(JobType.article, async () => {
    const result = await generateArticleForSubject(subjectId);
    if (result.skipped) {
      return {
        summary: result.reason,
        details: result,
        status: RunStatus.partial,
      };
    }

    return {
      summary: `Generated article ${result.articleId}`,
      details: result,
      status: RunStatus.success,
    };
  });
}

async function runJob(jobType: JobType, task: () => Promise<{ summary: string; details?: Record<string, unknown>; status: RunStatus }>) {
  if (activeJobs.has(jobType)) {
    await logEvent({
      level: "warn",
      scope: "jobs",
      message: `Skipped overlapping ${jobType} job`,
    });
    return { skipped: true };
  }

  activeJobs.add(jobType);

  const run = await prisma.jobRun.create({
    data: {
      jobType,
      status: RunStatus.partial,
      startedAt: new Date(),
      summary: `${jobType} started`,
    },
  });

  try {
    const result = await task();
    await prisma.jobRun.update({
      where: { id: run.id },
      data: {
        status: result.status,
        summary: result.summary,
        detailsJson: result.details ? JSON.stringify(result.details) : null,
        finishedAt: new Date(),
      },
    });
    await prisma.appState.upsert({
      where: { key: `last_${jobType}_run` },
      update: { value: new Date().toISOString() },
      create: { key: `last_${jobType}_run`, value: new Date().toISOString() },
    });
    await logEvent({
      scope: "jobs",
      message: result.summary,
      details: result.details,
    });

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown job failure";
    await prisma.jobRun.update({
      where: { id: run.id },
      data: {
        status: RunStatus.failed,
        summary: message,
        detailsJson: JSON.stringify({
          error: message,
        }),
        finishedAt: new Date(),
      },
    });
    await logEvent({
      level: "error",
      scope: "jobs",
      message,
    });
    throw error;
  } finally {
    activeJobs.delete(jobType);
  }
}
