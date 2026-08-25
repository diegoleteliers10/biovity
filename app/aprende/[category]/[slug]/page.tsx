import { Clock01Icon, HelpCircleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Result } from "better-result"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { CapsuleClient } from "@/components/capsule/CapsuleClient"
import { CapsuleLayout } from "@/components/capsule/CapsuleLayout"
import { createCapsuleComponents } from "@/components/capsule/mdx-components"
import { BreadcrumbJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd"
import { auth } from "@/lib/auth"
import { getAllModuleProgress } from "@/lib/db/capsules"
import { getCapsuleBySlug, getCapsulesByCategory } from "@/lib/posts"
import type { Module, ModuleProgress } from "@/lib/types/capsulas"

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
  "ia-biotech": "IA y Biotech",
}

function splitByModules(content: string, modules: Module[]): string[] {
  const lines = content.split("\n")
  const sections: string[] = []
  let currentSection: string[] = []

  for (const line of lines) {
    if (line.startsWith("## Módulo ") && sections.length < modules.length) {
      if (currentSection.length > 0) {
        sections.push(currentSection.join("\n"))
      }
      currentSection = [line]
    } else if (currentSection.length > 0) {
      currentSection.push(line)
    }
  }
  if (currentSection.length > 0) {
    sections.push(currentSection.join("\n"))
  }

  return sections
}

export default async function CapsulePage({ params }: Props) {
  const { category, slug } = await params
  const result = await getCapsuleBySlug(category, slug)
  if (Result.isError(result)) notFound()

  const capsule = result.value
  const { modules, quiz } = capsule.frontmatter
  const categoryLabel = CATEGORY_LABELS[category] ?? category

  const session = await auth.api.getSession({ headers: new Headers() })
  let moduleProgress: ModuleProgress[] = []

  if (session) {
    const progressResult = await getAllModuleProgress(session.user.id, slug)
    if (Result.isOk(progressResult)) {
      moduleProgress = progressResult.value
    }
  }

  const sections = splitByModules(capsule.content, modules)
  const capsuleComponents = createCapsuleComponents(modules)

  return (
    <CapsuleLayout
      category={category}
      categoryLabel={categoryLabel}
      capsuleTitle={capsule.frontmatter.title}
    >
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
      <CapsuleClient
        modules={modules}
        slug={slug}
        moduleProgress={moduleProgress}
        header={
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground leading-tight tracking-tight text-balance">
              {capsule.frontmatter.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {capsule.frontmatter.description}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-surface-container-low border border-border/40 rounded-full px-3 py-1">
                <HugeiconsIcon icon={Clock01Icon} size={13} />
                {capsule.frontmatter.duration} min
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-surface-container-low border border-border/40 rounded-full px-3 py-1">
                <HugeiconsIcon icon={HelpCircleIcon} size={13} />
                {quiz.length} preguntas
              </span>
            </div>
          </header>
        }
        quizQuestions={quiz}
        quizCategory={category}
        quizSlug={slug}
        authNotice={
          !session ? (
            <div className="mt-8 rounded-lg border border-border/40 bg-surface-container-low p-4 text-sm text-muted-foreground">
              Inicia sesión para guardar tu progreso y obtener el certificado al completar la
              cápsula.
            </div>
          ) : null
        }
        moduleSections={sections.map((section, i) => (
          <MDXRemote key={modules[i]?.slug ?? i} source={section} components={capsuleComponents} />
        ))}
      />
    </CapsuleLayout>
  )
}
