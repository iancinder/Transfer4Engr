import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Transfer4Engr — Transfer into the engineering program you deserve",
  description:
    "One-on-one transfer admissions consulting for engineering students, from someone who just made the jump himself. Essay reviews, freshman-year strategy, and full application support.",
  openGraph: {
    title: "Transfer4Engr",
    description:
      "Transfer admissions consulting for engineering students — essay reviews, freshman-year strategy, and full application support.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
