"use client"

import { Award01Icon, GraduationScrollIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  ChartContainer as LazyChartContainer,
} from "@/components/ui/lazy-chart"

import { EDUCACION_CHART_COLORS, EDUCACION_CHART_DATA } from "@/lib/data/salarios-data"
import { formatCurrencyCLP } from "@/lib/utils"

const chartConfig = {
  promedio: {
    label: "Sueldo Promedio",
    color: "hsl(var(--chart-1))",
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

export function SalariosPorEducacion() {
  return (
    <section className="py-16 md:py-24 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 tracking-tight">
            Impacto del{" "}
            <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
              Nivel Educativo
            </span>{" "}
            (Postgrado)
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              La especialización a través de postgrados es un factor clave para acceder a los
              sueldos más altos en el sector de biociencias, especialmente en roles de I+D y
              Bioinformática. Nuestro análisis revela diferencias significativas entre profesionales
              con y sin postgrado.
            </p>
            <p>
              Los Magísteres orientados a la industria (Ingeniería Civil Química, Bioinformática)
              suelen obtener los mejores sueldos, mientras que los Doctorados, aunque altamente
              valorados, a menudo se asocian a la Academia/I+D, donde los sueldos base son más bajos
              pero con mayor flexibilidad y beneficios adicionales.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="rounded-xl border border-border/10 flex flex-col h-full bg-surface-container-lowest">
            <CardHeader>
              <CardTitle>Sueldo Promedio por Nivel Educativo</CardTitle>
              <CardDescription>
                Comparativa de remuneraciones según nivel de postgrado
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <LazyChartContainer
                config={chartConfig}
                className="w-full aspect-[4/3] md:aspect-video min-h-[200px] md:min-h-0"
              >
                <BarChart
                  data={EDUCACION_CHART_DATA}
                  margin={{ top: 20, right: 10, left: 10, bottom: 40 }}
                >
                  <XAxis
                    dataKey="nivel"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={5}
                    tick={{ fontSize: 11 }}
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
                  <Bar
                    dataKey="promedio"
                    fill="var(--color-promedio)"
                    shape={<CustomDuotoneBar />}
                    radius={8}
                  >
                    {EDUCACION_CHART_DATA.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.nivel}`}
                        fill={EDUCACION_CHART_COLORS[index % EDUCACION_CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </LazyChartContainer>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="rounded-xl border border-border/10 bg-secondary/5">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <HugeiconsIcon
                      icon={GraduationScrollIcon}
                      size={20}
                      className="text-secondary"
                    />
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
                    <p className="font-semibold text-sm">Magíster lidera</p>
                    <p className="text-xs text-muted-foreground">
                      $2.55M promedio, orientado a industria
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <HugeiconsIcon
                    icon={GraduationScrollIcon}
                    className="w-5 h-5 text-secondary mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-sm">Postgrado marca diferencia</p>
                    <p className="text-xs text-muted-foreground">+$1M sobre sin postgrado</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-border/10 bg-surface-container-lowest">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Nota:</strong> La diferencia entre Magíster y
                  Doctorado se debe a que los Magísteres suelen estar más orientados a la industria
                  (Ingeniería Civil Química, Bioinformática), mientras que los Doctorados a menudo
                  se asocian a la Academia/I+D, donde los sueldos base son más bajos, aunque con
                  mayor flexibilidad.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
