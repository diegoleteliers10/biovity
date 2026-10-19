"use client"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getTransition } from "@/lib/animations"

export function ConsejosCTA() {
  const reducedMotion = useReducedMotion()
  const transition = (delay = 0) => getTransition({ delay, reducedMotion })

  return (
    <section className="bg-primary py-16 text-primary-foreground dark:bg-primary-container dark:text-foreground sm:py-20 md:py-24">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-12 md:items-center md:gap-12 lg:px-8">
        <m.div
          initial={{ opacity: 1, y: reducedMotion ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          transition={transition()}
          className="md:col-span-8"
        >
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/70 dark:text-foreground/70">
            Da el siguiente paso
          </p>
          <h2 className="max-w-3xl text-3xl font-semibold leading-[1.02] tracking-tight text-balance sm:text-4xl md:text-5xl">
            Impulsa tu carrera en biociencias
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/75 dark:text-foreground/75 sm:text-lg">
            Crea tu perfil, sube tu CV y postula a las ofertas del sector.
          </p>
        </m.div>

        <m.div
          initial={{ opacity: 1, x: reducedMotion ? 0 : 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "0px 0px -40px 0px" }}
          transition={transition(0.06)}
          className="flex flex-col gap-3 md:col-span-4 md:items-stretch"
        >
          <Button
            asChild
            className="h-11 rounded-lg bg-primary-foreground px-5 text-sm font-medium text-primary hover:bg-primary-foreground/90 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/90"
          >
            <Link href="/register/professional">
              Crear perfil y subir CV
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-lg border-primary-foreground/30 bg-transparent px-5 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground dark:border-foreground/30 dark:text-foreground dark:hover:bg-foreground/10 dark:hover:text-foreground"
          >
            <Link href="/jobs">Buscar empleos en ciencias</Link>
          </Button>
        </m.div>
      </div>
    </section>
  )
}
