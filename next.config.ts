import withBundleAnalyzer from "@next/bundle-analyzer"
import type { NextConfig } from "next"

const API_PROXY_TARGET = (
  process.env.API_PROXY_TARGET ??
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001"
).replace(/\/$/, "")

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_PROXY_TARGET}/api/v1/:path*`,
      },
    ]
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  experimental: {
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
        source: "/:path*",
        headers: securityHeaders,
      },
    ]
  },
}

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

export default withAnalyzer(nextConfig)
