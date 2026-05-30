import { CronExpressionParser } from "cron-parser";

export function getNextCronRun(cronExpression: string, timezone: string, currentDate: Date = new Date()) {
  try {
    return CronExpressionParser.parse(cronExpression, {
      currentDate,
      tz: timezone,
    })
      .next()
      .toDate();
  } catch {
    return null;
  }
}

export function formatScheduledRun(value: Date | null, timezone: string) {
  if (!value) {
    return "Invalid schedule";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone,
  }).format(value);
}
