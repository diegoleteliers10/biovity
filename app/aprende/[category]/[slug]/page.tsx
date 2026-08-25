import { Result } from "better-result"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { Quiz } from "@/components/quiz/Quiz"
import { BreadcrumbJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd"
import { getCapsuleBySlug, getCapsulesByCategory } from "@/lib/posts"

type Props = {
  params: Promise<{ category: string; slug: string }>
}

export async function generateStaticParams() {
  const result = await getCapsulesByCategory()
  if (Result.isError(result)) return []
  return result.value.map((c) => ({ category: c.category, slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const result = await getCapsuleBySlug(category, slug)
  if (Result.isError(result)) return {}

  const capsule = result.value
  return {
    title: `${capsule.frontmatter.title} | Aprende | Biovity`,
    description: capsule.frontmatter.description,
    openGraph: {
      title: capsule.frontmatter.title,
      description: capsule.frontmatter.description,
      url: `/aprende/${category}/${slug}`,
      images: [
        { url: "/og/aprende.png", width: 1200, height: 630, alt: capsule.frontmatter.title },
      ],
    },
    twitter: {
      title: capsule.frontmatter.title,
      description: capsule.frontmatter.description,
      images: ["/og/aprende.png"],
    },
    alternates: { canonical: `/aprende/${category}/${slug}` },
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  bioinformatica: "Bioinformática",
}

export default async function CapsulePage({ params }: Props) {
  const { category, slug } = await params
  const result = await getCapsuleBySlug(category, slug)
  if (Result.isError(result)) notFound()

  const capsule = result.value
  const categoryLabel = CATEGORY_LABELS[category] ?? category

  return (
    <LandingLayout>
      <WebSiteJsonLd />
      <OrganizationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: "https://biovity.cl" },
          { name: "Aprende", url: "https://biovity.cl/aprende" },
          { name: categoryLabel, url: `https://biovity.cl/aprende/${category}` },
          {
            name: capsule.frontmatter.title,
            url: `https://biovity.cl/aprende/${category}/${slug}`,
          },
        ]}
      />
      <main className="flex flex-col relative">
        <article className="pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-4">
              <a
                href={`/aprende/${category}`}
                className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {categoryLabel}
              </a>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {capsule.frontmatter.title}
            </h1>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">
              {capsule.frontmatter.description}
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
              <span>{capsule.frontmatter.duration} min</span>
              <span>{capsule.frontmatter.quiz.length} preguntas</span>
            </div>
            <div className="mt-8 prose prose-neutral dark:prose-invert max-w-none">
              <MDXRemote source={capsule.content} />
            </div>

            <div className="mt-12">
              <Quiz questions={capsule.frontmatter.quiz} category={category} slug={slug} />
            </div>
          </div>
        </article>
      </main>
    </LandingLayout>
  )
}
