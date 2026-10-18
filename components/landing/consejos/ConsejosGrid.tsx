"use client"

import {
  ArrowRight01Icon,
  Clock01Icon,
  FilterEditIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { useState } from "react"
import { getTransition } from "@/lib/animations"
import { CONSEJOS_ARTICULOS, CONSEJOS_CATEGORIAS } from "@/lib/data/consejos-carrera-data"
import { cn } from "@/lib/utils"

export function ConsejosGrid() {
  const reducedMotion = useReducedMotion()
  const transition = (delay = 0) => getTransition({ delay, reducedMotion })
  const [selectedCategory, setSelectedCategory] = useState<string>("todos")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("es-CL")

  const filteredArticles = CONSEJOS_ARTICULOS.filter((article) => {
    const matchesCategory = selectedCategory === "todos" || article.category === selectedCategory
    const searchableText = [article.title, article.description, ...article.takeaways]
      .join(" ")
      .toLocaleLowerCase("es-CL")

    return (
      matchesCategory && (normalizedQuery.length === 0 || searchableText.includes(normalizedQuery))
    )
  })

  const clearFilters = () => {
    setSelectedCategory("todos")
    setSearchQuery("")
  }

  return (
    <section
      id="guias"
      className="scroll-mt-24 bg-surface-container-lowest py-16 sm:py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 1, y: reducedMotion ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          transition={transition()}
          className="grid gap-6 border-b border-border pb-7 md:grid-cols-12 md:items-end md:gap-8"
        >
          <div className="md:col-span-7">
            <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
              Índice de carrera
            </p>
            <h2 className="text-3xl font-semibold leading-[1.05] tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl">
              Explora las guías
            </h2>
          </div>
          <div className="md:col-span-5">
            <label htmlFor="career-guide-search" className="sr-only">
              Buscar guías por tema
            </label>
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="career-guide-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Buscar por tema (ej. ATS, PhD, ISP)..."
                className="h-11 w-full rounded-lg border border-border bg-surface-container-lowest pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-secondary focus-visible:ring-2 focus-visible:ring-secondary/20"
              />
            </div>
          </div>
        </m.div>

        <fieldset className="mt-6">
          <legend className="sr-only">Filtrar guías por categoría</legend>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CONSEJOS_CATEGORIAS.map((category) => {
              const isActive = selectedCategory === category.id

              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "min-h-10 shrink-0 border-b-2 px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    isActive
                      ? "border-secondary text-secondary"
                      : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                  )}
                >
                  {category.label}
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className="mt-5 flex items-center justify-between border-y border-border py-3 text-xs text-muted-foreground">
          <p aria-live="polite">
            {filteredArticles.length} {filteredArticles.length === 1 ? "guía" : "guías"}
          </p>
          {(selectedCategory !== "todos" || normalizedQuery.length > 0) && (
            <button
              type="button"
              onClick={clearFilters}
              className="font-medium text-secondary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {filteredArticles.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center py-12 text-center">
            <HugeiconsIcon
              icon={FilterEditIcon}
              size={30}
              aria-hidden="true"
              className="mb-4 text-muted-foreground"
            />
            <h3 className="text-base font-semibold text-foreground">No se encontraron guías</h3>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-sm font-medium text-secondary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="border-b border-border">
            {filteredArticles.map((article, index) => (
              <m.article
                key={article.id}
                layout
                transition={transition(Math.min(index * 0.025, 0.1))}
                className="group grid gap-4 border-t border-border py-6 first:border-t-0 sm:py-7 md:grid-cols-12 md:items-center md:gap-8"
              >
                <div className="flex items-center justify-between gap-4 md:col-span-3 md:block">
                  <p className="font-mono text-xs font-medium uppercase leading-relaxed tracking-[0.08em] text-secondary">
                    {CONSEJOS_CATEGORIAS.find((category) => category.id === article.category)
                      ?.label ?? "General"}
                  </p>
                  <p className="flex shrink-0 items-center gap-1.5 font-mono text-xs text-muted-foreground md:mt-3">
                    <HugeiconsIcon icon={Clock01Icon} size={14} aria-hidden="true" />
                    {article.readTime}
                  </p>
                </div>
                <div className="min-w-0 md:col-span-7">
                  <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-secondary sm:text-xl">
                    {article.title}
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {article.description}
                  </p>
                </div>
                <Link
                  href={`/blog/${article.slug}`}
                  aria-label={`Leer guía: ${article.title}`}
                  className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:col-span-2 md:justify-end"
                >
                  Leer guía
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </Link>
              </m.article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
