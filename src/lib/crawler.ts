import crypto from "node:crypto";
import * as cheerio from "cheerio";
import { XMLParser } from "fast-xml-parser";
import { PageType } from "@prisma/client";
import { getConfig } from "@/lib/config";
import { normalizeWhitespace } from "@/lib/utils";
import type { CrawlPage } from "@/lib/types";

const parser = new XMLParser({ ignoreAttributes: false });

const EXCLUDED_SEGMENTS = ["cart", "checkout", "account", "login", "search"];

export async function crawlSite() {
  const config = getConfig();
  const siteUrl = new URL(config.SITE_URL);
  const queue = await discoverUrls(siteUrl);
  const visited = new Set<string>();
  const pages: CrawlPage[] = [];

  while (queue.length > 0 && visited.size < config.MAX_CRAWL_PAGES) {
    const currentUrl = queue.shift();
    if (!currentUrl || visited.has(currentUrl)) {
      continue;
    }

    visited.add(currentUrl);

    try {
      const response = await fetch(currentUrl);
      if (!response.ok) {
        continue;
      }

      const html = await response.text();
      const extracted = extractPage(currentUrl, html);
      pages.push(extracted);

      const $ = cheerio.load(html);
      $("a[href]").each((_, element) => {
        const href = $(element).attr("href");
        if (!href) {
          return;
        }
        const normalized = normalizeUrl(href, siteUrl);
        if (normalized && !visited.has(normalized) && queue.length < config.MAX_CRAWL_PAGES * 2) {
          queue.push(normalized);
        }
      });
    } catch {
      continue;
    }
  }

  return pages;
}

async function discoverUrls(siteUrl: URL) {
  const sitemapUrl = new URL("/sitemap.xml", siteUrl).toString();

  try {
    const response = await fetch(sitemapUrl);
    if (response.ok) {
      const xml = await response.text();
      const parsed = parser.parse(xml) as {
        urlset?: {
          url?: Array<{ loc?: string }> | { loc?: string };
        };
      };

      const urls = parsed.urlset?.url;
      if (urls) {
        const records = Array.isArray(urls) ? urls : [urls];
        return records
          .map((record) => record.loc)
          .filter((value): value is string => Boolean(value))
          .map((url) => normalizeUrl(url, siteUrl))
          .filter((value): value is string => Boolean(value));
      }
    }
  } catch {
    // Fall back to homepage link extraction.
  }

  try {
    const response = await fetch(siteUrl);
    const html = await response.text();
    const $ = cheerio.load(html);
    const urls = new Set<string>([siteUrl.toString()]);
    $("a[href]").each((_, element) => {
      const href = $(element).attr("href");
      if (!href) {
        return;
      }
      const normalized = normalizeUrl(href, siteUrl);
      if (normalized) {
        urls.add(normalized);
      }
    });
    return [...urls];
  } catch {
    return [siteUrl.toString()];
  }
}

function normalizeUrl(value: string, siteUrl: URL) {
  try {
    const url = new URL(value, siteUrl);
    if (url.origin !== siteUrl.origin) {
      return null;
    }

    if (EXCLUDED_SEGMENTS.some((segment) => url.pathname.toLowerCase().includes(segment))) {
      return null;
    }

    url.hash = "";
    url.search = "";
    return url.toString();
  } catch {
    return null;
  }
}

function extractPage(url: string, html: string): CrawlPage {
  const $ = cheerio.load(html);
  const title = normalizeWhitespace($("title").first().text() || $("h1").first().text() || url);
  const metaDescription = normalizeWhitespace($('meta[name="description"]').attr("content") || "");
  const headings = $("h1, h2, h3")
    .toArray()
    .map((element) => normalizeWhitespace($(element).text()))
    .filter(Boolean)
    .slice(0, 15);

  const textContent = normalizeWhitespace(
    $("main, article, body")
      .first()
      .text()
      .slice(0, 10000),
  );

  const contentHash = crypto.createHash("sha256").update(`${title}|${metaDescription}|${textContent}`).digest("hex");

  return {
    url,
    pageType: classifyPage(url, html, textContent),
    title,
    metaDescription: metaDescription || undefined,
    headings,
    textContent,
    contentHash,
  };
}

function classifyPage(url: string, html: string, textContent: string) {
  const value = `${url} ${html} ${textContent}`.toLowerCase();

  if (
    /add to cart|buy now|sku|kr|€|\$|product|variant|out of stock|in stock/.test(value) ||
    value.includes('"@type":"product"')
  ) {
    return PageType.product;
  }

  if (/guide|blog|tips|learn|how to|article/.test(value)) {
    return PageType.content;
  }

  return PageType.other;
}
