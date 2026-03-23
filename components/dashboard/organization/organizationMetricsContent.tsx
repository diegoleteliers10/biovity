"use client"

import {
  Analytics01Icon,
  Calendar03Icon,
  File02Icon,
  FileAddIcon,
  User02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const orgKpis = [
  {
    title: "Ofertas activas",
    value: "5",
    subtitle: "Publicadas",
    icon: FileAddIcon,
    trend: "+2 este mes",
    trendPositive: true,
  },
  {
    title: "Aplicaciones recibidas",
    value: "24",
    subtitle: "Últimos 30 días",
    icon: File02Icon,
    trend: "+8%",
    trendPositive: true,
  },
  {
    title: "Entrevistas programadas",
    value: "6",
    subtitle: "Este mes",
    icon: Calendar03Icon,
    trend: "+2",
    trendPositive: true,
  },
  {
    title: "Vistas de ofertas",
    value: "142",
    subtitle: "Candidatos únicos",
    icon: User02Icon,
    trend: "+15%",
    trendPositive: true,
  },
]

export function OrganizationMetricsContent() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="space-y-1">
        <h1 className="text-[28px] font-bold tracking-wide">Métricas</h1>
        <p className="text-muted-foreground text-sm">
          Analiza el rendimiento de tus ofertas y candidatos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {orgKpis.map((kpi) => (
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
              {kpi.trend && <p className="text-xs text-green-600">{kpi.trend}</p>}
              {kpi.subtitle && <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={Analytics01Icon} size={20} strokeWidth={1.5} />
            Próximamente: gráficos detallados
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Verás aplicaciones por oferta, tiempo de respuesta y más métricas.
          </p>
        </CardHeader>
      </Card>
    </div>
  )
}
