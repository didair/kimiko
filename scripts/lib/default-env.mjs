export const DEFAULT_CONTAINER_DATABASE_URL = "file:/instance/kimiko.db";
export const DEFAULT_LOCAL_DATABASE_URL = "file:./dev.db";

export function ensureDatabaseUrlEnv(nodeEnv = process.env.NODE_ENV) {
  if (process.env.DATABASE_URL?.trim()) {
    return process.env.DATABASE_URL;
  }

  process.env.DATABASE_URL = nodeEnv === "production" ? DEFAULT_CONTAINER_DATABASE_URL : DEFAULT_LOCAL_DATABASE_URL;
  return process.env.DATABASE_URL;
}
