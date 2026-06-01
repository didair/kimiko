import sanitizeHtml from "sanitize-html";
import type { ArticleDraft } from "@/lib/types";
import { countWords } from "@/lib/utils";

export function renderArticleHtml(article: ArticleDraft) {
  const sections = article.sections
    .map((section) => `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.body)}</p></section>`)
    .join("");

  return sanitizeHtml(
    `<article>
      <p>${escapeHtml(article.intro)}</p>
      ${sections}
    </article>`,
    {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["section", "h2"]),
    },
  );
}

export function getArticleWordCount(article: ArticleDraft) {
  return countWords(
    [article.title, article.excerpt, article.intro, article.conclusion ?? "", ...article.sections.flatMap((section) => [section.heading, section.body])].join(
      " ",
    ),
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
