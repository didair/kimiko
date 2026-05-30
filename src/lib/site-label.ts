const COMMON_SECOND_LEVEL_DOMAINS = new Set(["co", "com", "net", "org"]);

export function getSiteLabel(siteUrl: string) {
  const hostname = new URL(siteUrl).hostname.replace(/^www\./, "");
  const parts = hostname.split(".").filter(Boolean);

  if (parts.length >= 3 && COMMON_SECOND_LEVEL_DOMAINS.has(parts.at(-2) ?? "")) {
    return parts.at(-3) ?? hostname;
  }

  return parts.at(-2) ?? parts[0] ?? hostname;
}
