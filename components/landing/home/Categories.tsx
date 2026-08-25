"use client"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQuery } from "@tanstack/react-query"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  getSpringTransition,
  getTransition,
  LANDING_ANIMATION,
  LANDING_ANIMATION_MOBILE,
} from "@/lib/animations"
import { CATEGORIES_HOME } from "@/lib/data/home-data"

type CategoriesCountsResponse = {
  counts: Record<string, number | null>
}

export function Categories() {
  const reducedMotion = useReducedMotion()
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isReduced = Boolean(reducedMotion)

  const chainStagger = isMobile
    ? LANDING_ANIMATION_MOBILE.chainStagger
    : LANDING_ANIMATION.chainStagger
  const viewportMargin = isMobile
    ? LANDING_ANIMATION_MOBILE.viewportMargin
    : LANDING_ANIMATION.viewportMargin
  const yOffset = isReduced ? 0 : isMobile ? 14 : 24

  const t = (delay = 0) => getTransition({ delay, reducedMotion, isMobile })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion, isMobile })

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
    <section className="py-20 md:py-28 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={isReduced ? false : { opacity: 0, y: isMobile ? 16 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: viewportMargin }}
          transition={t(0)}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Especialidades Científicas
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Explora oportunidades por{" "}
            <span className="text-accent font-semibold">área de especialización</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Filtra y encuentra vacantes en los sectores biotecnológicos y científicos de mayor
            crecimiento en el país.
          </p>
        </m.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CATEGORIES_HOME.map((category, index) => {
            const isViolet = index % 2 === 1
            return (
              <m.div
                key={category.title}
                initial={isReduced ? false : { opacity: 0, y: yOffset, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: viewportMargin }}
                transition={ts(index * chainStagger)}
              >
                <Link href={`/trabajos?categoria=${category.id}`} className="block group">
                  <div className="bg-surface-container-lowest rounded-xl p-6 flex items-center gap-4 transition-colors hover:bg-white/80">
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
              </m.div>
            )
          })}
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium"
          >
            <Link href="/trabajos">
              Ver todas las oportunidades
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
