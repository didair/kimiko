import { describe, expect, it } from "vitest";
import { AngleType } from "@prisma/client";
import { parseArticleResponse, parseSubjectResponse, selectArticlePromptTemplate } from "./prompts";
import { INFORMATIONAL_ARTICLE_TEMPLATE, PRODUCT_BUYING_GUIDE_TEMPLATE } from "./prompt-templates";

describe("prompt parsers", () => {
  it("parses subject payload", () => {
    expect(
      parseSubjectResponse(
        JSON.stringify({
          subjects: [{ title: "A", brief: "B", angleType: "guide" }],
        }),
      ),
    ).toHaveLength(1);
  });

  it("parses article payload", () => {
    expect(
      parseArticleResponse(
        JSON.stringify({
          title: "A",
          excerpt: "B",
          slug: "a",
          intro: "intro",
          sections: [{ heading: "H", body: "Body" }],
          conclusion: "Done",
          metaDescription: "Meta",
          productMentions: [],
        }),
      ).title,
    ).toBe("A");
  });

  it("selects product buying guide template for product-led angles", () => {
    expect(selectArticlePromptTemplate(AngleType.product_focus)).toBe(PRODUCT_BUYING_GUIDE_TEMPLATE);
    expect(selectArticlePromptTemplate(AngleType.listicle)).toBe(PRODUCT_BUYING_GUIDE_TEMPLATE);
  });

  it("selects informational template for educational angles", () => {
    expect(selectArticlePromptTemplate(AngleType.guide)).toBe(INFORMATIONAL_ARTICLE_TEMPLATE);
    expect(selectArticlePromptTemplate(AngleType.educational)).toBe(INFORMATIONAL_ARTICLE_TEMPLATE);
  });
});
