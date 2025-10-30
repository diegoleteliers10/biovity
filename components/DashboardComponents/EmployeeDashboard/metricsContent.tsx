"use client"

import {
  Analytics01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  DashboardSquare02Icon,
  File02Icon,
  FlashIcon,
  Pulse01Icon,
  Clock01Icon,
  User02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMemo, useState, useRef } from "react"
import { useSpring, useMotionValueEvent } from "motion/react"
import { Area, AreaChart, CartesianGrid, XAxis, Bar, BarChart, Pie, PieChart, LabelList } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

type TimeRange = "3m" | "6m" | "12m"

// Custom bar components for DuotoneBarChart
const CustomDuotoneBar = (
  props: React.SVGProps<SVGRectElement> & { dataKey?: string }
) => {
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
    <pattern
      id={patternId}
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

// Custom bar for multiple series
const CustomDuotoneBarMultiple = (
  props: React.SVGProps<SVGRectElement> & { dataKey?: string }
) => {
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

export const MetricsContent = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("6m")
  const chartRef = useRef<HTMLDivElement>(null)
  const [axis, setAxis] = useState(0)

  const springX = useSpring(0, {
    damping: 30,
    stiffness: 100,
  })
  const springY = useSpring(0, {
    damping: 30,
    stiffness: 100,
  })

  useMotionValueEvent(springX, "change", (latest) => {
    setAxis(latest)
  })

  const handleSetRange = (range: TimeRange) => setTimeRange(range)

  const kpis = useMemo(
    () => [
      {
        title: "Postulaciones",
        value: 42,
        subtitle: "Últimos 30 días",
        icon: File02Icon,
        trend: "+12%",
        trendPositive: true,
      },
      {
        title: "Tasa de respuesta",
        value: "68%",
        subtitle: "Sobre total de postulaciones",
        icon: Pulse01Icon,
        trend: "+5.2%",
        trendPositive: true,
      },
      {
        title: "Entrevistas",
        value: 9,
        subtitle: "Agendadas / realizadas",
        icon: Calendar03Icon,
        trend: "+3",
        trendPositive: true,
      },
      {
        title: "Ofertas recibidas",
        value: 2,
        subtitle: "Periodo actual",
        icon: CheckmarkCircle02Icon,
        trend: "Estable",
        trendPositive: true,
      },
      {
        title: "Tiempo medio de respuesta",
        value: "4.2 días",
        subtitle: "Desde postulación",
        icon: Clock01Icon,
        trend: "-0.5 días",
        trendPositive: true,
      },
      {
        title: "Vistas de perfil",
        value: 76,
        subtitle: "Reclutadores únicos",
        icon: User02Icon,
        trend: "+18%",
        trendPositive: true,
      },
    ],
    []
  )

  // Dataset para postulaciones por mes (AreaChart con gradiente)
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

  // Dataset para tiempo de respuesta (DuotoneBarChart)
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

  // Dataset para embudo de contratación (DuotoneBarMultipleChart)
  const pipelineData = useMemo(
    () => [
      { stage: "Aplicado", aplicado: 42, revisión: 0 },
      { stage: "Revisión", aplicado: 0, revisión: 28 },
      { stage: "Entrevista", aplicado: 0, revisión: 0, entrevista: 9 },
      { stage: "Oferta", aplicado: 0, revisión: 0, entrevista: 0, oferta: 2 },
      {
        stage: "Contratado",
        aplicado: 0,
        revisión: 0,
        entrevista: 0,
        oferta: 0,
        contratado: 1,
      },
    ],
    []
  )

  const pipelineChartConfig = {
    aplicado: {
      label: "Aplicado",
      color: "var(--chart-1)",
    },
    revisión: {
      label: "En revisión",
      color: "var(--chart-2)",
    },
    entrevista: {
      label: "Entrevista",
      color: "var(--chart-3)",
    },
    oferta: {
      label: "Oferta",
      color: "var(--chart-4)",
    },
    contratado: {
      label: "Contratado",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig

  // Dataset para industrias (PieChart)
  const industriesData = useMemo(
    () => [
      { industry: "Biotech", count: 18, fill: "var(--color-biotech)" },
      { industry: "Farmacéutica", count: 11, fill: "var(--color-farmaceutica)" },
      { industry: "Investigación", count: 8, fill: "var(--color-investigacion)" },
      { industry: "Salud", count: 7, fill: "var(--color-salud)" },
      { industry: "Educación", count: 4, fill: "var(--color-educacion)" },
    ],
    []
  )

  const industriesChartConfig = {
    count: {
      label: "Postulaciones",
    },
    biotech: {
      label: "Biotech",
      color: "var(--chart-1)",
    },
    farmaceutica: {
      label: "Farmacéutica",
      color: "var(--chart-2)",
    },
    investigacion: {
      label: "Investigación",
      color: "var(--chart-3)",
    },
    salud: {
      label: "Salud",
      color: "var(--chart-4)",
    },
    educacion: {
      label: "Educación",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig

  // Pre-process industries data with correct colors
  const industriesDataWithColors = useMemo(
    () =>
      industriesData.map((entry, index) => ({
        ...entry,
        fill: `var(--chart-${(index % 5) + 1})`,
      })),
    [industriesData]
  )

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold tracking-wide">Métricas del Candidato</h1>
          <p className="text-muted-foreground">
            Seguimiento de postulaciones, embudo de contratación y rendimiento reciente.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 rounded-lg border p-1 bg-card">
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

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <HugeiconsIcon
                icon={kpi.icon}
                size={24}
                strokeWidth={1.5}
                className="h-4 w-4 text-muted-foreground"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              {kpi.trend && (
                <p
                  className={cn(
                    "text-xs flex items-center gap-1 mt-1",
                    kpi.trendPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {kpi.trendPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {kpi.trend}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Postulaciones por mes - GradientRoundedAreaChart style */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={DashboardSquare02Icon} size={24} strokeWidth={1.5} />
                <CardTitle>
                  Postulaciones por mes
                  <Badge
                    variant="outline"
                    className="text-green-500 bg-green-500/10 border-none ml-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span>12%</span>
                  </Badge>
                </CardTitle>
              </div>
            </div>
            <CardDescription>
              Evolución de postulaciones en el período seleccionado
            </CardDescription>
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
                  <linearGradient
                    id="gradient-applications"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="var(--color-applications)"
                      stopOpacity={0.5}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-applications)"
                      stopOpacity={0.1}
                    />
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

        {/* Tiempo de respuesta - DuotoneBarChart */}
        <Card>
          <CardHeader>
            <CardTitle>
              Tiempo de respuesta
              <Badge
                variant="outline"
                className="text-green-500 bg-green-500/10 border-none ml-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Mejorando</span>
              </Badge>
            </CardTitle>
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
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
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

      {/* Embudo y Industrias */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Embudo de contratación - DuotoneBarMultipleChart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Embudo de contratación
              <Badge
                variant="outline"
                className="text-blue-500 bg-blue-500/10 border-none ml-2"
              >
                <span>42 aplicaciones</span>
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
                <XAxis
                  dataKey="stage"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" hideLabel />}
                />
                <Bar
                  dataKey="aplicado"
                  fill="var(--color-aplicado)"
                  shape={<CustomDuotoneBarMultiple />}
                  radius={4}
                />
                <Bar
                  dataKey="revisión"
                  fill="var(--color-revisión)"
                  shape={<CustomDuotoneBarMultiple />}
                  radius={4}
                />
                <Bar
                  dataKey="entrevista"
                  fill="var(--color-entrevista)"
                  shape={<CustomDuotoneBarMultiple />}
                  radius={4}
                />
                <Bar
                  dataKey="oferta"
                  fill="var(--color-oferta)"
                  shape={<CustomDuotoneBarMultiple />}
                  radius={4}
                />
                <Bar
                  dataKey="contratado"
                  fill="var(--color-contratado)"
                  shape={<CustomDuotoneBarMultiple />}
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Industrias aplicadas - RoundedPieChart */}
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>
              Industrias aplicadas
              <Badge
                variant="outline"
                className="text-green-500 bg-green-500/10 border-none ml-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span>5 sectores</span>
              </Badge>
            </CardTitle>
            <CardDescription>Distribución por industria</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={industriesChartConfig}
              className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="count" hideLabel />}
                />
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
