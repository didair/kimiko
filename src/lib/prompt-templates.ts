import { readFile } from "node:fs/promises";
import path from "node:path";

const promptCache = new Map<string, string>();

export const SUBJECT_PROMPT_TEMPLATE = "subject-generation";
export const INFORMATIONAL_ARTICLE_TEMPLATE = "article-informational";
export const PRODUCT_BUYING_GUIDE_TEMPLATE = "article-product-buying-guide";

export async function loadPromptTemplate(name: string) {
  const cached = promptCache.get(name);
  if (cached) {
    return cached;
  }

  const filePath = path.join(process.cwd(), "prompts", `${name}.md`);
  const template = await readFile(filePath, "utf8");
  promptCache.set(name, template);
  return template;
}

export function renderPromptTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_match, key: string) => values[key] ?? "");
}

export function resetPromptTemplateCacheForTests() {
  promptCache.clear();
}
