/**
 * Single source of truth for canonical site identity.
 *
 * Everything SEO-facing (metadataBase, canonicals, sitemap, robots, JSON-LD)
 * reads from here, so the production origin is defined exactly once.
 *
 * `NEXT_PUBLIC_SITE_URL` lets preview deployments describe themselves
 * correctly; production falls back to the custom domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://transfer4engr.com"
).replace(/\/$/, "");

export const SITE_NAME = "Transfer4Engr";

export const SITE_DESCRIPTION =
  "One-on-one transfer admissions consulting for engineering students, from someone who just made the jump himself. Essay reviews, freshman-year strategy, and full application support.";

export const CONTACT_EMAIL = "iansendelbach@gmail.com";

/** Absolute URL for a root-relative path — required for canonicals and sitemaps. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
