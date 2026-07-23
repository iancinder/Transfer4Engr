import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import StructuredData from "@/components/StructuredData";

/** Body + headline sans. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/** Mono — labels, prices, badges, small print. */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

const OG_DESCRIPTION =
  "Transfer admissions consulting for engineering students — essay reviews, freshman-year strategy, and full application support.";

export const metadata: Metadata = {
  /* Makes every relative canonical/OG URL below resolve to the real origin. */
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Transfer4Engr — Transfer into the engineering program you deserve",
    /* Child pages supply only their own title; this appends the brand. */
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_NAME,
    description: OG_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: OG_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body>
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
