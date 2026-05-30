import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {},
}));
import { dedupeGeneratedSubjects } from "./subjects";

describe("subject dedupe", () => {
  it("drops duplicate titles", () => {
    const result = dedupeGeneratedSubjects([
      { title: "Hello", brief: "One", angleType: "guide" },
      { title: " hello ", brief: "Two", angleType: "comparison" },
    ]);

    expect(result).toHaveLength(1);
  });
});
