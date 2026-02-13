"use client"

import { BarChart, Bar, XAxis, YAxis, Cell } from "recharts"
import { HugeiconsIcon } from "@hugeicons/react"
import { GraduationCap01Icon, Award01Icon } from "@hugeicons/core-free-icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

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

const DottedBackgroundPatternEducacion = () => {
  return (
    <pattern
      id="default-pattern-dots-educacion"
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

export function SalariosPorEducacion() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Impacto del{" "}
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Nivel Educativo
            </span>{" "}
            (Postgrado)
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
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
          <Card className="border-0 shadow-lg flex flex-col h-full">
            <CardHeader>
              <CardTitle>Sueldo Promedio por Nivel Educativo</CardTitle>
              <CardDescription>
                Comparativa de remuneraciones según nivel de postgrado
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <BarChart
                  data={EDUCACION_CHART_DATA}
                  margin={{ top: 60, right: 30, left: 20, bottom: 60 }}
                >
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#default-pattern-dots-educacion)"
                  />
                  <defs>
                    <DottedBackgroundPatternEducacion />
                  </defs>
                  <XAxis dataKey="nivel" tickLine={false} axisLine={false} tickMargin={10} />
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
                          <div className="mb-2 font-medium">{payload[0]?.payload?.nivel}</div>
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
                  <Bar
                    dataKey="promedio"
                    fill="var(--color-promedio)"
                    shape={<CustomDuotoneBar />}
                    radius={8}
                  >
                    {EDUCACION_CHART_DATA.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={EDUCACION_CHART_COLORS[index % EDUCACION_CHART_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-3">
                <div className="grid grid-cols-[auto_1fr] gap-2">
                  <HugeiconsIcon icon={GraduationCap01Icon} size={20} className="text-blue-600" />
                  <CardTitle className="text-lg">Insights Clave</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-[auto_1fr] gap-3">
                  <HugeiconsIcon icon={Award01Icon} size={20} className="text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Magíster lidera</p>
                    <p className="text-xs text-gray-600">$2.55M promedio, orientado a industria</p>
                  </div>
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-3">
                  <HugeiconsIcon icon={GraduationCap01Icon} className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Postgrado marca diferencia</p>
                    <p className="text-xs text-gray-600">+$1M sobre sin postgrado</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border bg-blue-50">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-700">
                  <strong>Nota:</strong> La diferencia entre Magíster y Doctorado se debe a que los
                  Magísteres suelen estar más orientados a la industria (Ingeniería Civil Química,
                  Bioinformática), mientras que los Doctorados a menudo se asocian a la
                  Academia/I+D, donde los sueldos base son más bajos, aunque con mayor flexibilidad.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
