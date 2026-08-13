"use client"

import { useState } from "react"
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  FilterEditIcon,
  Search01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { CONSEJOS_ARTICULOS, CONSEJOS_CATEGORIAS } from "@/lib/data/consejos-carrera-data"

export function ConsejosGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>("todos")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const ease = [0.23, 1, 0.32, 1] as const

  const filteredArticles = CONSEJOS_ARTICULOS.filter((article) => {
    const matchesCategory =
      selectedCategory === "todos" || article.category === selectedCategory

    const matchesSearch =
      searchQuery.trim() === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.takeaways.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  return (
    <section className="py-16 md:py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">
              Guías & Estrategias
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-1">
              Explora Consejos por Categoría
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px] sm:min-w-[340px]">
            <HugeiconsIcon
              icon={Search01Icon}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por palabra clave (ej. ATS, PhD)..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest rounded-xl border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-accent/50 transition-all"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {CONSEJOS_CATEGORIAS.map((cat) => {
            const isActive = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                type="button"
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-accent text-accent-foreground shadow-xs scale-[1.02]"
                    : "bg-surface-container-low text-muted-foreground hover:bg-surface-container hover:text-foreground border border-border/40"
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-surface-container-lowest border border-border/60">
            <HugeiconsIcon
              icon={FilterEditIcon}
              className="size-12 mx-auto text-muted-foreground mb-4"
            />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No se encontraron guías
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Intenta cambiar la categoría o limpiar el campo de búsqueda para explorar otros temas.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("todos")
                setSearchQuery("")
              }}
              className="mt-4 px-4 py-2 bg-accent text-accent-foreground text-xs sm:text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.map((article, idx) => (
              <m.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05, ease }}
                className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest border border-border/80 hover:border-accent/40 shadow-xs hover:shadow-md transition-all group overflow-hidden"
              >
                <div className="p-6">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent">
                      {CONSEJOS_CATEGORIAS.find((c) => c.id === article.category)?.label ||
                        "General"}
                    </span>
                    {article.badgeText && (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {article.badgeText}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors leading-snug">
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                    {article.description}
                  </p>

                  {/* Key Takeaways */}
                  <div className="space-y-2 pt-4 border-t border-border/40 mb-6">
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      Puntos Clave:
                    </p>
                    {article.takeaways.map((takeaway) => (
                      <div key={takeaway} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          className="size-3.5 text-accent shrink-0 mt-0.5"
                        />
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Info & Link */}
                <div className="p-6 pt-0 mt-auto border-t border-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
                    <span>{article.readTime}</span>
                  </div>

                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Leer guía</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
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
