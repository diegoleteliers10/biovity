import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { mdxComponents } from "@/components/blog/mdx-components"
import { SocialShare } from "@/components/blog/SocialShare"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd"
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
    const post = await getPostBySlug(slug)
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
  } catch (error) {
    return {
      title: "Post Not Found",
      description: "This post could not be found.",
    }
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug).catch(() => null)

  if (!post) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://biovity.cl"
  const postUrl = `${siteUrl}/blog/${slug}`

  return (
    <LandingLayout>
      <ArticleJsonLd
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
      <article className="py-32">
        <main className="mx-auto max-w-4xl px-8 md:px-12">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-muted-foreground hover:text-secondary">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/blog" className="text-muted-foreground hover:text-secondary">
                  Blog
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-foreground">
                  {post.frontmatter.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-left text-foreground tracking-tight">
            {post.frontmatter.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg md:text-xl text-muted-foreground mb-6 text-left">
            {post.frontmatter.excerpt}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-4 mb-8 text-sm text-muted-foreground">
            <span>{formatDateChilean(post.frontmatter.date, "d MMM yyyy")}</span>
            <span>•</span>
            <span>Por {post.frontmatter.author}</span>
            <SocialShare className="ml-auto" />
          </div>

          {/* Hero Image */}
          <div className="relative w-full h-[400px] md:h-[500px] mb-12 rounded-xl overflow-hidden border border-border/10">
            <Image
              src={post.frontmatter.featuredImage}
              alt={post.frontmatter.title}
              fill
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </main>
      </article>
    </LandingLayout>
  )
}
