import { Agent, fetch as undiciFetch } from "undici";
import { getConfig } from "@/lib/config";

export type DraftPostInput = {
  title: string;
  contentHtml: string;
  excerpt: string;
  slug: string;
  metaDescription: string;
};

export async function createDraftPost(input: DraftPostInput) {
  const config = getConfig();
  const url = new URL("/wp-json/wp/v2/posts", config.WORDPRESS_URL);
  const credentials = Buffer.from(`${config.WORDPRESS_USERNAME}:${config.WORDPRESS_APP_PASSWORD}`).toString("base64");
  const dispatcher =
    config.WORDPRESS_ALLOW_INSECURE_TLS && url.protocol === "https:"
      ? new Agent({
          connect: {
            rejectUnauthorized: false,
          },
        })
      : undefined;

  const response = await undiciFetch(url, {
    method: "POST",
    dispatcher,
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: input.title,
      content: input.contentHtml,
      excerpt: input.excerpt,
      slug: input.slug,
      status: "draft",
      meta: {
        description: input.metaDescription,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`WordPress request failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as { id: number; link?: string; status: string };

  return {
    postId: data.id,
    editLink: data.link,
    status: data.status,
  };
}
