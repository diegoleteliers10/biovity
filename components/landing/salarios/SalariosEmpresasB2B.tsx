"use client"

import { ArrowRight01Icon, Calculator01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BANDAS_SALARIALES_B2B } from "@/lib/data/salarios-data"
import { cn, formatSalarioRango } from "@/lib/utils"

type Level = "junior" | "senior"

export function SalariosEmpresasB2B() {
  const reducedMotion = useReducedMotion()
  const [career, setCareer] = useState(BANDAS_SALARIALES_B2B[0].career)
  const [level, setLevel] = useState<Level>("senior")

  const selected = useMemo(
    () => BANDAS_SALARIALES_B2B.find((b) => b.career === career) ?? BANDAS_SALARIALES_B2B[0],
    [career]
  )

  const range =
    level === "junior"
      ? { min: selected.juniorMin, max: selected.juniorMax }
      : { min: selected.seniorMin, max: selected.seniorMax }

  return (
    <section className="py-20 md:py-28 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-3xl">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Para Empresas & Reclutadores en Chile
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Guía B2B de <span className="text-accent font-semibold">bandas salariales</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Datos de referencia para estructurar propuestas competitivas y retener talento técnico
            clave en el ecosistema científico chileno.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14 items-start">
          {/* Calculadora */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: reducedMotion ? 0.01 : 0.4, ease: "easeOut" }}
          >
            <Card className="rounded-xl border-0 shadow-none bg-surface-container-low p-6 sm:p-8 h-full">
              <CardHeader className="px-0 pt-0 pb-6">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <HugeiconsIcon icon={Calculator01Icon} size={20} className="text-secondary" />
                  Calculadora de presupuesto
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Rango estimado para una oferta de empleo competitiva
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-5">
                <div>
                  <label
                    htmlFor="b2b-career"
                    className="block text-xs font-medium text-foreground mb-1.5"
                  >
                    Cargo a contratar
                  </label>
                  <div className="relative">
                    <select
                      id="b2b-career"
                      value={career}
                      onChange={(e) => setCareer(e.target.value)}
                      className={cn(
                        "h-10 w-full appearance-none rounded-lg border border-border bg-surface-container-lowest px-3 pr-9 text-xs sm:text-sm text-foreground",
                        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 outline-none transition-colors"
                      )}
                    >
                      {BANDAS_SALARIALES_B2B.map((band) => (
                        <option key={band.career} value={band.career}>
                          {band.career}
                        </option>
                      ))}
                    </select>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-muted-foreground pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-medium text-foreground mb-1.5">
                    Nivel de experiencia
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(["junior", "senior"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setLevel(lvl)}
                        aria-pressed={level === lvl}
                        className={cn(
                          "px-3 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-all capitalize",
                          level === lvl
                            ? "border-secondary bg-secondary/10 text-secondary font-semibold"
                            : "border-border bg-surface-container-lowest text-muted-foreground hover:border-secondary/40 hover:text-foreground"
                        )}
                      >
                        {lvl === "junior" ? "Junior (0-2 años)" : "Senior (5+ años)"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-surface-container-lowest border border-border">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                    Banda recomendada (CLP líquido)
                  </span>
                  <p className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
                    {formatSalarioRango(range.min, range.max)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed text-pretty">
                    {selected.note}
                  </p>
                </div>
              </CardContent>
            </Card>
          </m.div>

          {/* Call to action card */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: reducedMotion ? 0.01 : 0.4, delay: 0.1, ease: "easeOut" }}
          >
            <Card className="rounded-xl border border-secondary/30 bg-surface-container-low shadow-none p-6 sm:p-8 h-full flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-2 block">
                  Publicación Especializada
                </span>
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 tracking-tight">
                  Publica tu oferta con banda salarial
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 text-pretty">
                  Las vacantes que transparentan el rango salarial en Biovity reciben hasta un{" "}
                  <strong className="text-foreground">3.2x más postulantes calificados</strong> de
                  comunidades científicas y universidades chilenas.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-muted-foreground">
                    <div className="size-1.5 rounded-full bg-secondary" />
                    <span>Filtros avanzados por técnicas de laboratorio y postgrados</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-muted-foreground">
                    <div className="size-1.5 rounded-full bg-secondary" />
                    <span>Sistema de seguimiento ATS integrado</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-muted-foreground">
                    <div className="size-1.5 rounded-full bg-secondary" />
                    <span>Publicación inicial gratuita sin tarjeta de crédito</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium"
                asChild
              >
                <Link href="/register/organization">
                  Publicar vacante en Biovity
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1.5" />
                </Link>
              </Button>
            </Card>
          </m.div>
        </div>
      </div>
    </section>
  )
}
