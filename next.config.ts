import withBundleAnalyzer from "@next/bundle-analyzer"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  experimental: {
    viewTransition: true,
    optimizePackageImports: [
      "@hugeicons/core-free-icons",
      "@hugeicons/react",
      "recharts",
      "@dnd-kit/core",
      "@dnd-kit/utilities",
      "date-fns",
      "date-fns-tz",
    ],
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-XSS-Protection", value: "1; mode=block" },
    ]

    return [
      {
        source: "/api/auth/:path*",
        headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate, private" }],
      },
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
}

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

export default withAnalyzer(nextConfig)
