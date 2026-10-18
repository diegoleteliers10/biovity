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
  const [selectedMobileTab, setSelectedMobileTab] = useState<
    "biovity" | "ats" | "portales" | "headhunters"
  >("biovity")

  return (
    <section className="bg-surface-container-lowest py-20 sm:py-24" id="comparativa">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.div
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: LANDING_ANIMATION.viewportMargin }}
          transition={t(0)}
          className="mb-10 grid max-w-4xl gap-4 sm:mb-14 sm:grid-cols-12 sm:items-end"
        >
          <p className="text-sm font-semibold text-secondary sm:col-span-3">La comparación</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:col-span-9 sm:text-4xl md:text-5xl">
            <span className="text-accent">Biovity</span> frente al mercado
          </h2>
        </m.div>

        <fieldset className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-border/40 bg-surface-container-low p-1.5 sm:grid-cols-4 lg:hidden">
          <legend className="sr-only">Comparar alternativas de reclutamiento</legend>
          <button
            type="button"
            onClick={() => setSelectedMobileTab("biovity")}
            aria-pressed={selectedMobileTab === "biovity"}
            className={`min-h-10 rounded-lg px-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-sm ${
              selectedMobileTab === "biovity"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Biovity
          </button>
          <button
            type="button"
            onClick={() => setSelectedMobileTab("ats")}
            aria-pressed={selectedMobileTab === "ats"}
            className={`min-h-10 rounded-lg px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-sm ${
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
            aria-pressed={selectedMobileTab === "portales"}
            className={`min-h-10 rounded-lg px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-sm ${
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
            aria-pressed={selectedMobileTab === "headhunters"}
            className={`min-h-10 rounded-lg px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-sm ${
              selectedMobileTab === "headhunters"
                ? "bg-surface-container-highest text-foreground shadow-none"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Headhunters
          </button>
        </fieldset>

        <div className="space-y-3 lg:hidden">
          {MATRIZ_COMPARATIVA.map((row) => {
            const data =
              selectedMobileTab === "biovity"
                ? { col: row.biovity, isBiovity: true }
                : selectedMobileTab === "ats"
                  ? { col: row.atsTradicional, isBiovity: false }
                  : selectedMobileTab === "portales"
                    ? { col: row.portalesMasivos, isBiovity: false }
                    : { col: row.headhunters, isBiovity: false }

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
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                        Parcial
                      </span>
                    ) : (
                      <div className="size-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-muted-foreground">
                        <HugeiconsIcon icon={Cancel01Icon} size={14} />
                      </div>
                    )}
                  </div>
                </div>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                  {row.descripcion}
                </p>
                <div className="mt-3">
                  <p className="text-sm font-medium leading-relaxed text-foreground">
                    {data.col.detalle}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="hidden overflow-hidden rounded-xl border border-border/50 bg-surface-container-lowest lg:block">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="w-2/5 px-6 py-5 text-sm font-semibold text-muted-foreground">
                    Criterio de Evaluación
                  </th>
                  <th className="w-1/4 bg-secondary/5 px-6 py-5 text-sm font-semibold text-secondary">
                    <div className="flex items-center gap-1.5">
                      <HugeiconsIcon icon={SparklesIcon} size={15} />
                      <span>Biovity</span>
                    </div>
                  </th>
                  <th className="w-1/8 px-5 py-5 text-sm font-semibold text-muted-foreground">
                    ATS Tradicionales
                  </th>
                  <th className="w-1/8 px-5 py-5 text-sm font-semibold text-muted-foreground">
                    Portales Masivos
                  </th>
                  <th className="w-1/8 px-5 py-5 text-sm font-semibold text-muted-foreground">
                    Headhunters
                  </th>
                </tr>
              </thead>
              <tbody>
                {MATRIZ_COMPARATIVA.map((row) => (
                  <tr
                    key={row.criterio}
                    className="hover:bg-surface-container-low/40 transition-colors"
                  >
                    {/* Criterio */}
                    <td className="py-4 px-6 align-top">
                      <p className="text-sm font-semibold text-foreground mb-0.5">{row.criterio}</p>
                      <p className="text-sm text-muted-foreground">{row.descripcion}</p>
                    </td>

                    {/* Biovity Column (Highlighted) */}
                    <td className="bg-secondary/5 px-6 py-4 align-top">
                      <div className="flex items-start gap-2.5">
                        <div className="size-5 rounded-full bg-secondary/15 flex items-center justify-center text-secondary shrink-0 mt-0.5">
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-foreground">
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
                          <span className="shrink-0 rounded bg-amber-500/15 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                            Parcial
                          </span>
                        ) : (
                          <div className="size-4 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                            <HugeiconsIcon icon={Cancel01Icon} size={11} />
                          </div>
                        )}
                        <p className="text-sm leading-relaxed text-muted-foreground">
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
                          <span className="shrink-0 rounded bg-amber-500/15 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                            Parcial
                          </span>
                        ) : (
                          <div className="size-4 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                            <HugeiconsIcon icon={Cancel01Icon} size={11} />
                          </div>
                        )}
                        <p className="text-sm leading-relaxed text-muted-foreground">
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
                          <span className="shrink-0 rounded bg-amber-500/15 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                            Parcial
                          </span>
                        ) : (
                          <div className="size-4 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                            <HugeiconsIcon icon={Cancel01Icon} size={11} />
                          </div>
                        )}
                        <p className="text-sm leading-relaxed text-muted-foreground">
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
