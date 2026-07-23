import { ImageResponse } from "next/og";
import { getPost } from "@/lib/posts";

export const alt = "Transfer4Engr blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Per-post social sharing card, generated at build time.
 *
 * Uses the site's palette but system fonts — embedding Inter would mean
 * shipping a font binary purely for this, and the card reads as on-brand
 * from the colors and layout alone.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  const title = post?.title ?? "Transfer4Engr";
  const description = post?.description ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#fffbf8",
          padding: "72px",
          /* Plum rule down the left edge — the site's single accent. */
          borderLeft: "16px solid #7c2a4b",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 24,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8a7f86",
            }}
          >
            Transfer4Engr
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: title.length > 70 ? 58 : 68,
              fontWeight: 600,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              color: "#2e262b",
              /* Long titles clamp rather than overflow the card. */
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderTop: "1px solid #eedde2",
            paddingTop: 28,
          }}
        >
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.4,
              color: "#6b6067",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </div>
          <div style={{ marginTop: 20, fontSize: 24, color: "#7c2a4b" }}>
            transfer4engr.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
