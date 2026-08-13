"use client"

import { BookOpenIcon, SparklesIcon, Target01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as m from "motion/react-m"
import { CONSEJOS_STATS } from "@/lib/data/consejos-carrera-data"

export function ConsejosHero() {
  const ease = [0.23, 1, 0.32, 1] as const

  return (
    <section className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden bg-surface-container-lowest">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f9f9fb] via-[#f3f3f5] to-[#f9f9fb] pointer-events-none">
        <div className="absolute top-[10%] left-[8%] size-[20rem] rounded-full bg-[#00374a]/15 blur-3xl will-change-transform"></div>
        <div className="absolute top-[20%] right-[10%] size-[22rem] bg-[#006b5e]/20 rounded-full blur-3xl will-change-transform hidden sm:block"></div>
        <div className="absolute bottom-[10%] left-[25%] size-[24rem] bg-[#8483d4]/20 rounded-full blur-3xl will-change-transform hidden sm:block"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 text-accent text-xs sm:text-sm font-medium mb-6 border border-accent/20"
          >
            <HugeiconsIcon icon={SparklesIcon} className="size-4" />
            <span>Desarrollo Profesional en Biociencias & Biotech</span>
          </m.div>

          {/* Heading */}
          <m.h1
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight tracking-tight text-balance"
          >
            Consejos de Carrera para{" "}
            <span className="text-accent font-bold">Científicos e Ingenieros</span>
          </m.h1>

          {/* Subtitle */}
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed text-pretty"
          >
            Guías accionables, optimización de CV para sistemas ATS, preparación de entrevistas técnicas y estrategias para hacer la transición exitosa de la academia a la industria.
          </m.p>

          {/* Stats Grid */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
          >
            {CONSEJOS_STATS.map((stat, idx) => (
              <m.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 + idx * 0.05, ease }}
                className="p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-border/60 shadow-xs hover:border-accent/30 transition-all text-center"
              >
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-snug">
                  {stat.label}
                </p>
              </m.div>
            ))}
          </m.div>
        </div>
      </div>
    </section>
  )
}
