"use client"

import { FileEmpty01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { memo } from "react"
import { dashboardRaisedCardClass } from "@/components/dashboard/shared/surface-classes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OrganizationRecentApplication } from "@/lib/types/dashboard"

type OrganizationRecentApplicationsCardProps = {
  applications: OrganizationRecentApplication[]
}

export const OrganizationRecentApplicationsCard = memo(function OrganizationRecentApplicationsCard({
  applications,
}: OrganizationRecentApplicationsCardProps) {
  const { push } = useRouter()

  const handleViewAll = () => {
    push("/dashboard/applications")
  }

  const handleApplicationClick = () => {
    push("/dashboard/applications")
  }

  return (
    <Card className={`md:col-span-2 ${dashboardRaisedCardClass}`}>
      <CardHeader className="px-4 sm:px-5 pt-4 sm:pt-5 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs leading-4 font-medium text-foreground">
            Aplicaciones Recientes
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 rounded-md text-xs font-medium text-secondary hover:text-secondary/80 hover:bg-transparent"
            onClick={handleViewAll}
          >
            Ver todas
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5">
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="flex flex-col items-center text-center gap-2 py-8">
              <div className="size-10 rounded-full bg-surface-container-highest flex items-center justify-center text-muted-foreground">
                <HugeiconsIcon icon={FileEmpty01Icon} size={20} />
              </div>
              <p className="text-sm font-medium text-foreground">Sin aplicaciones todavía</p>
              <p className="text-xs text-muted-foreground max-w-[240px] mb-2">
                Cuando publiques una oferta, las postulaciones aparecerán aquí.
              </p>
              <Button
                size="sm"
                className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs font-medium"
                onClick={() => push("/dashboard/ofertas")}
              >
                Publicar una oferta
              </Button>
            </div>
          ) : (
            applications.map((app) => (
              <button
                type="button"
                key={`${app.candidateName}-${app.position}`}
                className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-surface-container-low p-3 text-left transition-colors duration-150 hover:bg-surface-container-highest/40"
                onClick={handleApplicationClick}
                aria-label={`Ver aplicación de ${app.candidateName} para ${app.position}`}
              >
                <div className="space-y-2">
                  <p className="text-sm font-medium leading-none text-foreground">
                    {app.candidateName}
                  </p>
                  <p className="text-sm text-muted-foreground">{app.position}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm text-muted-foreground">{app.dateApplied}</p>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${app.statusColor}`}
                  >
                    {app.status}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
})
