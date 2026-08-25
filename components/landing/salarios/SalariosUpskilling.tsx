"use client"

import { TrendingUp } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useReducedMotion } from "motion/react"
import * as m from "motion/react-m"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer as LazyChartContainer,
} from "@/components/ui/lazy-chart"
import { SKILLS_IMPACTO_CHILE, TRAYECTORIA_CARRERA_CHILE } from "@/lib/data/salarios-data"
import { formatAmountCLP } from "@/lib/utils"

const [LineChart, Line, XAxis, YAxis, CartesianGrid] = await Promise.all([
  import("recharts").then((m) => m.LineChart),
  import("recharts").then((m) => m.Line),
  import("recharts").then((m) => m.XAxis),
  import("recharts").then((m) => m.YAxis),
  import("recharts").then((m) => m.CartesianGrid),
])

const chartConfig = {
  monthlyClp: {
    label: "Sueldo líquido mensual (CLP)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const trajectoryData = TRAYECTORIA_CARRERA_CHILE.map((t) => ({
  level: t.label,
  monthlyClp: t.monthlyClp,
  years: t.yearsRange,
  description: t.description,
}))

export function SalariosUpskilling() {
  const reducedMotion = useReducedMotion()
  return (
    <section className="py-20 md:py-28 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-3xl">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
            Impacto & Proyección
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight text-balance">
            Impacto de <span className="text-accent font-semibold">habilidades clave</span> en la
            renta
          </h2>
          <div className="space-y-3 text-muted-foreground leading-relaxed text-base sm:text-lg text-pretty">
            <p>
              Ciertas competencias técnicas, regulatorias y de postgrado generan un diferencial
              sustancial en el salario base de biociencias en Chile.
            </p>
          </div>
        </div>

        {/* Matriz de impacto de habilidades - Clean borderless white cards on surface-container-low */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SKILLS_IMPACTO_CHILE.map((skill, index) => {
              const midImpact = Math.round((skill.impactMin + skill.impactMax) / 2)
              return (
                <m.div
                  key={skill.skill}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                  transition={{
                    duration: reducedMotion ? 0.01 : 0.35,
                    delay: reducedMotion ? 0 : index * 0.05,
                    ease: "easeOut",
                  }}
                >
                  <Card className="rounded-xl border-0 shadow-none bg-surface-container-lowest h-full p-6 sm:p-7 flex flex-col justify-between hover:bg-white/80 transition-colors">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className={`p-2.5 rounded-lg ${skill.bgColor}`}>
                          <HugeiconsIcon icon={skill.icon} size={20} className={skill.color} />
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold tracking-tight ${skill.color}`}>
                            +{midImpact}%
                          </p>
                          <p className="text-[10px] font-mono text-muted-foreground leading-none mt-0.5">
                            incremento medio
                          </p>
                        </div>
                      </div>
                      <h3 className="text-base font-semibold text-foreground mb-1">
                        {skill.skill}
                      </h3>
                      <p className="text-xs font-mono text-secondary mb-3">{skill.sector}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-pretty">
                        {skill.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Rango estimado</span>
                      <span className={`font-mono font-semibold ${skill.color}`}>
                        +{skill.impactMin}% a +{skill.impactMax}%
                      </span>
                    </div>
                  </Card>
                </m.div>
              )
            })}
          </div>
        </div>

        {/* Línea de tiempo de trayectoria - Structured card with subtle border */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3">
            <Card className="rounded-xl border border-border bg-surface-container-lowest shadow-none p-4 sm:p-6">
              <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <HugeiconsIcon icon={TrendingUp} size={18} className="text-secondary" />
                  Trayectoria salarial promedio (Chile)
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Sueldo líquido mensual por tramo de experiencia (CLP)
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <LazyChartContainer
                  config={chartConfig}
                  className="w-full aspect-[4/3] md:aspect-video min-h-[240px]"
                >
                  <LineChart
                    data={trajectoryData}
                    margin={{ top: 16, right: 16, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="level"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${Math.round((value / 1000000) * 10) / 10}M`}
                      width={50}
                      tick={{ fontSize: 10 }}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        const data = payload[0].payload as (typeof trajectoryData)[0]
                        return (
                          <ChartTooltipContent>
                            <div className="space-y-1">
                              <p className="font-semibold text-foreground text-xs">{data.level}</p>
                              <p className="text-xs text-secondary font-mono">
                                {formatAmountCLP(data.monthlyClp)} / mes
                              </p>
                              <p className="text-[10px] text-muted-foreground">{data.years}</p>
                            </div>
                          </ChartTooltipContent>
                        )
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="monthlyClp"
                      stroke="#006b5e"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#006b5e", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#00374a" }}
                    />
                  </LineChart>
                </LazyChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {TRAYECTORIA_CARRERA_CHILE.map((t) => (
              <div
                key={t.label}
                className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 border border-border transition-colors hover:border-secondary/40"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-foreground">{t.label}</span>
                  <span className="text-xs font-mono font-semibold text-secondary">
                    {formatAmountCLP(t.monthlyClp)}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground block mb-1">
                  {t.yearsRange}
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed text-pretty">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
