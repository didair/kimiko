import { describe, expect, it } from "vitest";
import { getSiteLabel } from "./site-label";

describe("getSiteLabel", () => {
  it("extracts the registrable name from a standard domain", () => {
    expect(getSiteLabel("https://homio.se/")).toBe("homio");
  });

  it("ignores www", () => {
    expect(getSiteLabel("https://www.homio.se/shop")).toBe("homio");
  });

  it("handles common second-level domains", () => {
    expect(getSiteLabel("https://shop.example.co.uk")).toBe("example");
  });
});
