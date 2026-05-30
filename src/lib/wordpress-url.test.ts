import { describe, expect, it } from "vitest";
import { getWordPressEditUrl } from "./wordpress-url";

describe("getWordPressEditUrl", () => {
  it("builds a WordPress edit url", () => {
    expect(getWordPressEditUrl("https://homio.test", 1818)).toBe("https://homio.test/wp-admin/post.php?post=1818&action=edit");
  });

  it("handles a trailing slash", () => {
    expect(getWordPressEditUrl("https://homio.test/", 1818)).toBe("https://homio.test/wp-admin/post.php?post=1818&action=edit");
  });
});
