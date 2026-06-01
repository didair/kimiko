import type { AngleType, JobType, PageType } from "@prisma/client";

export type SubjectDraft = {
  title: string;
  brief: string;
  angleType: AngleType;
};

export type ArticleDraftSection = {
  heading: string;
  body: string;
};

export type ArticleDraft = {
  title: string;
  excerpt: string;
  slug: string;
  intro: string;
  sections: ArticleDraftSection[];
  conclusion?: string;
  metaDescription: string;
  productMentions: Array<{
    name: string;
    url: string;
    reason: string;
  }>;
};

export type CrawlPage = {
  url: string;
  pageType: PageType;
  title: string;
  metaDescription?: string;
  headings: string[];
  textContent: string;
  contentHash: string;
};

export type ContextSnippet = {
  url: string;
  title: string;
  pageType: PageType;
  excerpt: string;
};

export type JobResult = {
  jobType: JobType;
  summary: string;
  details?: Record<string, unknown>;
  status?: "success" | "failed" | "partial";
};
