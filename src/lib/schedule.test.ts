import { describe, expect, it } from "vitest";
import { formatScheduledRun, getNextCronRun } from "./schedule";

describe("schedule helpers", () => {
  it("computes the next daily run in the configured timezone", () => {
    const nextRun = getNextCronRun("0 1 * * *", "Europe/Stockholm", new Date("2026-05-31T12:00:00.000Z"));

    expect(nextRun?.toISOString()).toBe("2026-05-31T23:00:00.000Z");
  });

  it("returns null for invalid cron expressions", () => {
    expect(getNextCronRun("not cron", "Europe/Stockholm", new Date("2026-05-31T12:00:00.000Z"))).toBeNull();
  });

  it("formats a scheduled run in the configured timezone", () => {
    expect(formatScheduledRun(new Date("2026-05-31T23:00:00.000Z"), "Europe/Stockholm")).toContain("01:00");
  });
});
