import { Result } from "better-result"
import type { Metadata } from "next"
import { BlogGrid } from "@/components/blog/BlogGrid"
import { BlogHeader } from "@/components/blog/BlogHeader"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BlogCollectionJsonLd, BreadcrumbJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd"
import { getAllPosts } from "@/lib/posts"

export const metadata: Metadata = {
  title: "Blog de Biotecnología y Ciencias en Chile | Biovity",
  description: "Artículos y análisis sobre biotecnología, ciencias y el mercado laboral científico en Chile.",
  keywords: [
    "blog biotecnología",
    "noticias ciencias Chile",
    "empleo científico",
    "carrera científica",
    "biotecnología Chile",
  ],
  openGraph: {
    title: "Blog de Biotecnología y Ciencias en Chile | Biovity",
    description: "Artículos y análisis sobre biotecnología, ciencias y el mercado laboral científico en Chile.",
    url: "/blog",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Biovity Blog - Biotecnología y Ciencias",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog de Biotecnología y Ciencias en Chile | Biovity",
    description: "Artículos y análisis sobre biotecnología, ciencias y el mercado laboral científico en Chile.",
    images: ["/og/home.png"],
  },
  alternates: {
    canonical: "/blog",
  },
}

export default async function BlogPage() {
  const result = await getAllPosts()
  const posts = Result.isOk(result) ? result.value : []

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://biovity.cl"
  const blogItems = posts.map((post) => ({
    name: post.frontmatter.title,
    url: `${siteUrl}/blog/${post.slug}`,
    datePublished: post.frontmatter.date,
  }))

  return (
    <LandingLayout>
      <WebSiteJsonLd />
      <BlogCollectionJsonLd
        name="Blog de Biovity"
        description="Artículos y noticias sobre biotecnología, ciencias y el mundo laboral en Chile."
        url={`${siteUrl}/blog`}
        items={blogItems}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: siteUrl },
          { name: "Blog", url: `${siteUrl}/blog` },
        ]}
      />
      <main className="min-h-screen bg-surface-container-lowest pt-24 pb-20 md:pt-32 md:pb-28">
        <BlogHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <BlogGrid posts={posts} />
        </div>
      </main>
    </LandingLayout>
  )
}
