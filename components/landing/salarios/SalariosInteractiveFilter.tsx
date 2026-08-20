"use client"

import { ArrowRight01Icon, FilterEditIcon, Search01Icon } from "@hugeicons/core-free-icons"
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
    <section className="py-16 md:py-24 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium mb-4">
            <HugeiconsIcon icon={FilterEditIcon} size={16} />
            Explorador interactivo
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6 tracking-tight">
            Estima tu sueldo por{" "}
            <span className="text-accent font-semibold">carrera, industria y región</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Combina las tres dimensiones que más mueven la renta en Chile. Los valores son una
            estimación basada en los datos de referencia del mercado chileno.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Filtros */}
          <Card className="rounded-xl border border-border/10 bg-surface-container-low lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Configura tu búsqueda</CardTitle>
              <CardDescription>Selecciona las tres dimensiones clave</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
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
                className="w-full h-10 bg-zinc-900 hover:bg-zinc-800 text-white"
              >
                <HugeiconsIcon icon={Search01Icon} size={18} />
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
              <Card className="rounded-xl border border-secondary/20 bg-surface-container-low h-full">
                <CardHeader>
                  <CardTitle className="text-lg">Estimación para tu perfil</CardTitle>
                  <CardDescription className="text-xs">
                    {careerLabel} · {industryLabel} · {regionLabel}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <EstimateCell label="Junior" value={estimate.junior} />
                    <EstimateCell label="Mid" value={estimate.mid} highlight />
                    <EstimateCell label="Senior" value={estimate.senior} />
                  </div>

                  <div className="rounded-lg border border-border/10 bg-surface-container-lowest p-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {hasSearched ? (
                        <>
                          Esta estimación combina los datos de referencia de carrera, industria y
                          región del mercado chileno. Para ver tu <strong>percentil real</strong> y
                          los datos crowdsourced, completa la encuesta anónima más abajo.
                        </>
                      ) : (
                        <>
                          Ajusta los filtros y pulsa <strong>“Estimar sueldo”</strong> para ver el
                          rango estimado. Para un dato personalizado, completa la encuesta anónima
                          Give to Get.
                        </>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </m.div>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Referencia basada en datos de {CARRERA_CHART_DATA.length} carreras,{" "}
          {INDUSTRIA_CHART_DATA.length} industrias y {REGION_CHART_DATA.length} zonas de Chile.
        </p>

        {/* Tabla resumen de referencia indexable para SEO */}
        <div className="mt-12 pt-8 border-t border-border/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground tracking-tight">
                Rangos salariales de referencia en Chile (CLP líquido)
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Estimaciones basadas en el mercado laboral chileno para profesionales de ciencias e
                ingeniería.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild className="shrink-0 bg-white">
              <Link href="/trabajos" className="flex items-center gap-1.5">
                <span>Ver ofertas de empleo</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-low border-b border-border/10 text-muted-foreground text-xs uppercase">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Carrera / Especialidad
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Junior (0-2 años)
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Senior (5+ años)
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-right">
                    Vacantes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {CARRERA_CHART_DATA.map((item) => (
                  <tr key={item.carrera} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{item.carrera}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">
                      {formatCurrencyCLP(item.junior)}
                    </td>
                    <td className="px-4 py-3 text-foreground font-mono font-semibold">
                      {formatCurrencyCLP(item.senior)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/trabajos?q=${encodeURIComponent(item.carrera)}`}
                        className="text-xs text-accent hover:underline font-medium"
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
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  const selectId = `filter-${label.replace(/\s+/g, "-").toLowerCase()}`
  return (
    <div>
      <label htmlFor={selectId} className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className={cn(
            "h-10 w-full appearance-none rounded-md border border-input bg-input/20 px-3 pr-9 text-sm",
            "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 outline-none"
          )}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <HugeiconsIcon
          icon={Search01Icon}
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-muted-foreground pointer-events-none"
        />
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
        "rounded-lg border p-3 text-center",
        highlight
          ? "border-secondary/40 bg-secondary/5"
          : "border-border/10 bg-surface-container-lowest"
      )}
    >
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p
        className={cn(
          "font-mono font-bold",
          highlight ? "text-secondary text-base" : "text-foreground text-sm"
        )}
      >
        {formatCurrencyCLP(value / 1000)}
      </p>
    </div>
  )
}
