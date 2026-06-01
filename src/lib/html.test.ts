import { describe, expect, it } from "vitest";
import { renderArticleHtml } from "./html";

describe("article html rendering", () => {
  it("does not append product mention or conclusion sections", () => {
    const html = renderArticleHtml({
      title: "Title",
      excerpt: "Excerpt",
      slug: "title",
      intro: "Intro",
      sections: [{ heading: "Useful next step", body: "Do this next." }],
      conclusion: "Legacy conclusion",
      metaDescription: "Meta",
      productMentions: [{ name: "Product", url: "https://example.com/product", reason: "Relevant" }],
    });

    expect(html).toContain("Useful next step");
    expect(html).not.toContain("Relevant products");
    expect(html).not.toContain("Legacy conclusion");
    expect(html).not.toContain("Product");
  });
});
