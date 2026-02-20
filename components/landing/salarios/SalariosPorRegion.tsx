"use client"

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { REGION_CHART_COLORS, REGION_CHART_DATA } from "@/lib/data/salarios-data"
import { formatCurrencyCLP } from "@/lib/utils"

const chartConfig = {
  promedio: {
    label: "Sueldo Promedio",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function SalariosPorRegion() {
  return (
    <>
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Comparativa Salarial por{" "}
              <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Región
              </span>
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                La ubicación geográfica es un factor crucial en las remuneraciones del sector de
                biociencias en Chile. La concentración de industrias de alto valor agregado
                (Minería, Tech/Pharma) en ciertas zonas genera disparidades salariales
                significativas.
              </p>
              <p>
                Antofagasta, con su fuerte presencia minera y aplicaciones biotecnológicas, lidera
                los sueldos promedio. La Región Metropolitana, centro de servicios, farmacéuticas y
                tecnología, ocupa el segundo lugar, mientras que las regiones agroindustriales
                presentan rangos más moderados pero estables.
              </p>
            </div>
          </div>

          <Card className="border-0 shadow-lg flex flex-col h-full">
            <CardHeader>
              <CardTitle>Sueldo Promedio por Región</CardTitle>
              <CardDescription>Valores en miles de pesos chilenos (CLP)</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart
                  data={REGION_CHART_DATA}
                  margin={{ top: 60, right: 30, left: 20, bottom: 120 }}
                >
                  <XAxis
                    dataKey="region"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}K`}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="mb-2 font-medium whitespace-pre-line">
                            {payload[0]?.payload?.region}
                          </div>
                          <div className="grid grid-cols-[1fr_auto] gap-4">
                            <span className="text-sm text-muted-foreground">Promedio</span>
                            <span className="font-mono font-medium text-right">
                              {formatCurrencyCLP(payload[0]?.value as number)}
                            </span>
                          </div>
                        </div>
                      )
                    }}
                  />
                  <Bar dataKey="promedio" fill="var(--color-promedio)" radius={[12, 12, 0, 0]}>
                    {REGION_CHART_DATA.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.region.replace(/\s/g, "-")}`}
                        fill={REGION_CHART_COLORS[index % REGION_CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
