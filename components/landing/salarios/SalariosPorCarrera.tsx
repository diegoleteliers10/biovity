"use client"

import { ArrowUpRight01Icon, Award01Icon, TradeUpIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { CARRERA_CHART_DATA } from "@/lib/data/salarios-data"
import { formatCurrencyCLP } from "@/lib/utils"

const chartConfig = {
  junior: {
    label: "Junior (0-2 años)",
    color: "#6366f1",
  },
  senior: {
    label: "Senior (5+ años)",
    color: "#10b981",
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

const DottedBackgroundPattern = () => {
  return (
    <pattern
      id="default-pattern-dots-carrera"
      x="0"
      y="0"
      width="10"
      height="10"
      patternUnits="userSpaceOnUse"
    >
      <circle className="dark:text-muted/40 text-muted" cx="2" cy="2" r="1" fill="currentColor" />
    </pattern>
  )
}

export function SalariosPorCarrera() {
  return (
    <section className="py-32 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Sueldos por Carrera
            </span>{" "}
            y Nivel de Experiencia
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
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
            <Card className="border-0 shadow-lg flex flex-col h-full">
              <CardHeader>
                <CardTitle>Sueldos Promedio Mensual (CLP)</CardTitle>
                <CardDescription>Valores en miles de pesos chilenos (CLP)</CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-1 min-h-0">
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <BarChart
                    data={CARRERA_CHART_DATA}
                    margin={{ top: 60, right: 30, left: 20, bottom: 100 }}
                  >
                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      fill="url(#default-pattern-dots-carrera)"
                    />
                    <defs>
                      <DottedBackgroundPattern />
                    </defs>
                    <XAxis
                      dataKey="carrera"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      angle={-45}
                      textAnchor="end"
                      height={100}
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
                            <div className="grid gap-2">
                              {payload.map((item) => (
                                <div
                                  key={item.name}
                                  className="grid grid-cols-[auto_1fr_auto] gap-2"
                                >
                                  <div
                                    className="h-2 w-2 rounded-full mt-1.5"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    {item.name === "junior" ? "Junior" : "Senior"}
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
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-3">
                <div className="grid grid-cols-[auto_1fr] gap-2">
                  <HugeiconsIcon icon={TradeUpIcon} size={20} className="text-blue-600" />
                  <CardTitle className="text-lg">Insights Clave</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-[auto_1fr] gap-3">
                  <HugeiconsIcon
                    icon={Award01Icon}
                    size={20}
                    className="text-blue-600 mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-sm">Bioinformática lidera</p>
                    <p className="text-xs text-gray-600">Mayor sueldo senior: $3.2M</p>
                  </div>
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-3">
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    size={20}
                    className="text-green-600 mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-sm">Mayor crecimiento</p>
                    <p className="text-xs text-gray-600">Brecha de $1.7M en Bioinformática</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {CARRERA_CHART_DATA.slice(0, 3).map((item) => (
              <Card key={item.carrera} className="border">
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
                      <span className="font-mono font-semibold text-sm text-blue-600">
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
            <Card key={item.carrera} className="border hover:shadow-md transition-shadow">
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
                    <span className="font-mono font-semibold text-xs text-blue-600">
                      {formatCurrencyCLP(item.senior)}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
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
