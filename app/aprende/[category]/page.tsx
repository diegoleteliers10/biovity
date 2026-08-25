import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { Result } from "better-result"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { getCapsulesByCategory } from "@/lib/posts"
import { APRENDE_CATEGORIES } from "@/lib/data/aprende-data"

type Props = {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = APRENDE_CATEGORIES.find((c) => c.slug === category)
  if (!cat) return {}

  return {
    title: `${cat.name} — Cápsulas de Aprendizaje | Biovity`,
    description: cat.description,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = APRENDE_CATEGORIES.find((c) => c.slug === category)
  if (!cat) notFound()

  const result = await getCapsulesByCategory(category)
  const capsules = Result.isOk(result) ? result.value : []

  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <Breadcrumb className="mb-16">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/aprende">Aprende</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{cat!.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
          {cat!.name.toUpperCase()}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-tight tracking-tight text-balance">
          Cápsulas de{" "}
          <span className="text-accent font-semibold">{cat!.name}</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl leading-relaxed text-pretty">
          {cat!.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capsules.map((capsule) => (
            <Link
              key={capsule.slug}
              href={`/aprende/${category}/${capsule.slug}`}
              className="block group p-6 rounded-xl bg-surface-container-low border border-border/40 hover:border-secondary/40 transition-colors shadow-none"
            >
              <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors">
                {capsule.frontmatter.title}
              </h3>
              {capsule.frontmatter.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {capsule.frontmatter.description}
                </p>
              )}
              <div className="mt-4 text-xs font-medium text-secondary">
                {capsule.frontmatter.quiz?.length ?? 0} preguntas
              </div>
            </Link>
          ))}
        </div>

        {capsules.length === 0 && (
          <div className="bg-surface-container-low border border-border/40 rounded-xl p-6 text-center max-w-md mx-auto my-6 shadow-none">
            <p className="text-sm font-medium text-foreground mb-1">Próximamente</p>
            <p className="text-xs text-muted-foreground">
              Estamos preparando cápsulas para esta categoría.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
