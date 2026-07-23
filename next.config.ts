import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /*
   * The site answers on both transfer4engr.com and transfer4engr.vercel.app.
   * Serving identical content at two origins splits ranking signals, so send
   * the Vercel origin to the custom domain permanently.
   *
   * Preview deployments use their own *-git-*.vercel.app hostnames and are
   * unaffected by this exact-host match.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "transfer4engr.vercel.app" }],
        destination: "https://transfer4engr.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
