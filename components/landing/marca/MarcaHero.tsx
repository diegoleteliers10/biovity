"use client"

import { Download04Icon, SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { Button } from "@/components/ui/button"

export function MarcaHero() {
  const reducedMotion = useReducedMotion()
  const ease = [0.23, 1, 0.32, 1] as const

  return (
    <section className="relative min-h-[75vh] sm:min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-surface-container-lowest pt-24 pb-16 md:pt-32 md:pb-20">
      {/* Ambient brand glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[44rem] h-[30rem] rounded-full bg-gradient-to-b from-secondary/10 via-accent/5 to-transparent blur-3xl opacity-70" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow Plain Green Text */}
          <m.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.4, ease }}
            className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-4 block"
          >
            Identidad & System Design • Biovity
          </m.span>

          {/* Main Headline */}
          <m.h1
            initial={{ opacity: 0, y: 24, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.5, ease }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight tracking-tight text-balance"
          >
            Guía de Marca y <span className="text-accent font-semibold">Sistema de Diseño</span>
          </m.h1>

          {/* Subtitle */}
          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.5, delay: 0.08, ease }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed text-pretty"
          >
            Los principios visuales, paleta de color, tipografía y componentes que dan vida al
            ecosistema de biociencias y tecnología en Chile.
          </m.p>

          {/* Actions */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.5, delay: 0.16, ease }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            <Button
              className="h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium"
              asChild
            >
              <a href="#colores">
                <HugeiconsIcon icon={SparklesIcon} size={16} className="mr-1.5" />
                Explorar Colores & Tokens
              </a>
            </Button>
            <Button
              variant="outline"
              className="h-11 px-6 bg-surface-container-lowest border-border/40 hover:bg-surface-container-low rounded-lg text-sm font-medium"
              asChild
            >
              <a href="#componentes">Ver Componentes UI</a>
            </Button>
          </m.div>

          {/* Quick Metrics */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.01 : 0.5, delay: 0.24, ease }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto"
          >
            <div className="bg-surface-container-low rounded-xl p-4 sm:p-5 text-center transition-colors hover:bg-surface-container-highest/60">
              <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1 tracking-tight">
                Curated Organism
              </p>
              <p className="text-xs sm:text-sm font-medium text-foreground mb-0.5 leading-snug">
                Filosofía de diseño
              </p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 sm:p-5 text-center transition-colors hover:bg-surface-container-highest/60">
              <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1 tracking-tight">
                Satoshi + Geist
              </p>
              <p className="text-xs sm:text-sm font-medium text-foreground mb-0.5 leading-snug">
                Sistema tipográfico
              </p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 sm:p-5 text-center transition-colors hover:bg-surface-container-highest/60">
              <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1 tracking-tight">
                Tonal Depth
              </p>
              <p className="text-xs sm:text-sm font-medium text-foreground mb-0.5 leading-snug">
                Jerarquía sin ruido
              </p>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  )
}
