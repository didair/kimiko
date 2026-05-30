import sanitizeHtml from "sanitize-html";
import type { ArticleDraft } from "@/lib/types";
import { countWords } from "@/lib/utils";

export function renderArticleHtml(article: ArticleDraft) {
  const sections = article.sections
    .map((section) => `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.body)}</p></section>`)
    .join("");

  const mentions =
    article.productMentions.length > 0
      ? `<section><h2>Relevant products</h2><ul>${article.productMentions
          .map(
            (mention) =>
              `<li><a href="${escapeAttribute(mention.url)}">${escapeHtml(mention.name)}</a>: ${escapeHtml(mention.reason)}</li>`,
          )
          .join("")}</ul></section>`
      : "";

  return sanitizeHtml(
    `<article>
      <p>${escapeHtml(article.intro)}</p>
      ${sections}
      ${mentions}
      <section><h2>Conclusion</h2><p>${escapeHtml(article.conclusion)}</p></section>
    </article>`,
    {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["section", "h2"]),
      allowedAttributes: {
        a: ["href"],
      },
    },
  );
}

export function getArticleWordCount(article: ArticleDraft) {
  return countWords(
    [article.title, article.excerpt, article.intro, article.conclusion, ...article.sections.flatMap((section) => [section.heading, section.body])].join(
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

function escapeAttribute(value: string) {
  return escapeHtml(value);
}
