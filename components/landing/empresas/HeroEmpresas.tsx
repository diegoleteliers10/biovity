"use client"

import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { HERO_STATS_EMPRESAS } from "@/lib/data/empresas-data"
import { Button } from "../../ui/button"

export function HeroEmpresas() {
  const reducedMotion = useReducedMotion()
  const ease = [0.23, 1, 0.32, 1] as const

  return (
    <section className="relative min-h-[85vh] sm:min-h-screen w-full flex items-center justify-center overflow-hidden bg-surface-container-lowest pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Ambient brand glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[44rem] h-[30rem] rounded-full bg-gradient-to-b from-secondary/10 via-accent/5 to-transparent blur-3xl opacity-70" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Green Plain Text Tag */}
          <m.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.4, ease }}
            className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-4 block"
          >
            Biovity para Empresas • ATS & Reclutamiento Científico
          </m.span>

          {/* Main Headline */}
          <m.h1
            initial={{ opacity: 0, y: 24, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.5, ease }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight tracking-tight text-balance"
          >
            Software ATS y Reclutamiento{" "}
            <span className="text-accent font-semibold">Científico</span> en Chile
          </m.h1>

          {/* Subheadline */}
          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.5, delay: 0.08, ease }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-pretty"
          >
            Centraliza candidatos, evalúa habilidades de laboratorio con scoring de IA y reduce tus
            tiempos de contratación técnica en un 60%.
          </m.p>

          {/* CTA Group */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.5, delay: 0.16, ease }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium"
              asChild
            >
              <Link href="/register/organization">
                Publicar una oferta
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1.5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-11 px-6 bg-surface-container-lowest border-border/30 hover:bg-surface-container-low rounded-lg text-sm font-medium"
              asChild
            >
              <Link href="/empresas/precios">Ver planes y precios</Link>
            </Button>
          </m.div>

          {/* Metrics Grid - Centered 3 columns */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.5, delay: 0.24, ease }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto"
          >
            {HERO_STATS_EMPRESAS.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-container-low rounded-xl p-4 sm:p-5 text-center transition-colors hover:bg-surface-container-highest/60"
              >
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-medium text-foreground mb-0.5 leading-snug">
                  {stat.label}
                </p>
              </div>
            ))}
          </m.div>
        </div>
      </div>
    </section>
  )
}
