import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getPublishedPosts } from "@/lib/posts";

/**
 * Served at /sitemap.xml. Published posts are appended automatically, so
 * publishing from Keystatic updates the sitemap with no code change.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const posts = await getPublishedPosts();

  return [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/assessment"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: posts[0]
        ? new Date(`${posts[0].publishedAt}T00:00:00Z`)
        : lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(
        `${post.updatedAt ?? post.publishedAt}T00:00:00Z`,
      ),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
