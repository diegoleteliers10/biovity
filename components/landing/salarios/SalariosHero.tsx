"use client"

import { TradeUpIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as m from "motion/react-m"
import { SALARIOS_HERO_STATS } from "@/lib/data/salarios-data"

export function SalariosHero() {
  return (
    <section className="relative min-h-dvh w-full flex items-center justify-center overflow-hidden bg-surface-container-lowest">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 pt-safe-top md:pt-24">
        <div className="text-center max-w-4xl mx-auto">
          <m.h1
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4 md:mb-6 leading-tight text-balance tracking-tight"
          >
            Estudio de <span className="text-accent font-semibold">Salarios en Biociencias</span>
          </m.h1>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.2, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed text-pretty"
          >
            Análisis completo de remuneraciones en el sector de biociencias en Chile. Datos
            segmentados por carrera, industria, región y nivel educativo (2024-2025).
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.2, ease: "easeOut" }}
            className="text-center text-sm text-muted-foreground mb-12"
          >
            <HugeiconsIcon icon={TradeUpIcon} className="size-5 text-accent inline-block mr-2" />
            <span>Datos actualizados 2024-2025</span>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.2, ease: "easeOut" }}
            className="grid grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto"
          >
            {SALARIOS_HERO_STATS.map((stat, index) => (
              <m.div
                key={stat.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 + index * 0.03, duration: 0.2, ease: "easeOut" }}
                className="text-center"
              >
                <div className="mx-auto mb-3 flex justify-center">
                  <div className="p-3 rounded-full bg-secondary/10">
                    <HugeiconsIcon icon={stat.icon} size={40} className="text-secondary" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </m.div>
            ))}
          </m.div>
        </div>
      </div>
    </section>
  )
}
