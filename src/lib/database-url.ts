export const DEFAULT_CONTAINER_DATABASE_URL = "file:/instance/kimiko.db";
export const DEFAULT_LOCAL_DATABASE_URL = "file:./dev.db";

export function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL?.trim()) {
    return process.env.DATABASE_URL;
  }

  return process.env.NODE_ENV === "production" ? DEFAULT_CONTAINER_DATABASE_URL : DEFAULT_LOCAL_DATABASE_URL;
}

export function ensureDatabaseUrlEnv() {
  process.env.DATABASE_URL = resolveDatabaseUrl();
  return process.env.DATABASE_URL;
}
