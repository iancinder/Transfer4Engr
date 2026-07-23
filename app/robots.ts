import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Served at /robots.txt. Allows everything except the future Keystatic admin
 * routes, and points crawlers at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/keystatic", "/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
