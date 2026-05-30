import { PageType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getConfig } from "@/lib/config";
import type { CrawlPage } from "@/lib/types";

export async function persistCrawlPages(pages: CrawlPage[]) {
  for (const page of pages) {
    const existing = await prisma.sitePage.findUnique({ where: { url: page.url } });

    if (existing?.contentHash === page.contentHash) {
      await prisma.sitePage.update({
        where: { url: page.url },
        data: {
          lastCrawledAt: new Date(),
        },
      });
      continue;
    }

    await prisma.sitePage.upsert({
      where: { url: page.url },
      update: {
        pageType: page.pageType,
        title: page.title,
        metaDescription: page.metaDescription,
        headingsJson: JSON.stringify(page.headings),
        textContent: page.textContent,
        contentHash: page.contentHash,
        lastCrawledAt: new Date(),
      },
      create: {
        url: page.url,
        pageType: page.pageType,
        title: page.title,
        metaDescription: page.metaDescription,
        headingsJson: JSON.stringify(page.headings),
        textContent: page.textContent,
        contentHash: page.contentHash,
        lastCrawledAt: new Date(),
      },
    });
  }
}

export async function getPromptContextPages() {
  const config = getConfig();
  const products = await prisma.sitePage.findMany({
    where: { pageType: PageType.product },
    orderBy: { lastCrawledAt: "desc" },
    take: config.MAX_CONTEXT_PRODUCTS,
  });
  const content = await prisma.sitePage.findMany({
    where: { pageType: { not: PageType.product } },
    orderBy: { lastCrawledAt: "desc" },
    take: config.MAX_CONTEXT_PAGES,
  });

  return [...products, ...content];
}
