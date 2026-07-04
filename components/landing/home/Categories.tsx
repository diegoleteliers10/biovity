"use client"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQuery } from "@tanstack/react-query"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { getSpringTransition, getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { CATEGORIES_HOME } from "@/lib/data/home-data"
import { Button } from "../../ui/button"
import { Card } from "../../ui/card"

type CategoriesCountsResponse = {
  counts: Record<string, number | null>
}

export function Categories() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })

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
    return `${formatted} ${count === 1 ? "empleo" : "empleos"}`
  }

  return (
    <section className="py-24 bg-[#f3f3f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-16"
        >
          <m.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(0)}
            className="text-3xl md:text-5xl font-semibold text-foreground mb-4 text-balance"
          >
            Explora Oportunidades
          </m.h2>
          <m.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
            transition={t(LANDING_ANIMATION.sequenceDelay)}
            className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty"
          >
            Encuentra tu próximo desafío profesional en las áreas más innovadoras de la ciencia
          </m.p>
        </m.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CATEGORIES_HOME.map((category, index) => (
            <m.div
              key={category.title}
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
              transition={ts(index * LANDING_ANIMATION.chainStagger)}
            >
              <Link
                href={`/trabajos?categoria=${category.id}`}
                className="block"
              >
                <Card className="group p-6 cursor-pointer bg-white hover:bg-secondary/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 size-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                      <HugeiconsIcon icon={category.icon} size={24} className="text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-lg mb-1">
                        {category.title}
                      </h3>
                      <div className="flex items-center">
                        <span className="text-muted-foreground text-sm">
                          {formatPositions(category.id, category.positions)}
                        </span>
                      </div>
                    </div>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      className="size-5 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all shrink-0"
                    />
                  </div>
                </Card>
              </Link>
            </m.div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="secondary" className="px-8 py-3">
            <Link href="/trabajos">
              Ver todas las especialidades
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
