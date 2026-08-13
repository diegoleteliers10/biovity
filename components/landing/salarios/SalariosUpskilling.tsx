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
    <section className="py-16 md:py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6 tracking-tight">
            Impacto de <span className="text-accent font-semibold">habilidades</span> y trayectoria
            en Chile
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              No todas las competencias mueven el sueldo de la misma forma en Chile. Esta matriz
              muestra cuánto pueden incrementar la renta líquida las habilidades más demandadas en
              los sectores farma, minero, agro y tech del país.
            </p>
            <p>
              Junto con la línea de tiempo de carrera, te ayuda a priorizar en qué capacitar y dónde
              proyectar tu trayectoria profesional a 3, 5, 8 y 12 años.
            </p>
          </div>
        </div>

        {/* Matriz de impacto de habilidades */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-5">
            Matriz de impacto en la renta (Chile)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <Card className="rounded-xl border border-border/10 bg-surface-container-lowest h-full hover:bg-secondary/5 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className={`p-2 rounded-lg ${skill.bgColor}`}>
                          <HugeiconsIcon icon={skill.icon} size={22} className={skill.color} />
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${skill.color}`}>+{midImpact}%</p>
                          <p className="text-[0.65rem] text-muted-foreground leading-none mt-0.5">
                            promedio en sueldo base
                          </p>
                        </div>
                      </div>
                      <CardTitle className="text-base mt-3">{skill.skill}</CardTitle>
                      <CardDescription className="text-xs">{skill.sector}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {skill.description}
                      </p>
                      <div className="mt-3 pt-3 border-t border-border/10">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Rango estimado</span>
                          <span className={`font-mono font-semibold ${skill.color}`}>
                            +{skill.impactMin}% a +{skill.impactMax}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </m.div>
              )
            })}
          </div>
        </div>

        {/* Línea de tiempo de trayectoria */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3">
            <Card className="rounded-xl border border-border/10 bg-surface-container-lowest">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HugeiconsIcon icon={TrendingUp} size={20} className="text-secondary" />
                  Trayectoria salarial promedio (Chile)
                </CardTitle>
                <CardDescription>
                  Sueldo líquido mensual por tramo de experiencia (CLP)
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                        return (
                          <ChartTooltipContent
                            active={active}
                            payload={payload.map((item) => ({
                              ...item,
                              name: "Líquido mensual",
                            }))}
                          />
                        )
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="monthlyClp"
                      stroke="var(--color-monthlyClp)"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "var(--color-monthlyClp)" }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </LazyChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {TRAYECTORIA_CARRERA_CHILE.map((item, index) => (
              <div
                key={item.level}
                className="relative rounded-xl border border-border/10 bg-surface-container-lowest p-4 pl-6"
              >
                <span
                  className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-secondary"
                  style={{ opacity: 0.35 + index * 0.2 }}
                />
                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.yearsRange}</p>
                  </div>
                  <span className="font-mono font-bold text-secondary text-sm">
                    {formatAmountCLP(item.monthlyClp)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
