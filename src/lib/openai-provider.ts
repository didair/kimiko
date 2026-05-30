import OpenAI from "openai";
import { AngleType } from "@prisma/client";
import { getConfig } from "@/lib/config";
import { buildArticlePrompt, buildSubjectPrompt, parseArticleResponse, parseSubjectResponse } from "@/lib/prompts";
import type { ArticleDraft, SubjectDraft } from "@/lib/types";
import type { SitePage, Subject } from "@prisma/client";

const angleTypes = new Set(Object.values(AngleType));

export class OpenAIProvider {
  private client: OpenAI;
  private model: string;

  constructor() {
    const config = getConfig();
    this.client = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
      baseURL: config.OPENAI_BASE_URL,
    });
    this.model = config.OPENAI_MODEL;
  }

  async generateSubjects({
    pages,
    recentSubjects,
  }: {
    pages: SitePage[];
    recentSubjects: Subject[];
  }): Promise<SubjectDraft[]> {
    const config = getConfig();
    const prompt = await buildSubjectPrompt({
      pages,
      recentSubjects,
      language: config.DEFAULT_ARTICLE_LANGUAGE,
      minSubjects: config.SUBJECTS_PER_DAY_MIN,
      maxSubjects: config.SUBJECTS_PER_DAY_MAX,
    });
    const response = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Model returned empty subject response");
    }

    return parseSubjectResponse(content).filter((subject) => angleTypes.has(subject.angleType));
  }

  async generateArticle({
    subject,
    pages,
  }: {
    subject: Subject;
    pages: SitePage[];
  }): Promise<ArticleDraft> {
    const config = getConfig();
    const prompt = await buildArticlePrompt({
      subject,
      pages,
      language: config.DEFAULT_ARTICLE_LANGUAGE,
    });
    const response = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Model returned empty article response");
    }

    return parseArticleResponse(content);
  }
}
