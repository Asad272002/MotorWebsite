import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const storagePattern = supabaseUrl ? new URL("/storage/v1/object/public/**", supabaseUrl) : null;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactCompiler: true,
  // Product metadata is database-backed and otherwise streams into <body> for
  // regular browser user agents. Keep it in the initial <head> so Lighthouse,
  // social preview tools, and HTML-only crawlers receive the same SEO markup.
  htmlLimitedBots: /.*/,
  images: {
    remotePatterns: storagePattern ? [{ protocol: storagePattern.protocol.replace(":", "") as "http" | "https", hostname: storagePattern.hostname, port: storagePattern.port, pathname: storagePattern.pathname }] : [],
  },
  async headers() {
    const noStoreHeaders = [
      { key: "Cache-Control", value: "private, no-store, max-age=0, must-revalidate" },
    ];

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
      { source: "/admin/:path*", headers: noStoreHeaders },
      { source: "/api/:path*", headers: noStoreHeaders },
    ];
  },
};

export default nextConfig;
