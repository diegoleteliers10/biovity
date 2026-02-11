"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Building2, TrendingUp, Award } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { INDUSTRIA_CHART_DATA } from "@/lib/data/salarios-data"
import { formatCurrencyCLP } from "@/lib/utils"

const chartConfig = {
  minimo: {
    label: "Mínimo",
    color: "#6366f1",
  },
  promedio: {
    label: "Promedio",
    color: "#10b981",
  },
  maximo: {
    label: "Máximo",
    color: "#3b82f6",
  },
} satisfies ChartConfig

const CustomDuotoneBarMultiple = (
  props: React.SVGProps<SVGRectElement> & { dataKey?: string }
) => {
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

const DottedBackgroundPatternIndustria = () => {
  return (
    <pattern
      id="default-multiple-pattern-dots-industria"
      x="0"
      y="0"
      width="10"
      height="10"
      patternUnits="userSpaceOnUse"
    >
      <circle
        className="dark:text-muted/40 text-muted"
        cx="2"
        cy="2"
        r="1"
        fill="currentColor"
      />
    </pattern>
  )
}

export function SalariosPorIndustria() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-rubik">
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Sueldos por Industria
            </span>
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              El factor más determinante en la remuneración dentro del sector de biociencias es
              la industria en la que se desempeña el profesional. Nuestro análisis revela
              diferencias significativas entre sectores, con la minería liderando los rangos
              salariales más altos.
            </p>
            <p>
              Las industrias de alto valor agregado como Minería (aplicación de biotecnología),
              Tech/Pharma y Retail/Pharma ofrecen los mejores sueldos, mientras que sectores
              como Academia/I+D y Agroindustrial presentan rangos más moderados, aunque con
              mayor estabilidad y beneficios adicionales.
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-lg mb-8 flex flex-col h-full">
          <CardHeader>
            <CardTitle>Rangos Salariales por Industria</CardTitle>
            <CardDescription>
              Valores en miles de pesos chilenos (CLP) - Mínimo, Promedio y Máximo
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <BarChart
                data={INDUSTRIA_CHART_DATA}
                margin={{ top: 60, right: 30, left: 20, bottom: 100 }}
              >
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#default-multiple-pattern-dots-industria)"
                />
                <defs>
                  <DottedBackgroundPatternIndustria />
                </defs>
                <XAxis
                  dataKey="industria"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  angle={-45}
                  textAnchor="end"
                  height={120}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}K`}
                />
                <ChartTooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="mb-2 font-medium">
                          {payload[0]?.payload?.industria}
                        </div>
                        <div className="grid gap-2">
                          {payload.map((item, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-[auto_1fr_auto] gap-2"
                            >
                              <div
                                className="h-2 w-2 rounded-full mt-1.5"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm text-muted-foreground">
                                {item.name === "minimo"
                                  ? "Mínimo"
                                  : item.name === "maximo"
                                    ? "Máximo"
                                    : "Promedio"}
                              </span>
                              <span className="font-mono font-medium text-right">
                                {formatCurrencyCLP(item.value as number)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
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
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="mb-8">
          <Card className="border bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-3">
              <div className="grid grid-cols-[auto_1fr] gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Insights Clave</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-[auto_1fr] gap-3">
                <Award className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Minería lidera</p>
                  <p className="text-xs text-gray-600">
                    Promedio de $2.65M, rango hasta $3.5M
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-3">
                <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Tech/Pharma en crecimiento</p>
                  <p className="text-xs text-gray-600">
                    Segundo lugar con $2.35M promedio
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INDUSTRIA_CHART_DATA.map((item) => (
            <Card key={item.industria} className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{item.industria}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-[1fr_auto] gap-4">
                    <span className="text-sm text-muted-foreground">Mínimo</span>
                    <span className="font-mono font-semibold text-sm text-right">
                      {formatCurrencyCLP(item.minimo)}
                    </span>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] gap-4">
                    <span className="text-sm text-muted-foreground">Promedio</span>
                    <span className="font-mono font-semibold text-blue-600 text-right">
                      {formatCurrencyCLP(item.promedio)}
                    </span>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] gap-4">
                    <span className="text-sm text-muted-foreground">Máximo</span>
                    <span className="font-mono font-semibold text-sm text-right">
                      {formatCurrencyCLP(item.maximo)}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="grid grid-cols-[1fr_auto] gap-4">
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
