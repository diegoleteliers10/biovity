"use client"

import { Download01Icon, File02Icon, SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { CONSEJOS_HERRAMIENTAS } from "@/lib/data/consejos-carrera-data"

export function ConsejosHerramientas() {
  const ease = [0.23, 1, 0.32, 1] as const

  return (
    <section className="py-16 md:py-24 bg-surface-container-low/50 relative overflow-hidden border-y border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">
            Recursos Prácticos
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-1 mb-4">
            Herramientas y Plantillas Descargables
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Acelera tu postulación con materiales creados por reclutadores del sector científico.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {CONSEJOS_HERRAMIENTAS.map((tool, idx) => (
            <m.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08, ease }}
              className="p-6 sm:p-8 rounded-2xl bg-background border border-border/80 hover:border-accent/40 shadow-xs flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-6">
                  <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:scale-105 transition-transform">
                    <HugeiconsIcon icon={File02Icon} className="size-6" />
                  </div>
                  {tool.popular && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <HugeiconsIcon icon={SparklesIcon} className="size-3" />
                      Recomendado
                    </span>
                  )}
                </div>

                <span className="text-xs font-medium text-muted-foreground block mb-2">
                  {tool.tag}
                </span>

                <h3 className="text-lg font-bold text-foreground mb-3 leading-snug group-hover:text-accent transition-colors">
                  {tool.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                  {tool.description}
                </p>
              </div>

              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-accent hover:text-accent-foreground text-xs sm:text-sm font-semibold text-foreground transition-all duration-200"
              >
                <HugeiconsIcon icon={Download01Icon} className="size-4" />
                <span>{tool.buttonText}</span>
              </Link>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
