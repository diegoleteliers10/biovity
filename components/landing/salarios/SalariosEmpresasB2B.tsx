"use client"

import { ArrowRight01Icon, Calculator01Icon, Target01Icon } from "@hugeicons/core-free-icons"
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
    <section className="py-16 md:py-24 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4">
            <HugeiconsIcon icon={Target01Icon} size={16} />
            Para empresas y reclutadores en Chile
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6 tracking-tight">
            Guía B2B de <span className="text-accent font-semibold">bandas salariales</span> en
            Chile
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Referenciales de mercado para estructurar ofertas competitivas y evitar fuga de
              talentos clave entre regiones. Útil para RRHH, startups, laboratorios y plantas
              industriales en Chile.
            </p>
            <p>
              Las bandas consideran tramos Junior y Senior en CLP líquido mensual, con notas sobre
              premium por norma (ISP/GMP), bonos de faena en zona norte y especialidades clínicas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-start">
          {/* Calculadora */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: reducedMotion ? 0.01 : 0.4, ease: "easeOut" }}
          >
            <Card className="rounded-xl border border-accent/20 bg-surface-container-low h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <HugeiconsIcon icon={Calculator01Icon} size={20} className="text-accent" />
                  Calculadora de presupuesto de contratación
                </CardTitle>
                <CardDescription>
                  Rango sugerido en CLP para una oferta competitiva en Chile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <label
                    htmlFor="b2b-career"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Cargo a contratar
                  </label>
                  <div className="relative">
                    <select
                      id="b2b-career"
                      value={career}
                      onChange={(e) => setCareer(e.target.value)}
                      className={cn(
                        "h-10 w-full appearance-none rounded-md border border-input bg-input/20 px-3 pr-9 text-sm",
                        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 outline-none"
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
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-muted-foreground pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-medium text-foreground mb-1.5">
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
                          "px-3 py-2 rounded-lg border text-sm font-medium transition-all capitalize",
                          level === lvl
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border/20 bg-surface-container-lowest text-muted-foreground hover:border-accent/40 hover:text-foreground"
                        )}
                      >
                        {lvl === "junior" ? "Junior (0-2 años)" : "Senior (5+ años)"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 text-center">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Rango sugerido (líquido mensual)
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-accent font-mono break-words">
                    {formatSalarioRango(range.min, range.max)}
                  </p>
                  {selected.note && (
                    <p className="text-xs text-muted-foreground mt-2">{selected.note}</p>
                  )}
                </div>

                <Button
                  asChild
                  className="w-full h-11 bg-accent text-accent-foreground hover:bg-accent/80 font-semibold"
                >
                  <Link href="/empresas">
                    Publicar una vacante en Chile
                    <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </m.div>

          {/* Tabla de bandas */}
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{
              duration: reducedMotion ? 0.01 : 0.4,
              delay: reducedMotion ? 0 : 0.1,
              ease: "easeOut",
            }}
          >
            <Card className="rounded-xl border border-border/10 bg-surface-container-low h-full">
              <CardHeader>
                <CardTitle className="text-lg">Bandas de referencia por carrera</CardTitle>
                <CardDescription>CLP líquido mensual · Junior y Senior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {BANDAS_SALARIALES_B2B.map((band) => (
                  <div
                    key={band.career}
                    className={cn(
                      "rounded-lg border p-3 transition-colors",
                      band.career === selected.career
                        ? "border-accent/40 bg-accent/5"
                        : "border-border/10 bg-surface-container-lowest"
                    )}
                  >
                    <p className="font-semibold text-sm text-foreground">{band.career}</p>
                    <div className="mt-1.5 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block">Junior</span>
                        <span className="font-mono font-medium text-foreground">
                          {formatSalarioRango(band.juniorMin, band.juniorMax)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Senior</span>
                        <span className="font-mono font-medium text-accent">
                          {formatSalarioRango(band.seniorMin, band.seniorMax)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </m.div>
        </div>

        {/* Notas estratégicas B2B */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="rounded-xl border border-border/10 bg-surface-container-low">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Retención entre regiones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Atracción desde Santiago hacia Antofagasta (minería/procesos) o Puerto Montt
                (acuicultura) requiere bono de traslado y faena para ser competitivo.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-border/10 bg-surface-container-low">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Premium por norma</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cargos que exigen ISP, GMP, GLP, HACCP o SERNAGEOMIN deben ofertarse entre +15% y
                +25% sobre la base para atraer talento certificado.
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border border-border/10 bg-surface-container-low">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Especialidades clínicas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tecnólogos Médicos con especialidad (Imagenología, Laboratorio Clínico) y Químicos
                Farmacéuticos alcanzan los topes de banda al primer año de especialidad.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
