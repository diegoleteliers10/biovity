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

const formatPositions = (count: number | null | undefined, fallback: string) => {
  if (count == null) return fallback
  const formatted = new Intl.NumberFormat("es-CL").format(count)
  return `${formatted} ${count === 1 ? "oferta activa" : "ofertas activas"}`
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

  return (
    <section className="bg-surface-container-lowest py-20 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          <Reveal className="md:col-span-4">
            <span className="mb-4 block font-mono text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
              Explora el sector
            </span>
            <h2 className="max-w-sm text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Encuentra tu espacio en las ciencias.
            </h2>
          </Reveal>

          <div className="grid gap-x-8 sm:grid-cols-2 md:col-span-8">
            {CATEGORIES_HOME.map((category, index) => (
              <Reveal key={category.id} delay={LANDING_ANIMATION.stagger * index} y={12}>
                <Link
                  href={`/jobs?categoria=${category.id}`}
                  className="group flex min-h-20 items-center gap-4 border-b border-border/50 py-4 transition-colors hover:bg-surface-container-low/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                      index % 2 === 0
                        ? "bg-secondary/10 text-secondary"
                        : "bg-accent/10 text-accent"
                    }`}
                    aria-hidden="true"
                  >
                    <HugeiconsIcon icon={category.icon} size={20} strokeWidth={1.6} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground sm:text-base">
                      {category.title}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {formatPositions(data?.counts?.[category.id], category.positions)}
                    </span>
                  </span>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-1 group-hover:text-foreground"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
