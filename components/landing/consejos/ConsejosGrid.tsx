"use client"

import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  FilterEditIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { useState } from "react"
import { getSpringTransition, getTransition } from "@/lib/animations"
import { CONSEJOS_ARTICULOS, CONSEJOS_CATEGORIAS } from "@/lib/data/consejos-carrera-data"
import { cn } from "@/lib/utils"

export function ConsejosGrid() {
  const reducedMotion = useReducedMotion()
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  const t = (delay = 0) => getTransition({ delay, reducedMotion })

  const [selectedCategory, setSelectedCategory] = useState<string>("todos")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const filteredArticles = CONSEJOS_ARTICULOS.filter((article) => {
    const matchesCategory = selectedCategory === "todos" || article.category === selectedCategory

    const matchesSearch =
      searchQuery.trim() === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.takeaways.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  return (
    <section className="py-20 md:py-28 bg-surface-container-low relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={t(0)}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
              Guías & Estrategias
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
              Explora Consejos por Categoría
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px] sm:min-w-[340px]">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por tema (ej. ATS, PhD, ISP)..."
              className="w-full pl-10 pr-4 h-11 bg-surface-container-lowest rounded-lg border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        </m.div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar">
          {CONSEJOS_CATEGORIAS.map((cat) => {
            const isActive = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                type="button"
                className={cn(
                  "px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer",
                  isActive
                    ? "bg-secondary text-secondary-foreground border border-secondary shadow-xs font-semibold"
                    : "bg-surface-container-lowest text-muted-foreground hover:bg-surface-container hover:text-foreground border border-border"
                )}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-xl bg-surface-container-lowest border border-border">
            <HugeiconsIcon
              icon={FilterEditIcon}
              size={36}
              className="mx-auto text-muted-foreground mb-3"
            />
            <h3 className="text-base font-semibold text-foreground mb-1">No se encontraron guías</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
              Intenta cambiar la categoría o ajustar los términos de búsqueda para encontrar otros artículos.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("todos")
                setSearchQuery("")
              }}
              className="h-10 px-5 bg-secondary text-secondary-foreground text-xs sm:text-sm font-medium rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, idx) => (
              <m.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                transition={ts(idx * 0.05)}
                className="flex flex-col justify-between rounded-xl bg-surface-container-lowest border border-border hover:border-secondary/40 hover:bg-surface-container-lowest/90 shadow-none transition-all group overflow-hidden"
              >
                <div className="p-6">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-medium bg-secondary/10 text-secondary border border-secondary/20">
                      {CONSEJOS_CATEGORIAS.find((c) => c.id === article.category)?.label ||
                        "General"}
                    </span>
                    {article.badgeText && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-accent/10 text-accent border border-accent/20">
                        {article.badgeText}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors leading-snug tracking-tight">
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground mb-5 line-clamp-3 leading-relaxed">
                    {article.description}
                  </p>

                  {/* Key Takeaways */}
                  <div className="space-y-2 pt-4 border-t border-border mb-4">
                    <p className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
                      Puntos Clave:
                    </p>
                    {article.takeaways.map((takeaway) => (
                      <div
                        key={takeaway}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          size={14}
                          className="text-secondary shrink-0 mt-0.5"
                        />
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Info & Link */}
                <div className="p-6 pt-0 mt-auto border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                    <HugeiconsIcon icon={Clock01Icon} size={14} />
                    <span>{article.readTime}</span>
                  </div>

                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary hover:underline group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Leer guía</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                  </Link>
                </div>
              </m.article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
