import { z } from "zod";
import { resolveDatabaseUrl } from "@/lib/database-url";
import { maskSecret } from "@/lib/utils";

const schema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.string().min(1).default(resolveDatabaseUrl()),
    SITE_URL: z.url(),
    WORDPRESS_URL: z.url(),
    WORDPRESS_USERNAME: z.string().min(1),
    WORDPRESS_APP_PASSWORD: z.string().min(1),
    WORDPRESS_ALLOW_INSECURE_TLS: z.string().optional(),
    OPENAI_API_KEY: z.string().min(1),
    OPENAI_MODEL: z.string().min(1),
    OPENAI_BASE_URL: z.url().optional(),
    TIMEZONE: z.string().default("UTC"),
    CRON_CRAWL: z.string().default("0 1 * * *"),
    CRON_SUBJECTS: z.string().default("0 2 * * *"),
    CRON_ARTICLE: z.string().default("0 3 * * *"),
    SUBJECTS_PER_DAY_MIN: z.coerce.number().int().min(1).max(10).default(1),
    SUBJECTS_PER_DAY_MAX: z.coerce.number().int().min(1).max(10).default(3),
    MAX_ACTIVE_SUBJECTS: z.coerce.number().int().min(1).max(1000).default(50),
    MAX_CRAWL_PAGES: z.coerce.number().int().min(1).max(1000).default(200),
    MAX_CONTEXT_PRODUCTS: z.coerce.number().int().min(1).max(200).default(50),
    MAX_CONTEXT_PAGES: z.coerce.number().int().min(1).max(200).default(50),
    ENABLE_ROBOTS_TXT: z
      .string()
      .optional()
      .transform((value) => value === "true"),
    DEFAULT_ARTICLE_LANGUAGE: z.string().default("en"),
    LOG_RETENTION_DAYS: z.coerce.number().int().min(1).max(365).default(30),
  })
  .superRefine((value, ctx) => {
    if (value.SUBJECTS_PER_DAY_MIN > value.SUBJECTS_PER_DAY_MAX) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "SUBJECTS_PER_DAY_MIN cannot be greater than SUBJECTS_PER_DAY_MAX",
        path: ["SUBJECTS_PER_DAY_MIN"],
      });
    }
  });

type ParsedConfig = Omit<z.infer<typeof schema>, "WORDPRESS_ALLOW_INSECURE_TLS"> & {
  WORDPRESS_ALLOW_INSECURE_TLS: boolean;
};

export type AppConfig = ParsedConfig;

let cachedConfig: ParsedConfig | null = null;

function stripEnvQuotes(value: string) {
  const trimmed = value.trim();
  const first = trimmed.at(0);
  const last = trimmed.at(-1);

  if ((first === `"` && last === `"`) || (first === "'" && last === "'")) {
    return trimmed.slice(1, -1);
  }

  return value;
}

function normalizeEnv(env: NodeJS.ProcessEnv) {
  return Object.fromEntries(
    Object.entries(env).map(([key, value]) => [key, typeof value === "string" ? stripEnvQuotes(value) : value]),
  );
}

export function getConfig(): ParsedConfig {
  if (!cachedConfig) {
    const parsed = schema.parse(normalizeEnv(process.env));
    cachedConfig = {
      ...parsed,
      WORDPRESS_ALLOW_INSECURE_TLS:
        parsed.WORDPRESS_ALLOW_INSECURE_TLS === undefined
          ? parsed.NODE_ENV === "development"
          : parsed.WORDPRESS_ALLOW_INSECURE_TLS === "true",
    };
  }

  return cachedConfig;
}

export function getMaskedConfig() {
  const config = getConfig();

  return {
    ...config,
    WORDPRESS_APP_PASSWORD: maskSecret(config.WORDPRESS_APP_PASSWORD),
    OPENAI_API_KEY: maskSecret(config.OPENAI_API_KEY),
  };
}

export function resetConfigForTests() {
  cachedConfig = null;
}
