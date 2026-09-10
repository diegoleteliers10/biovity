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
  async redirects() {
    return [
      // ES → EN route renames (301 to preserve SEO and shared links)
      { source: "/empresas/precios", destination: "/plans", permanent: true },
      { source: "/empresas/:path*", destination: "/companies/:path*", permanent: true },
      { source: "/trabajos/:path*", destination: "/jobs/:path*", permanent: true },
      { source: "/salarios/:path*", destination: "/salaries/:path*", permanent: true },
      { source: "/nosotros/:path*", destination: "/about/:path*", permanent: true },
      { source: "/aprende/:path*", destination: "/learn/:path*", permanent: true },
      { source: "/certificados/:path*", destination: "/certificates/:path*", permanent: true },
      { source: "/consejos-carrera", destination: "/career-tips", permanent: true },
      {
        source: "/compartir-salario",
        destination: "/share-salary",
        permanent: true,
      },
      { source: "/reclutamiento", destination: "/recruiting", permanent: true },
      { source: "/planes", destination: "/plans", permanent: true },
      { source: "/privacidad", destination: "/privacy", permanent: true },
      { source: "/terminos", destination: "/terms", permanent: true },
      { source: "/marca", destination: "/brand", permanent: true },
      { source: "/lista-espera", destination: "/waitlist", permanent: true },
      {
        source: "/dashboard/ofertas/:path*",
        destination: "/dashboard/offers/:path*",
        permanent: true,
      },
      {
        source: "/dashboard/my-applications",
        destination: "/dashboard/applications",
        permanent: true,
      },
      { source: "/og/empresas.png", destination: "/og/companies.png", permanent: true },
      { source: "/og/nosotros.png", destination: "/og/about.png", permanent: true },
    ]
  },
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
