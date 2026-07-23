import type { Metadata } from "next";

/**
 * The admin UI ships its own styling and must not inherit the marketing
 * site's chrome. Also hard-blocked from search indexes.
 */
export const metadata: Metadata = {
  title: "Editor",
  robots: { index: false, follow: false },
};

export default function KeystaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
