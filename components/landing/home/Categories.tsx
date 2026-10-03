"use client"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Reveal } from "@/components/ui/scroll-reveal"
import { LANDING_ANIMATION } from "@/lib/animations"
import { CATEGORIES_HOME } from "@/lib/data/home-data"

type CategoriesCountsResponse = {
  counts: Record<string, number | null>
}

export function Categories() {
  const { data } = useQuery({
    queryKey: ["landing", "home", "categoriesCounts"],
    queryFn: async (): Promise<CategoriesCountsResponse> => {
      const res = await fetch("/api/landing/home/categories")
      if (!res.ok) throw new Error("Error al cargar conteos")
      return res.json()
    },
    staleTime: 60 * 1000,
  })

  const formatPositions = (categoryId: string, fallback: string) => {
    const count = data?.counts?.[categoryId]
    if (count == null) return fallback
    const formatted = new Intl.NumberFormat("es-CL").format(count)
    return `${formatted} ${count === 1 ? "oferta activa" : "ofertas activas"}`
  }

  return (
    <section className="py-24 md:py-36 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12 max-w-3xl mx-auto md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-0 tracking-tight text-balance">
            Explora por <span className="text-accent font-semibold">especialidad</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES_HOME.map((category, index) => {
            const isViolet = index % 2 === 1
            return (
              <Reveal
                key={category.title}
                delay={LANDING_ANIMATION.chainStagger * index}
                scale={0.98}
                spring
              >
                <Link href={`/jobs?categoria=${category.id}`} className="block group">
                  <div className="bg-surface-container-low rounded-xl p-6 flex items-center gap-4 transition-colors hover:bg-surface-container-highest/60">
                    <div
                      className={`shrink-0 size-11 rounded-lg flex items-center justify-center transition-colors ${
                        isViolet
                          ? "bg-accent/10 text-accent group-hover:bg-accent/15"
                          : "bg-secondary/10 text-secondary group-hover:bg-secondary/15"
                      }`}
                    >
                      <HugeiconsIcon icon={category.icon} size={22} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base mb-0.5 truncate">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground text-xs font-mono">
                        {formatPositions(category.id, category.positions)}
                      </p>
                    </div>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={18}
                      className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0"
                    />
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
