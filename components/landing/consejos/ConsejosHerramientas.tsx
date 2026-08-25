"use client"

import { Download01Icon, File02Icon, SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { getSpringTransition, getTransition } from "@/lib/animations"
import { CONSEJOS_HERRAMIENTAS } from "@/lib/data/consejos-carrera-data"

export function ConsejosHerramientas() {
  const reducedMotion = useReducedMotion()
  const ts = (delay = 0) => getSpringTransition({ delay, reducedMotion })
  const t = (delay = 0) => getTransition({ delay, reducedMotion })

  return (
    <section className="py-20 md:py-28 bg-surface-container-lowest relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={t(0)}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Recursos Prácticos
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-3 text-balance">
            Herramientas y Plantillas Descargables
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground text-pretty">
            Acelera tu postulación con materiales creados y validados por reclutadores del sector
            científico.
          </p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONSEJOS_HERRAMIENTAS.map((tool, idx) => (
            <m.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -40px 0px" }}
              transition={ts(idx * 0.08)}
              className="p-6 sm:p-7 rounded-xl bg-surface-container-low border-0 shadow-none flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <div className="size-11 rounded-xl bg-secondary/10 text-secondary border border-secondary/20 flex items-center justify-center">
                    <HugeiconsIcon icon={File02Icon} size={20} />
                  </div>
                  {tool.popular && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-secondary/10 text-secondary border border-secondary/20">
                      <HugeiconsIcon icon={SparklesIcon} size={13} />
                      Recomendado
                    </span>
                  )}
                </div>

                <span className="text-xs font-mono font-medium text-muted-foreground block mb-2">
                  {tool.tag}
                </span>

                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 leading-snug tracking-tight">
                  {tool.title}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                  {tool.description}
                </p>
              </div>

              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-primary-foreground text-xs sm:text-sm font-medium text-foreground border border-border transition-colors"
              >
                <HugeiconsIcon icon={Download01Icon} size={16} />
                <span>{tool.buttonText}</span>
              </Link>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
