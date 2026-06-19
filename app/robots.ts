import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"

const SEO_DISALLOW = ["/api/", "/dashboard/", "/login/", "/register/", "/*-md"]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: SEO_DISALLOW,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: SEO_DISALLOW,
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: SEO_DISALLOW,
      },
      {
        userAgent: "Googlebot-News",
        allow: "/",
        disallow: SEO_DISALLOW,
      },
      {
        userAgent: "Googlebot-Video",
        allow: "/",
        disallow: SEO_DISALLOW,
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/login/", "/register/"],
      },
      {
        userAgent: "GPTBot-Preview",
        allow: "/",
        disallow: ["/api/", "/dashboard/"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/api/", "/dashboard/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/login/", "/register/"],
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: ["/api/", "/dashboard/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/", "/dashboard/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/", "/dashboard/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/api/", "/dashboard/"],
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: ["/api/", "/dashboard/"],
      },
      {
        userAgent: "Diffbot",
        allow: "/",
        disallow: ["/api/", "/dashboard/"],
      },
      {
        userAgent: "Bytespider",
        allow: "/",
        disallow: ["/api/", "/dashboard/"],
      },
      {
        userAgent: "Amazonbot",
        allow: "/",
        disallow: ["/api/", "/dashboard/"],
      },
      {
        userAgent: "YandexBot",
        allow: "/",
        disallow: SEO_DISALLOW,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: SEO_DISALLOW,
      },
      {
        userAgent: "DuckDuckBot",
        allow: "/",
        disallow: SEO_DISALLOW,
      },
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: SEO_DISALLOW,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
