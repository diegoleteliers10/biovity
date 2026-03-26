"use client"

import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  DashboardSquare02Icon,
  File02Icon,
  Pulse01Icon,
  User02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useCallback, useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Pie,
  PieChart,
  XAxis,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"
import type { Metric } from "@/lib/types/dashboard"
import { MetricCard } from "./home/metricCard"

type TimeRange = "3m" | "6m" | "12m"

const CustomDuotoneBar = (props: React.SVGProps<SVGRectElement> & { dataKey?: string }) => {
  const { fill, x, y, width, height, dataKey } = props

  return (
    <>
      <rect
        rx={4}
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

const CustomDuotoneBarMultiple = (props: React.SVGProps<SVGRectElement> & { dataKey?: string }) => {
  const { fill, x, y, width, height, dataKey } = props

  return (
    <>
      <rect
        rx={4}
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

const DottedBackgroundPattern = ({ patternId }: { patternId: string }) => {
  return (
    <pattern id={patternId} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle className="dark:text-muted/40 text-muted" cx="2" cy="2" r="1" fill="currentColor" />
    </pattern>
  )
}

const MOCK_METRICS: Metric[] = [
  {
    title: "Postulaciones",
    value: 42,
    subtitle: "Últimos 30 días",
    icon: File02Icon,
  },
  {
    title: "Tasa de respuesta",
    value: "68%",
    subtitle: "Sobre total de postulaciones",
    icon: Pulse01Icon,
  },
  {
    title: "Entrevistas",
    value: 9,
    subtitle: "Agendadas / realizadas",
    icon: Calendar03Icon,
  },
  {
    title: "Ofertas recibidas",
    value: 2,
    subtitle: "Periodo actual",
    icon: CheckmarkCircle02Icon,
  },
  {
    title: "Tiempo medio de respuesta",
    value: "4.2 días",
    subtitle: "Desde postulación",
    icon: Clock01Icon,
  },
  {
    title: "Vistas de perfil",
    value: 76,
    subtitle: "Reclutadores únicos",
    icon: User02Icon,
  },
]

export const MetricsContent = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("6m")

  const { useSession } = authClient
  const { data: session, isPending: sessionPending } = useSession()
  const firstName = session?.user?.name?.split(" ")[0] || "Usuario"

  const handleSetRange = useCallback((range: TimeRange) => setTimeRange(range), [])

  const applicationsOverTimeData = useMemo(() => {
    const base = [
      { month: "May", applications: 8 },
      { month: "Jun", applications: 11 },
      { month: "Jul", applications: 7 },
      { month: "Aug", applications: 10 },
      { month: "Sep", applications: 6 },
      { month: "Oct", applications: 12 },
      { month: "Nov", applications: 9 },
      { month: "Dec", applications: 13 },
      { month: "Jan", applications: 5 },
      { month: "Feb", applications: 8 },
      { month: "Mar", applications: 14 },
      { month: "Apr", applications: 10 },
    ]

    if (timeRange === "3m") return base.slice(-3)
    if (timeRange === "6m") return base.slice(-6)
    return base
  }, [timeRange])

  const applicationsChartConfig = {
    applications: {
      label: "Postulaciones",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  const responseTimeData = useMemo(
    () => [
      { period: "< 24h", count: 12 },
      { period: "1-3d", count: 18 },
      { period: "4-7d", count: 8 },
      { period: "> 7d", count: 4 },
    ],
    []
  )

  const responseTimeChartConfig = {
    count: {
      label: "Postulaciones",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  const pipelineData = useMemo(
    () => [
      { stage: "Aplicado", count: 42 },
      { stage: "Revisión", count: 28 },
      { stage: "Entrevista", count: 9 },
      { stage: "Oferta", count: 2 },
      { stage: "Contratado", count: 1 },
    ],
    []
  )

  const pipelineChartConfig = {
    count: {
      label: "Cantidad",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  const totalPipeline = pipelineData.reduce((sum, s) => sum + s.count, 0)

  const industriesData = useMemo(
    () => [
      { industry: "Biotech", count: 18 },
      { industry: "Farmacéutica", count: 11 },
      { industry: "Investigación", count: 8 },
      { industry: "Salud", count: 7 },
      { industry: "Educación", count: 4 },
    ],
    []
  )

  const industriesDataWithColors = useMemo(
    () =>
      industriesData.map((entry, index) => ({
        ...entry,
        fill: `var(--chart-${(index % 5) + 1})`,
      })),
    [industriesData]
  )

  const industriesChartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}
    industriesData.forEach((_, i) => {
      config[`chart${i + 1}`] = { label: "", color: `var(--chart-${i + 1})` }
    })
    return config
  }, [industriesData])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        {sessionPending ? (
          <div className="space-y-2">
            <Skeleton className="h-9 w-80" />
            <Skeleton className="h-5 w-96" />
          </div>
        ) : (
          <div className="space-y-1">
            <h1 className="text-[28px] font-bold tracking-wide text-foreground">
              ¡Bienvenido/a de vuelta, {firstName}!
            </h1>
            <p className="text-muted-foreground">
              Seguimiento de postulaciones, embudo de contratación y rendimiento reciente.
            </p>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 rounded-lg border p-1 bg-white">
            <Button
              variant={timeRange === "3m" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleSetRange("3m")}
              aria-label="Rango 3 meses"
            >
              3M
            </Button>
            <Button
              variant={timeRange === "6m" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleSetRange("6m")}
              aria-label="Rango 6 meses"
            >
              6M
            </Button>
            <Button
              variant={timeRange === "12m" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleSetRange("12m")}
              aria-label="Rango 12 meses"
            >
              12M
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_METRICS.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border border-border/80 bg-white lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={DashboardSquare02Icon} size={24} strokeWidth={1.5} />
              <CardTitle className="text-foreground">Postulaciones por mes</CardTitle>
            </div>
            <CardDescription>Evolución de postulaciones en el período seleccionado</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={applicationsChartConfig}>
              <AreaChart accessibilityLayer data={applicationsOverTimeData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="gradient-applications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-applications)" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="var(--color-applications)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="applications"
                  type="natural"
                  fill="url(#gradient-applications)"
                  fillOpacity={0.4}
                  stroke="var(--color-applications)"
                  strokeWidth={0.8}
                  strokeDasharray={"3 3"}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-white">
          <CardHeader>
            <CardTitle className="text-foreground">Tiempo de respuesta</CardTitle>
            <CardDescription>Distribución por período</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={responseTimeChartConfig}>
              <BarChart accessibilityLayer data={responseTimeData}>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="85%"
                  fill="url(#default-pattern-dots-response)"
                />
                <defs>
                  <DottedBackgroundPattern patternId="default-pattern-dots-response" />
                </defs>
                <XAxis dataKey="period" tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  shape={<CustomDuotoneBar />}
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border border-border/80 bg-white lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">
              Embudo de contratación
              <Badge variant="outline" className="text-primary bg-primary/10 border-none ml-2">
                {totalPipeline} aplicaciones
              </Badge>
            </CardTitle>
            <CardDescription>Progreso por etapa del proceso</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pipelineChartConfig}>
              <BarChart accessibilityLayer data={pipelineData}>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="85%"
                  fill="url(#default-multiple-pattern-dots)"
                />
                <defs>
                  <DottedBackgroundPattern patternId="default-multiple-pattern-dots" />
                </defs>
                <XAxis dataKey="stage" tickLine={false} tickMargin={10} axisLine={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" hideLabel />}
                />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  shape={<CustomDuotoneBarMultiple />}
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border border-border/80 bg-white flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-foreground">Industrias aplicadas</CardTitle>
            <CardDescription>Distribución por industria</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={industriesChartConfig}
              className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
                <Pie
                  data={industriesDataWithColors}
                  innerRadius={30}
                  dataKey="count"
                  nameKey="industry"
                  radius={10}
                  cornerRadius={8}
                  paddingAngle={4}
                >
                  <LabelList
                    dataKey="count"
                    stroke="none"
                    fontSize={12}
                    fontWeight={500}
                    fill="currentColor"
                    formatter={(value: number) => value.toString()}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
