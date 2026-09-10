"use client"

import { Cancel01Icon, CheckmarkCircle02Icon, SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { useState } from "react"
import { getTransition, LANDING_ANIMATION } from "@/lib/animations"
import { MATRIZ_COMPARATIVA } from "@/lib/data/reclutamiento-data"

export function ComparativaTabla() {
  const reducedMotion = useReducedMotion()
  const t = (delay = 0) => getTransition({ delay, reducedMotion })
  const [selectedMobileTab, setSelectedMobileTab] = useState<"biovity" | "ats" | "portales" | "headhunters">("biovity")

  return (
    <section className="py-20 md:py-28 bg-surface-container-lowest" id="comparativa">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <m.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Matriz de Evaluación Técnica
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Comparativa Detallada: <span className="text-accent font-semibold">Biovity</span> frente al mercado
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Compara objetivamente las capacidades de Biovity con los ATS corporativos, los portales
            de empleo masivos y las agencias de headhunting tradicionales.
          </p>
        </m.div>

        {/* Mobile View Switcher */}
        <div className="lg:hidden mb-6 flex rounded-lg bg-surface-container-low p-1 border border-border/40">
          <button
            type="button"
            onClick={() => setSelectedMobileTab("biovity")}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors ${
              selectedMobileTab === "biovity"
                ? "bg-secondary text-secondary-foreground shadow-none"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Biovity
          </button>
          <button
            type="button"
            onClick={() => setSelectedMobileTab("ats")}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
              selectedMobileTab === "ats"
                ? "bg-surface-container-highest text-foreground shadow-none"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ATS Corp.
          </button>
          <button
            type="button"
            onClick={() => setSelectedMobileTab("portales")}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
              selectedMobileTab === "portales"
                ? "bg-surface-container-highest text-foreground shadow-none"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Portales
          </button>
          <button
            type="button"
            onClick={() => setSelectedMobileTab("headhunters")}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
              selectedMobileTab === "headhunters"
                ? "bg-surface-container-highest text-foreground shadow-none"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Headhunters
          </button>
        </div>

        {/* Mobile Cards View */}
        <div className="lg:hidden space-y-4">
          {MATRIZ_COMPARATIVA.map((row) => {
            const data =
              selectedMobileTab === "biovity"
                ? { col: row.biovity, name: "Biovity", isBiovity: true }
                : selectedMobileTab === "ats"
                ? { col: row.atsTradicional, name: "ATS Tradicional", isBiovity: false }
                : selectedMobileTab === "portales"
                ? { col: row.portalesMasivos, name: "Portales Masivos", isBiovity: false }
                : { col: row.headhunters, name: "Headhunters", isBiovity: false }

            return (
              <div
                key={row.criterio}
                className={`rounded-xl p-5 border ${
                  data.isBiovity
                    ? "bg-surface-container-lowest border-secondary/40 ring-1 ring-secondary/20"
                    : "bg-surface-container-low border-border/30"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-foreground">{row.criterio}</h3>
                  <div className="shrink-0 mt-0.5">
                    {data.col.status === true ? (
                      <div className="size-6 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                      </div>
                    ) : data.col.status === "parcial" ? (
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400">
                        Parcial
                      </span>
                    ) : (
                      <div className="size-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-muted-foreground">
                        <HugeiconsIcon icon={Cancel01Icon} size={14} />
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{row.descripcion}</p>
                <div className="pt-2.5 border-t border-border/40">
                  <p className="text-xs text-foreground font-medium">{data.col.detalle}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-hidden rounded-2xl border border-border/40 bg-surface-container-lowest">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-surface-container-low">
                  <th className="py-5 px-6 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground w-2/5">
                    Criterio de Evaluación
                  </th>
                  <th className="py-5 px-6 text-xs font-mono font-semibold uppercase tracking-wider text-secondary bg-secondary/5 border-x border-secondary/20 w-1/4">
                    <div className="flex items-center gap-1.5">
                      <HugeiconsIcon icon={SparklesIcon} size={15} />
                      <span>Biovity</span>
                    </div>
                  </th>
                  <th className="py-5 px-5 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground w-1/8">
                    ATS Tradicionales
                  </th>
                  <th className="py-5 px-5 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground w-1/8">
                    Portales Masivos
                  </th>
                  <th className="py-5 px-5 text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground w-1/8">
                    Headhunters
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {MATRIZ_COMPARATIVA.map((row) => (
                  <tr key={row.criterio} className="hover:bg-surface-container-low/40 transition-colors">
                    {/* Criterio */}
                    <td className="py-4 px-6 align-top">
                      <p className="text-sm font-semibold text-foreground mb-0.5">{row.criterio}</p>
                      <p className="text-xs text-muted-foreground">{row.descripcion}</p>
                    </td>

                    {/* Biovity Column (Highlighted) */}
                    <td className="py-4 px-6 align-top bg-secondary/5 border-x border-secondary/20">
                      <div className="flex items-start gap-2.5">
                        <div className="size-5 rounded-full bg-secondary/15 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                        </div>
                        <p className="text-xs font-medium text-foreground leading-relaxed">
                          {row.biovity.detalle}
                        </p>
                      </div>
                    </td>

                    {/* ATS Tradicional */}
                    <td className="py-4 px-5 align-top">
                      <div className="flex items-start gap-2">
                        {row.atsTradicional.status === true ? (
                          <div className="size-4 rounded-full bg-secondary/15 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} />
                          </div>
                        ) : row.atsTradicional.status === "parcial" ? (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 shrink-0 font-medium">
                            Parcial
                          </span>
                        ) : (
                          <div className="size-4 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                            <HugeiconsIcon icon={Cancel01Icon} size={11} />
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {row.atsTradicional.detalle}
                        </p>
                      </div>
                    </td>

                    {/* Portales Masivos */}
                    <td className="py-4 px-5 align-top">
                      <div className="flex items-start gap-2">
                        {row.portalesMasivos.status === true ? (
                          <div className="size-4 rounded-full bg-secondary/15 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} />
                          </div>
                        ) : row.portalesMasivos.status === "parcial" ? (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 shrink-0 font-medium">
                            Parcial
                          </span>
                        ) : (
                          <div className="size-4 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                            <HugeiconsIcon icon={Cancel01Icon} size={11} />
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {row.portalesMasivos.detalle}
                        </p>
                      </div>
                    </td>

                    {/* Headhunters */}
                    <td className="py-4 px-5 align-top">
                      <div className="flex items-start gap-2">
                        {row.headhunters.status === true ? (
                          <div className="size-4 rounded-full bg-secondary/15 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} />
                          </div>
                        ) : row.headhunters.status === "parcial" ? (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 shrink-0 font-medium">
                            Parcial
                          </span>
                        ) : (
                          <div className="size-4 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                            <HugeiconsIcon icon={Cancel01Icon} size={11} />
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {row.headhunters.detalle}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
