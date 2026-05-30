import { AngleType, type Subject, type SitePage } from "@prisma/client";
import {
  INFORMATIONAL_ARTICLE_TEMPLATE,
  PRODUCT_BUYING_GUIDE_TEMPLATE,
  SUBJECT_PROMPT_TEMPLATE,
  loadPromptTemplate,
  renderPromptTemplate,
} from "@/lib/prompt-templates";
import type { ArticleDraft, SubjectDraft } from "@/lib/types";

function buildContextSummary(pages: SitePage[]) {
  return pages
    .map((page) => ({
      url: page.url,
      title: page.title,
      pageType: page.pageType,
      excerpt: page.textContent.slice(0, 300),
    }))
    .slice(0, 20);
}

export async function buildSubjectPrompt({
  pages,
  recentSubjects,
  language,
  minSubjects,
  maxSubjects,
}: {
  pages: SitePage[];
  recentSubjects: Subject[];
  language: string;
  minSubjects: number;
  maxSubjects: number;
}) {
  const template = await loadPromptTemplate(SUBJECT_PROMPT_TEMPLATE);

  return renderPromptTemplate(template, {
    LANGUAGE: language,
    MIN_SUBJECTS: String(minSubjects),
    MAX_SUBJECTS: String(maxSubjects),
    SITE_CONTEXT_JSON: JSON.stringify(buildContextSummary(pages), null, 2),
    RECENT_SUBJECTS_JSON: JSON.stringify(recentSubjects.map((item) => item.title), null, 2),
  }).trim();
}

export async function buildArticlePrompt({
  subject,
  pages,
  language,
}: {
  subject: Subject;
  pages: SitePage[];
  language: string;
}) {
  const template = await loadPromptTemplate(selectArticlePromptTemplate(subject.angleType));

  return renderPromptTemplate(template, {
    LANGUAGE: language,
    SUBJECT_TITLE: subject.title,
    SUBJECT_BRIEF: subject.brief,
    ANGLE_TYPE: subject.angleType,
    SITE_CONTEXT_JSON: JSON.stringify(buildContextSummary(pages), null, 2),
  }).trim();
}

export function selectArticlePromptTemplate(angleType: AngleType) {
  switch (angleType) {
    case AngleType.comparison:
    case AngleType.product_focus:
    case AngleType.listicle:
    return PRODUCT_BUYING_GUIDE_TEMPLATE;
    default:
      return INFORMATIONAL_ARTICLE_TEMPLATE;
  }
}

export function parseSubjectResponse(json: string): SubjectDraft[] {
  const parsed = JSON.parse(json) as { subjects?: SubjectDraft[] };
  if (!Array.isArray(parsed.subjects)) {
    throw new Error("Invalid subject response payload");
  }
  return parsed.subjects;
}

export function parseArticleResponse(json: string): ArticleDraft {
  const parsed = JSON.parse(json) as ArticleDraft;
  if (!parsed.title || !parsed.slug || !parsed.intro || !Array.isArray(parsed.sections)) {
    throw new Error("Invalid article response payload");
  }
  return parsed;
}
