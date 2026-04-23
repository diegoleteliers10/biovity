"use client"

import { ArrowUpRight01Icon, Award01Icon, TrendingUp } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer as LazyChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/lazy-chart"

import { CARRERA_CHART_DATA } from "@/lib/data/salarios-data"
import { formatCurrencyCLP } from "@/lib/utils"

const chartConfig = {
  junior: {
    label: "Junior (0-2 años)",
    color: "hsl(var(--chart-1))",
  },
  senior: {
    label: "Senior (5+ años)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const CustomDuotoneBar = (props: React.SVGProps<SVGRectElement> & { dataKey?: string }) => {
  const { fill, x, y, width, height, dataKey } = props

  return (
    <>
      <rect
        rx={8}
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="none"
        fill={`url(#duotone-bar-pattern-${dataKey})`}
      />
      <defs>
        <linearGradient
          key={dataKey}
          id={`duotone-bar-pattern-${dataKey}`}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop offset="50%" stopColor={fill} stopOpacity={0.5} />
          <stop offset="50%" stopColor={fill} />
        </linearGradient>
      </defs>
    </>
  )
}

export function SalariosPorCarrera() {
  return (
    <section className="py-16 md:py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
            Sueldos por{" "}
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              Carrera
            </span>{" "}
            y Nivel de Experiencia
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              El nivel de experiencia es uno de los factores más determinantes en las remuneraciones
              del sector de biociencias. Nuestro análisis revela diferencias significativas entre
              perfiles Junior (0-2 años de experiencia) y Senior (5+ años), con variaciones que
              pueden superar el 100% en algunas carreras.
            </p>
            <p>
              Las carreras con mayor componente técnico y de análisis de datos, como Bioinformática
              e Ingeniería Civil Química, muestran las mayores brechas salariales, reflejando la
              alta demanda de experiencia especializada en estos campos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card className="rounded-xl border border-border/10 flex flex-col h-full bg-surface-container-lowest">
              <CardHeader>
                <CardTitle>Sueldos Promedio Mensual (CLP)</CardTitle>
                <CardDescription>Valores en miles de pesos chilenos (CLP)</CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-1 min-h-0">
                <LazyChartContainer
                  config={chartConfig}
                  className="w-full aspect-[4/3] md:aspect-video min-h-[200px] md:min-h-0"
                >
                  <BarChart
                    data={CARRERA_CHART_DATA}
                    margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
                  >
                    <XAxis
                      dataKey="carrera"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={5}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 9 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}K`}
                      width={40}
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
                              name: item.name === "junior" ? "Junior" : "Senior",
                            }))}
                          />
                        )
                      }}
                    />
                    <Bar
                      dataKey="junior"
                      fill="var(--color-junior)"
                      shape={<CustomDuotoneBar />}
                      radius={8}
                    />
                    <Bar
                      dataKey="senior"
                      fill="var(--color-senior)"
                      shape={<CustomDuotoneBar />}
                      radius={8}
                    />
                  </BarChart>
                </LazyChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-xl border border-border/10 bg-secondary/5">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <HugeiconsIcon icon={TrendingUp} size={20} className="text-secondary" />
                  </div>
                  <CardTitle className="text-lg">Insights Clave</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <HugeiconsIcon
                    icon={Award01Icon}
                    size={20}
                    className="text-secondary mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-sm">Bioinformática lidera</p>
                    <p className="text-xs text-muted-foreground">Mayor sueldo senior: $3.2M</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    size={20}
                    className="text-secondary mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-sm">Mayor crecimiento</p>
                    <p className="text-xs text-muted-foreground">
                      Brecha de $1.7M en Bioinformática
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {CARRERA_CHART_DATA.slice(0, 3).map((item) => (
              <Card
                key={item.carrera}
                className="rounded-xl border border-border/10 bg-surface-container-lowest hover:bg-secondary/5 transition-colors"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{item.carrera}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Junior</span>
                      <span className="font-mono font-semibold text-sm">
                        {formatCurrencyCLP(item.junior)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Senior</span>
                      <span className="font-mono font-semibold text-sm text-secondary">
                        {formatCurrencyCLP(item.senior)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {CARRERA_CHART_DATA.map((item) => (
            <Card
              key={item.carrera}
              className="rounded-xl border border-border/10 bg-surface-container-lowest hover:bg-secondary/5 transition-colors"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{item.carrera}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Junior</span>
                    <span className="font-mono font-semibold text-xs">
                      {formatCurrencyCLP(item.junior)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Senior</span>
                    <span className="font-mono font-semibold text-xs text-secondary">
                      {formatCurrencyCLP(item.senior)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border/10">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Diferencia</span>
                      <span className="font-mono text-xs font-medium">
                        +{formatCurrencyCLP(item.senior - item.junior)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
