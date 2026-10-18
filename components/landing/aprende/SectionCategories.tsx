import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import type { CategoryItem } from "@/lib/data/aprende-data"
import type { CapsuleMeta } from "@/lib/types/capsulas"

export type CategoryListing =
  | { category: CategoryItem; status: "available"; capsules: CapsuleMeta[] }
  | { category: CategoryItem; status: "empty" }
  | { category: CategoryItem; status: "unavailable" }

type SectionCategoriesProps = {
  listings: CategoryListing[]
}

export function SectionCategories({ listings }: SectionCategoriesProps) {
  return (
    <section id="capsulas" className="py-20 sm:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          data-learn-reveal
          className="mb-10 flex flex-col gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
              Catálogo de cápsulas
            </p>
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Aprende por <span className="text-accent">área.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Elige un tema y avanza a tu ritmo.
          </p>
        </div>

        <div className="divide-y divide-border/60 border-y border-border/60">
          {listings.map(({ category, ...listing }, index) => (
            <section
              key={category.slug}
              data-learn-reveal
              aria-labelledby={`learn-category-${category.slug}`}
              className="grid gap-5 py-7 sm:py-9 lg:grid-cols-12 lg:gap-8"
            >
              <div className="lg:col-span-4">
                <p className="mb-4 font-mono text-xs text-muted-foreground">
                  0{index + 1} / 0{listings.length}
                </p>
                <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <HugeiconsIcon icon={category.icon} size={19} />
                </div>
                <h3
                  id={`learn-category-${category.slug}`}
                  className="text-xl font-semibold text-foreground"
                >
                  {category.name}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
              </div>

              <div className="lg:col-span-8">
                {listing.status === "available" ? (
                  <ul className="divide-y divide-border/50">
                    {listing.capsules.map((capsule) => (
                      <li key={capsule.slug}>
                        <Link
                          href={`/learn/${category.slug}/${capsule.slug}`}
                          className="group grid gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:items-center"
                        >
                          <div>
                            <h4 className="text-lg font-medium text-foreground transition-colors group-hover:text-secondary">
                              {capsule.frontmatter.title}
                            </h4>
                            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                              {capsule.frontmatter.description}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                              <span>{capsule.frontmatter.duration} min</span>
                              <span>{capsule.frontmatter.modules.length} módulos</span>
                              <span>{capsule.frontmatter.quiz.length} preguntas</span>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-secondary">
                            Ver cápsula
                            <HugeiconsIcon
                              icon={ArrowUpRight01Icon}
                              size={17}
                              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="py-5 text-sm text-muted-foreground">
                    {listing.status === "empty"
                      ? "Pronto habrá nuevas cápsulas en esta área."
                      : "No se pudo cargar el contenido de esta área."}
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
