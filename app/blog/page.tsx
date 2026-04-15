import { Result } from "better-result"
import type { Metadata } from "next"
import { BlogGrid } from "@/components/blog/BlogGrid"
import { BlogHeader } from "@/components/blog/BlogHeader"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BreadcrumbJsonLd, CollectionJsonLd } from "@/components/seo/JsonLd"
import { getAllPosts } from "@/lib/posts"

export const metadata: Metadata = {
  title: "Blog",
  description: "Artículos y noticias sobre biotecnología, ciencias y el mundo laboral en Chile.",
  keywords: [
    "blog biotecnología",
    "noticias ciencias Chile",
    "empleo científico",
    "carrera científica",
    "biotecnología Chile",
  ],
  openGraph: {
    title: "Blog | Biovity",
    description: "Artículos y noticias sobre biotecnología, ciencias y el mundo laboral en Chile.",
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
    title: "Blog | Biovity",
    description: "Artículos y noticias sobre biotecnología, ciencias y el mundo laboral en Chile.",
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
  }))

  return (
    <LandingLayout>
      <CollectionJsonLd
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
      <div className="py-32">
        <BlogHeader />
        <main className="container mx-auto px-4 py-8">
          <BlogGrid posts={posts} />
        </main>
      </div>
    </LandingLayout>
  )
}
