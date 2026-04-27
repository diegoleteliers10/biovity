"use client"

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer as LazyChartContainer,
} from "@/components/ui/lazy-chart"

import { REGION_CHART_COLORS, REGION_CHART_DATA } from "@/lib/data/salarios-data"

const chartConfig = {
  promedio: {
    label: "Sueldo Promedio",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function SalariosPorRegion() {
  return (
    <section className="py-16 md:py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
            Comparativa Salarial por{" "}
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              Región
            </span>
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              La ubicación geográfica es un factor crucial en las remuneraciones del sector de
              biociencias en Chile. La concentración de industrias de alto valor agregado (Minería,
              Tech/Pharma) en ciertas zonas genera disparidades salariales significativas.
            </p>
            <p>
              Antofagasta, con su fuerte presencia minera y aplicaciones biotecnológicas, lidera los
              sueldos promedio. La Región Metropolitana, centro de servicios, farmacéuticas y
              tecnología, ocupa el segundo lugar, mientras que las regiones agroindustriales
              presentan rangos más moderados pero estables.
            </p>
          </div>
        </div>

        <Card className="rounded-xl border border-border/10 flex flex-col h-full bg-surface-container-lowest">
          <CardHeader>
            <CardTitle>Sueldo Promedio por Región</CardTitle>
            <CardDescription>Valores en miles de pesos chilenos (CLP)</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <LazyChartContainer
              config={chartConfig}
              className="w-full aspect-[4/3] md:aspect-video min-h-[200px] md:min-h-0"
            >
              <BarChart
                data={REGION_CHART_DATA}
                margin={{ top: 20, right: 10, left: 10, bottom: 40 }}
              >
                <XAxis
                  dataKey="region"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={5}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 10 }}
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
                        payload={[
                          {
                            name: "Promedio",
                            value: payload[0]?.value as number,
                            color: payload[0]?.color as string,
                            payload: payload[0]?.payload,
                          },
                        ]}
                      />
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
            </LazyChartContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
