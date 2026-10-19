"use client"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getTransition, LANDING_ANIMATION } from "@/lib/animations"

export function ReclutamientoCTA() {
  const reducedMotion = useReducedMotion()
  const transition = getTransition({ delay: 0, reducedMotion })

  return (
    <section className="bg-primary py-20 text-primary-foreground dark:bg-primary-container dark:text-foreground sm:py-24">
      <m.div
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
        transition={transition}
        className="mx-auto grid max-w-7xl items-end gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8"
      >
        <div className="lg:col-span-8">
          <p className="mb-4 text-sm font-semibold text-primary-foreground/80 dark:text-foreground/80">
            El próximo paso
          </p>
          <h2 className="max-w-4xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            Deja atrás los filtros ciegos y recluta con precisión.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/75 dark:text-foreground/75 sm:text-lg">
            Crea tu cuenta de organización y publica tu primera oferta científica.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col">
          <Button
            size="lg"
            className="h-11 rounded-lg bg-primary-foreground px-6 text-sm font-medium text-primary hover:bg-primary-foreground/90 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/90"
            asChild
          >
            <Link href="/register/organization">
              Comenzar a reclutar gratis
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1.5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 rounded-lg border-primary-foreground/30 bg-transparent px-6 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground dark:border-foreground/30 dark:text-foreground dark:hover:bg-foreground/10 dark:hover:text-foreground"
            asChild
          >
            <Link href="/plans">Ver planes y precios</Link>
          </Button>
        </div>
      </m.div>
    </section>
  )
}
