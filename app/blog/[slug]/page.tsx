import { Result } from "better-result"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { mdxComponents } from "@/components/blog/mdx-components"
import { SocialShare } from "@/components/blog/SocialShare"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BlogPostingJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getAllPosts, getPostBySlug } from "@/lib/posts"
import { formatDateChilean } from "@/lib/utils"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const result = await getPostBySlug(slug)
    if (!Result.isOk(result)) {
      return { title: "Post Not Found", description: "This post could not be found." }
    }
    const post = result.value
    const url = `/blog/${slug}`
    return {
      title: post.frontmatter.title,
      description: post.frontmatter.excerpt,
      openGraph: {
        title: post.frontmatter.title,
        description: post.frontmatter.excerpt,
        url,
        images: [
          {
            url: post.frontmatter.featuredImage,
            width: 1200,
            height: 630,
            alt: post.frontmatter.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.frontmatter.title,
        description: post.frontmatter.excerpt,
      },
      alternates: {
        canonical: url,
      },
    }
  } catch {
    return {
      title: "Post Not Found",
      description: "This post could not be found.",
    }
  }
}

export async function generateStaticParams() {
  const result = await getAllPosts()
  const posts = Result.isOk(result) ? result.value : []
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const result = await getPostBySlug(slug)

  if (!Result.isOk(result)) {
    notFound()
  }

  const post = result.value

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://biovity.cl"
  const postUrl = `${siteUrl}/blog/${slug}`

  return (
    <LandingLayout>
      <BlogPostingJsonLd
        title={post.frontmatter.title}
        description={post.frontmatter.excerpt}
        authorName={post.frontmatter.author}
        datePublished={post.frontmatter.date}
        image={post.frontmatter.featuredImage}
        url={postUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: `${siteUrl}` },
          { name: "Blog", url: `${siteUrl}/blog` },
          { name: post.frontmatter.title, url: postUrl },
        ]}
      />
      <main className="min-h-screen bg-surface-container-lowest pt-28 pb-20 md:pt-36 md:pb-28">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="text-muted-foreground hover:text-secondary text-xs"
                >
                  Inicio
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/blog"
                  className="text-muted-foreground hover:text-secondary text-xs"
                >
                  Blog
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground text-xs font-medium truncate max-w-[200px] sm:max-w-xs">
                  {post.frontmatter.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 text-foreground tracking-tight text-balance leading-tight">
            {post.frontmatter.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed text-pretty">
            {post.frontmatter.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-border text-xs text-muted-foreground font-mono">
            <div className="flex items-center gap-2">
              <span>{formatDateChilean(post.frontmatter.date, "d MMM yyyy")}</span>
              <span>•</span>
              <span>Por {post.frontmatter.author}</span>
            </div>
            <SocialShare />
          </div>

          <div className="relative w-full aspect-video sm:h-[420px] mb-12 rounded-xl overflow-hidden border border-border bg-surface-container-low">
            <Image
              src={post.frontmatter.featuredImage}
              alt={post.frontmatter.title}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>

          <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-secondary text-foreground/90 leading-relaxed text-base">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>
      </main>
    </LandingLayout>
  )
}
