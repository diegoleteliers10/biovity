"use client"

import { ArrowRight01Icon, Search01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CARRERA_CHART_DATA,
  CARRERAS_STEM_CHILE,
  INDUSTRIA_CHART_DATA,
  INDUSTRIAS_CHILE,
  REGION_CHART_DATA,
  REGIONES_CHILE,
} from "@/lib/data/salarios-data"
import { cn, formatCurrencyCLP } from "@/lib/utils"

const INDUSTRY_AVG =
  INDUSTRIA_CHART_DATA.reduce((sum, i) => sum + i.promedio, 0) / INDUSTRIA_CHART_DATA.length
const REGION_AVG =
  REGION_CHART_DATA.reduce((sum, r) => sum + r.promedio, 0) / REGION_CHART_DATA.length

function industryModifier(industryValue: string): number {
  const found = INDUSTRIA_CHART_DATA.find((_, idx) => {
    const dataValue = INDUSTRIAS_CHILE[idx]?.value
    return dataValue === industryValue
  })
  if (!found) return 1
  return found.promedio / INDUSTRY_AVG
}

function regionLabelToData(regionLabel: string): number {
  const found = REGION_CHART_DATA.find((r) =>
    r.region.toLowerCase().includes(regionLabel.toLowerCase())
  )
  return found?.promedio ?? REGION_AVG
}

const REGION_SHORT: Record<string, string> = {
  ANTOFAGASTA: "Antofagasta",
  METROPOLITANA: "Metropolitana",
  OHIGGINS: "O'Higgins/Maule",
  MAULE: "O'Higgins/Maule",
  VALPARAISO: "Metropolitana",
  BIOBIO: "O'Higgins/Maule",
}

function regionModifier(regionValue: string): number {
  const short = REGION_SHORT[regionValue]
  if (!short) return 1
  const dataVal = regionLabelToData(short)
  return dataVal / REGION_AVG
}

function careerByName(careerValue: string) {
  const opt = CARRERAS_STEM_CHILE.find((c) => c.value === careerValue)
  const label = opt?.label ?? ""
  return (
    CARRERA_CHART_DATA.find((c) => label.toLowerCase().includes(c.carrera.toLowerCase())) ??
    CARRERA_CHART_DATA[0]
  )
}

export function SalariosInteractiveFilter() {
  const reducedMotion = useReducedMotion()
  const [career, setCareer] = useState(CARRERAS_STEM_CHILE[0].value)
  const [industry, setIndustry] = useState(INDUSTRIAS_CHILE[0].value)
  const [region, setRegion] = useState<string>(REGIONES_CHILE[2].value)
  const [hasSearched, setHasSearched] = useState(false)

  const estimate = useMemo(() => {
    const base = careerByName(career)
    const indMod = industryModifier(industry)
    const regMod = regionModifier(region)
    const junior = Math.round((base.junior * indMod * regMod) / 5) * 5 * 1000
    const senior = Math.round((base.senior * indMod * regMod) / 5) * 5 * 1000
    return { junior, senior, mid: Math.round((junior + senior) / 2) }
  }, [career, industry, region])

  const careerLabel = CARRERAS_STEM_CHILE.find((c) => c.value === career)?.label ?? ""
  const industryLabel = INDUSTRIAS_CHILE.find((i) => i.value === industry)?.label ?? ""
  const regionLabel = REGIONES_CHILE.find((r) => r.value === region)?.label ?? ""

  const handleExplore = () => setHasSearched(true)

  return (
    <section className="py-20 md:py-28 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Explorador Interactivo
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Estima tu sueldo por{" "}
            <span className="text-accent font-semibold">carrera, industria y región</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Combina las tres dimensiones determinantes de la renta en Chile para obtener un rango
            referencial estimado.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Filtros */}
          <Card className="rounded-xl border-0 shadow-none bg-surface-container-low lg:col-span-2 p-2 sm:p-4">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Configura tu búsqueda
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Selecciona las dimensiones del perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FilterSelect
                label="Carrera / Profesión"
                value={career}
                onChange={setCareer}
                options={CARRERAS_STEM_CHILE}
              />
              <FilterSelect
                label="Industria"
                value={industry}
                onChange={setIndustry}
                options={INDUSTRIAS_CHILE}
              />
              <FilterSelect
                label="Región de Chile"
                value={region}
                onChange={setRegion}
                options={REGIONES_CHILE}
              />
              <Button
                type="button"
                onClick={handleExplore}
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium mt-2"
              >
                <HugeiconsIcon icon={Search01Icon} size={16} className="mr-1.5" />
                Estimar sueldo
              </Button>
            </CardContent>
          </Card>

          {/* Resultado */}
          <div className="lg:col-span-3">
            <m.div
              key={`${career}-${industry}-${region}-${hasSearched ? "1" : "0"}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0.01 : 0.35, ease: "easeOut" }}
            >
              <Card className="rounded-xl border border-secondary/30 bg-surface-container-low shadow-none p-2 sm:p-4">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Estimación de Banda Salarial
                  </CardTitle>
                  <CardDescription className="text-xs font-mono text-secondary">
                    {careerLabel} • {industryLabel} • {regionLabel}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <EstimateCell label="Junior (0-2 años)" value={estimate.junior} />
                    <EstimateCell label="Mid (2-5 años)" value={estimate.mid} highlight />
                    <EstimateCell label="Senior (5+ años)" value={estimate.senior} />
                  </div>

                  <div className="rounded-xl bg-surface-container-lowest p-4 sm:p-5 border border-border">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                      {hasSearched ? (
                        <>
                          Esta estimación combina los datos de referencia oficiales de carrera,
                          industria y región del mercado chileno. Para obtener una comparativa de
                          percentil precisa, puedes completar la encuesta anónima.
                        </>
                      ) : (
                        <>
                          Ajusta los filtros según tu perfil y pulsa{" "}
                          <strong>“Estimar sueldo”</strong> para actualizar las bandas salariales de
                          referencia en CLP líquido mensual.
                        </>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </m.div>
          </div>
        </div>

        {/* Tabla resumen de referencia indexable para SEO */}
        <div className="mt-16 pt-10 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground tracking-tight">
                Rangos salariales de referencia en Chile (CLP líquido)
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Estimaciones basadas en el mercado laboral chileno para profesionales de ciencias e
                ingeniería.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="shrink-0 bg-surface-container-lowest border-border rounded-lg"
            >
              <Link href="/trabajos" className="flex items-center gap-1.5 text-xs font-medium">
                <span>Ver ofertas activas</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Link>
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-surface-container-lowest">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low border-b border-border text-muted-foreground text-xs uppercase font-mono">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">
                    Carrera / Especialidad
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">
                    Junior (0-2 años)
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">
                    Senior (5+ años)
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-right">
                    Vacantes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {CARRERA_CHART_DATA.map((item) => (
                  <tr
                    key={item.carrera}
                    className="hover:bg-surface-container-low/60 transition-colors"
                  >
                    <td className="px-5 py-3.5 font-medium text-foreground">{item.carrera}</td>
                    <td className="px-5 py-3.5 text-muted-foreground font-mono">
                      {formatCurrencyCLP(item.junior)}
                    </td>
                    <td className="px-5 py-3.5 text-foreground font-mono font-semibold">
                      {formatCurrencyCLP(item.senior)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/trabajos?q=${encodeURIComponent(item.carrera)}`}
                        className="text-xs text-secondary hover:underline font-medium inline-flex items-center gap-1"
                      >
                        Buscar vacantes &rarr;
                      </Link>
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

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-foreground mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className={cn(
            "h-10 w-full appearance-none rounded-lg border border-border bg-surface-container-lowest px-3 pr-9 text-xs sm:text-sm text-foreground",
            "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 outline-none transition-colors"
          )}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-foreground">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="rotate-90" />
        </div>
      </div>
    </div>
  )
}

function EstimateCell({
  label,
  value,
  highlight,
}: {
  label: string
  value: number
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-3.5 text-center transition-colors",
        highlight ? "border border-secondary/30 bg-secondary/10" : "bg-surface-container-lowest"
      )}
    >
      <p className="text-[11px] text-muted-foreground mb-1 font-mono">{label}</p>
      <p
        className={cn(
          "font-mono font-bold tracking-tight",
          highlight ? "text-secondary text-base sm:text-lg" : "text-foreground text-sm sm:text-base"
        )}
      >
        {formatCurrencyCLP(value / 1000)}
      </p>
    </div>
  )
}
