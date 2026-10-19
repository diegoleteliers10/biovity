"use client"

import { ArrowDown01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getSpringTransition, getTransition } from "@/lib/animations"
import { CONSEJOS_ARTICULOS, CONSEJOS_CATEGORIAS } from "@/lib/data/consejos-carrera-data"

export function ConsejosHero() {
  const reducedMotion = useReducedMotion()
  const transition = (delay = 0) => getTransition({ delay, reducedMotion })
  const spring = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  const categories = CONSEJOS_CATEGORIAS.filter((category) => category.id !== "todos")

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground dark:bg-primary-container dark:text-foreground">
      <div className="mx-auto grid w-full max-w-7xl gap-14 px-4 pb-16 pt-28 sm:px-6 sm:pb-20 md:min-h-[calc(100svh-7rem)] md:grid-cols-12 md:items-center md:gap-10 md:px-8 md:py-28">
        <div className="md:col-span-7">
          <m.p
            initial={{ opacity: 1, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(0)}
            className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/70 dark:text-foreground/70"
          >
            Guías para la carrera científica
          </m.p>
          <m.h1
            initial={{ opacity: 1, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring(0.06)}
            className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Consejos de carrera en <span className="text-accent">biotecnología y ciencias</span>
          </m.h1>
          <m.p
            initial={{ opacity: 1, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition(0.14)}
            className="mt-7 max-w-2xl text-base leading-relaxed text-primary-foreground/75 dark:text-foreground/75 sm:text-lg"
          >
            Optimiza tu CV para ATS, prepara entrevistas técnicas y transita de la academia a la
            industria.
          </m.p>
          <m.div
            initial={{ opacity: 1, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring(0.22)}
            className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <Button
              asChild
              className="h-11 rounded-lg bg-primary-foreground px-5 text-sm font-medium text-primary hover:bg-primary-foreground/90 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/90"
            >
              <Link href="#guias">
                Explorar guías
                <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="ml-2" />
              </Link>
            </Button>
            <Link
              href="/jobs"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary-foreground/85 transition-colors hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground dark:text-foreground/85 dark:hover:text-foreground dark:focus-visible:outline-foreground"
            >
              Buscar empleos
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Link>
          </m.div>
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-primary-foreground/20 pt-5 text-sm text-primary-foreground/75 dark:border-foreground/20 dark:text-foreground/75">
            <p>
              <span className="mr-2 font-semibold tabular-nums text-primary-foreground dark:text-foreground">
                {CONSEJOS_ARTICULOS.length}
              </span>
              guías de carrera
            </p>
            <p>
              <span className="mr-2 font-semibold tabular-nums text-primary-foreground dark:text-foreground">
                {categories.length}
              </span>
              temas para explorar
            </p>
          </div>
        </div>

        <m.aside
          initial={{ opacity: 1, x: reducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={spring(0.16)}
          aria-label="Índice de temas"
          className="md:col-span-5 md:pl-8"
        >
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground/60 dark:text-foreground/60">
            Índice de temas
          </p>
          <ul className="border-t border-primary-foreground/20 dark:border-foreground/20">
            {categories.map((category, index) => {
              const articleCount = CONSEJOS_ARTICULOS.filter(
                (article) => article.category === category.id
              ).length

              return (
                <m.li
                  key={category.id}
                  initial={{ opacity: 1, x: reducedMotion ? 0 : 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={spring(0.2 + index * 0.04)}
                  className="min-w-0 border-b border-primary-foreground/20 dark:border-foreground/20"
                >
                  <div className="flex min-h-14 min-w-0 items-center justify-between gap-4 py-3 text-sm text-primary-foreground/85 dark:text-foreground/85 sm:text-base">
                    <span className="min-w-0">{category.label}</span>
                    <span className="shrink-0 font-mono text-xs text-primary-foreground/60 dark:text-foreground/60">
                      {articleCount}
                      <span className="sr-only"> guías</span>
                    </span>
                  </div>
                </m.li>
              )
            })}
          </ul>
        </m.aside>
      </div>
    </section>
  )
}
