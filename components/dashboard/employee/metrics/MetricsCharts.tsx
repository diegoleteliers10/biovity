"use client"

import { DashboardSquare02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/lazy-chart"
import type { MetricsPeriod } from "@/lib/types/organization-metrics"
import type { UserMetrics } from "@/lib/types/user-metrics"

const [Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, PieChart, Pie, XAxis] =
  await Promise.all([
    import("recharts").then((m) => m.Area),
    import("recharts").then((m) => m.AreaChart),
    import("recharts").then((m) => m.Bar),
    import("recharts").then((m) => m.BarChart),
    import("recharts").then((m) => m.CartesianGrid),
    import("recharts").then((m) => m.LabelList),
    import("recharts").then((m) => m.PieChart),
    import("recharts").then((m) => m.Pie),
    import("recharts").then((m) => m.XAxis),
  ])

type ChartsGridProps = {
  metricsData: UserMetrics | undefined
  period: MetricsPeriod
}

const DottedBackgroundPattern = ({ patternId }: { patternId: string }) => {
  return (
    <pattern id={patternId} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
      <circle className="dark:text-muted/40 text-muted" cx="2" cy="2" r="1" fill="currentColor" />
    </pattern>
  )
}

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

type ApplicationsChartProps = {
  data: Array<{ month: string; applications: number }>
  config: ChartConfig
}

function ApplicationsChart({ data, config }: ApplicationsChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
        Sin datos disponibles
      </div>
    )
  }
  return (
    <ChartContainer config={config}>
      <AreaChart accessibilityLayer data={data}>
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
  )
}

type ResponseTimeChartProps = {
  data: Array<{ period: string; count: number }>
  config: ChartConfig
}

function ResponseTimeChart({ data, config }: ResponseTimeChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
        Sin datos disponibles
      </div>
    )
  }
  return (
    <ChartContainer config={config}>
      <BarChart accessibilityLayer data={data}>
        <rect x="0" y="0" width="100%" height="85%" fill="url(#default-pattern-dots-response)" />
        <defs>
          <DottedBackgroundPattern patternId="default-pattern-dots-response" />
        </defs>
        <XAxis dataKey="period" tickLine={false} tickMargin={10} axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" fill="var(--color-count)" shape={<CustomDuotoneBar />} radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

type PipelineChartProps = {
  data: Array<{ stage: string; count: number }>
  config: ChartConfig
  totalPipeline: number
}

function PipelineChart({ data, config, totalPipeline }: PipelineChartProps) {
  return (
    <>
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
        <ChartContainer config={config}>
          <BarChart accessibilityLayer data={data}>
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
              shape={<CustomDuotoneBar />}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </>
  )
}

type IndustriesChartProps = {
  data: Array<{ industry: string; count: number; fill: string }>
  config: ChartConfig
}

function IndustriesChart({ data, config }: IndustriesChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
        Sin datos disponibles
      </div>
    )
  }
  return (
    <ChartContainer
      config={config}
      className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
        <Pie
          data={data}
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
  )
}

const ChartsGridSkeleton = (
  <div className="grid gap-4 lg:grid-cols-3">
    <div className="border border-border/80 bg-white rounded-lg lg:col-span-2 h-[300px] animate-pulse" />
    <div className="border border-border/80 bg-white rounded-lg h-[300px] animate-pulse" />
  </div>
)

export function ChartsGrid({ metricsData, period: _period }: ChartsGridProps) {
  const applicationsTrend = metricsData?.applicationsTrend ?? []
  const responseTimeDistribution = metricsData?.responseTimeDistribution
  const hiringFunnel = metricsData?.hiringFunnel
  const industriesApplied = metricsData?.industriesApplied ?? []

  const applicationsChartConfig = {
    applications: {
      label: "Postulaciones",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  const responseTimeData = responseTimeDistribution
    ? [
        { period: "< 24h", count: responseTimeDistribution.lessThan24h },
        { period: "1-3d", count: responseTimeDistribution.oneToThreeDays },
        { period: "4-7d", count: responseTimeDistribution.threeToSevenDays },
        { period: "> 7d", count: responseTimeDistribution.moreThanSevenDays },
      ]
    : []

  const responseTimeChartConfig = {
    count: {
      label: "Postulaciones",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  const pipelineData = hiringFunnel
    ? [
        { stage: "Aplicado", count: hiringFunnel.aplicado.count },
        { stage: "Entrevista", count: hiringFunnel.entrevista.count },
        { stage: "Oferta", count: hiringFunnel.oferta.count },
        { stage: "Contratado", count: hiringFunnel.contratado.count },
      ]
    : []

  const pipelineChartConfig = {
    count: {
      label: "Cantidad",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  const totalPipeline = pipelineData.reduce((sum, s) => sum + s.count, 0)

  const industriesDataWithColors = industriesApplied.map((entry, index) => ({
    ...entry,
    fill: `var(--chart-${(index % 5) + 1})`,
  }))

  const industriesChartConfig = (() => {
    const config: Record<string, { label: string; color: string }> = {}
    industriesApplied.forEach((_, i) => {
      config[`chart${i + 1}`] = { label: "", color: `var(--chart-${i + 1})` }
    })
    return config
  })()

  if (!metricsData) return ChartsGridSkeleton

  return (
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
          <ApplicationsChart data={applicationsTrend} config={applicationsChartConfig} />
        </CardContent>
      </Card>

      <Card className="border border-border/80 bg-white">
        <CardHeader>
          <CardTitle className="text-foreground">Tiempo de respuesta</CardTitle>
          <CardDescription>Distribución por período</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponseTimeChart data={responseTimeData} config={responseTimeChartConfig} />
        </CardContent>
      </Card>

      <Card className="border border-border/80 bg-white lg:col-span-2">
        <PipelineChart
          data={pipelineData}
          config={pipelineChartConfig}
          totalPipeline={totalPipeline}
        />
      </Card>

      <Card className="border border-border/80 bg-white flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-foreground">Industrias aplicadas</CardTitle>
          <CardDescription>Distribución por industria</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <IndustriesChart data={industriesDataWithColors} config={industriesChartConfig} />
        </CardContent>
      </Card>
    </div>
  )
}
