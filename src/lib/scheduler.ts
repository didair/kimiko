import cron from "node-cron";
import { getConfig } from "@/lib/config";
import { logEvent } from "@/lib/logger";
import { runArticleGenerationJob, runCrawlJob, runSubjectGenerationJob } from "@/lib/jobs";

let started = false;

export function startScheduler() {
  if (started) {
    return;
  }

  started = true;

  const config = getConfig();
  cron.schedule(
    config.CRON_CRAWL,
    async () => {
      await runCrawlJob();
    },
    { timezone: config.TIMEZONE },
  );
  cron.schedule(
    config.CRON_SUBJECTS,
    async () => {
      await runSubjectGenerationJob();
    },
    { timezone: config.TIMEZONE },
  );
  cron.schedule(
    config.CRON_ARTICLE,
    async () => {
      await runArticleGenerationJob();
    },
    { timezone: config.TIMEZONE },
  );

  void logEvent({
    scope: "scheduler",
    message: "Scheduler started",
    details: {
      crawl: config.CRON_CRAWL,
      subjects: config.CRON_SUBJECTS,
      article: config.CRON_ARTICLE,
      timezone: config.TIMEZONE,
    },
  });
}
