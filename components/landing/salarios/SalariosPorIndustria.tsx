"use client"

import { Award01Icon, Factory01Icon, TrendingUp } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer as LazyChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/lazy-chart"

import { INDUSTRIA_CHART_DATA } from "@/lib/data/salarios-data"
import { formatCurrencyCLP } from "@/lib/utils"

const chartConfig = {
  minimo: {
    label: "Mínimo",
    color: "hsl(var(--chart-3))",
  },
  promedio: {
    label: "Promedio",
    color: "hsl(var(--chart-1))",
  },
  maximo: {
    label: "Máximo",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const CustomDuotoneBarMultiple = (props: React.SVGProps<SVGRectElement> & { dataKey?: string }) => {
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

export function SalariosPorIndustria() {
  return (
    <section className="py-16 md:py-24 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
            Sueldos por{" "}
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              Industria
            </span>
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              El factor más determinante en la remuneración dentro del sector de biociencias es la
              industria en la que se desempeña el profesional. Nuestro análisis revela diferencias
              significativas entre sectores, con la minería liderando los rangos salariales más
              altos.
            </p>
            <p>
              Las industrias de alto valor agregado como Minería (aplicación de biotecnología),
              Tech/Pharma y Retail/Pharma ofrecen los mejores sueldos, mientras que sectores como
              Academia/I+D y Agroindustrial presentan rangos más moderados, aunque con mayor
              estabilidad y beneficios adicionales.
            </p>
          </div>
        </div>

        <Card className="rounded-xl border border-border/10 mb-8 flex flex-col h-full bg-surface-container-lowest">
          <CardHeader>
            <CardTitle>Rangos Salariales por Industria</CardTitle>
            <CardDescription>
              Valores en miles de pesos chilenos (CLP) - Mínimo, Promedio y Máximo
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <LazyChartContainer
              config={chartConfig}
              className="w-full aspect-[4/3] md:aspect-video min-h-[200px] md:min-h-0"
            >
              <BarChart
                data={INDUSTRIA_CHART_DATA}
                margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
              >
                <XAxis
                  dataKey="industria"
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
                    const labelMap: Record<string, string> = {
                      minimo: "Mínimo",
                      maximo: "Máximo",
                      promedio: "Promedio",
                    }
                    return (
                      <ChartTooltipContent
                        active={active}
                        payload={payload.map((item) => ({
                          ...item,
                          name: labelMap[item.name as string] ?? item.name,
                        }))}
                      />
                    )
                  }}
                />
                <Bar
                  dataKey="minimo"
                  fill="var(--color-minimo)"
                  shape={<CustomDuotoneBarMultiple />}
                  radius={8}
                />
                <Bar
                  dataKey="promedio"
                  fill="var(--color-promedio)"
                  shape={<CustomDuotoneBarMultiple />}
                  radius={8}
                />
                <Bar
                  dataKey="maximo"
                  fill="var(--color-maximo)"
                  shape={<CustomDuotoneBarMultiple />}
                  radius={8}
                />
              </BarChart>
            </LazyChartContainer>
          </CardContent>
        </Card>

        <div className="mb-8">
          <Card className="rounded-xl border border-border/10 bg-secondary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <HugeiconsIcon icon={Factory01Icon} size={20} className="text-secondary" />
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
                  <p className="font-semibold text-sm">Minería lidera</p>
                  <p className="text-xs text-muted-foreground">
                    Promedio de $2.65M, rango hasta $3.5M
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <HugeiconsIcon
                  icon={TrendingUp}
                  size={20}
                  className="text-secondary mt-0.5 shrink-0"
                />
                <div>
                  <p className="font-semibold text-sm">Tech/Pharma en crecimiento</p>
                  <p className="text-xs text-muted-foreground">Segundo lugar con $2.35M promedio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INDUSTRIA_CHART_DATA.map((item) => (
            <Card
              key={item.industria}
              className="rounded-xl border border-border/10 bg-surface-container-lowest hover:bg-secondary/5 transition-colors"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{item.industria}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Mínimo</span>
                    <span className="font-mono font-semibold text-sm text-right">
                      {formatCurrencyCLP(item.minimo)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Promedio</span>
                    <span className="font-mono font-semibold text-secondary text-right">
                      {formatCurrencyCLP(item.promedio)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Máximo</span>
                    <span className="font-mono font-semibold text-sm text-right">
                      {formatCurrencyCLP(item.maximo)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border/10">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Rango</span>
                      <span className="font-mono text-xs font-medium text-right">
                        {formatCurrencyCLP(item.maximo - item.minimo)}
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
