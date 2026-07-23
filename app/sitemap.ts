import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Served at /sitemap.xml. Static routes only for now — blog posts get
 * appended here once the content collection exists.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

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
  ];
}
