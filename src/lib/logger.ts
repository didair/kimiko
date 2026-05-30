import { LogLevel } from "@prisma/client";
import { prisma } from "@/lib/db";

type LogInput = {
  level?: LogLevel;
  scope: string;
  message: string;
  details?: unknown;
};

export async function logEvent({
  level = LogLevel.info,
  scope,
  message,
  details,
}: LogInput) {
  const payload = {
    level,
    scope,
    message,
    detailsJson: details ? JSON.stringify(details) : null,
  };

  console[level === LogLevel.error ? "error" : level === LogLevel.warn ? "warn" : "log"](
    `[${scope}] ${message}`,
    details ?? "",
  );

  try {
    await prisma.appLog.create({ data: payload });
  } catch (error) {
    console.error("[logger] failed to persist log", error);
  }
}
