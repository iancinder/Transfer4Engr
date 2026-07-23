import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";

/**
 * Read-side access to the blog collection.
 *
 * The reader hits the local filesystem, so every call here resolves at build
 * time and each post is prerendered as static HTML. Keystatic's GitHub
 * storage only affects *writing* — published content is always committed to
 * the repo and therefore present in the deployment bundle.
 */
const reader = createReader(process.cwd(), keystaticConfig);

export type PostSummary = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string | null;
  coverImage: string | null;
  coverAlt: string;
};

/** Average adult reading speed for prose; good enough for a "5 min read" chip. */
const WORDS_PER_MINUTE = 225;

type MarkdocNode = { type: string; attributes?: Record<string, unknown>; children?: MarkdocNode[] };

/** Flattens a Markdoc tree to its text content. */
function textOf(node: MarkdocNode): string {
  if (node.type === "text") return String(node.attributes?.content ?? "");
  return (node.children ?? []).map(textOf).join(" ");
}

function readingTimeMinutes(node: MarkdocNode): number {
  const words = textOf(node).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/**
 * Drafts stay visible on localhost so you can preview before publishing, but
 * are never built into production, the sitemap, or search results.
 */
const SHOW_DRAFTS = process.env.NODE_ENV === "development";

/** Newest first. */
export async function getPublishedPosts(): Promise<PostSummary[]> {
  const entries = await reader.collections.posts.all();

  return entries
    .filter((entry) => SHOW_DRAFTS || !entry.entry.draft)
    .map((entry) => ({
      slug: entry.slug,
      title: entry.entry.title,
      description: entry.entry.description,
      publishedAt: entry.entry.publishedAt,
      updatedAt: entry.entry.updatedAt,
      coverImage: entry.entry.coverImage,
      coverAlt: entry.entry.coverAlt ?? "",
    }))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** Returns null for unknown or draft slugs so routes can call notFound(). */
export async function getPost(slug: string) {
  const entry = await reader.collections.posts.read(slug);
  if (!entry || (entry.draft && !SHOW_DRAFTS)) return null;

  const { node } = await entry.content();

  return {
    slug,
    title: entry.title,
    description: entry.description,
    publishedAt: entry.publishedAt,
    updatedAt: entry.updatedAt,
    coverImage: entry.coverImage,
    coverAlt: entry.coverAlt ?? "",
    readingTime: readingTimeMinutes(node as unknown as MarkdocNode),
    node,
  };
}

/** Formats an ISO date as e.g. "July 22, 2026", pinned to UTC. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
