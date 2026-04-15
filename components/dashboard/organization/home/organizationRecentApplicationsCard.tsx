"use client"

import { useRouter } from "next/navigation"
import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OrganizationRecentApplication } from "@/lib/types/dashboard"

type OrganizationRecentApplicationsCardProps = {
  applications: OrganizationRecentApplication[]
}

export const OrganizationRecentApplicationsCard = memo(function OrganizationRecentApplicationsCard({
  applications,
}: OrganizationRecentApplicationsCardProps) {
  const router = useRouter()

  const handleViewAll = () => {
    router.push("/dashboard/applications")
  }

  const handleApplicationClick = () => {
    router.push("/dashboard/applications")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleApplicationClick()
    }
  }

  return (
    <Card className="md:col-span-2 border border-border/80 bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Aplicaciones Recientes</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleViewAll}
          >
            Ver todas
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              Aún no tienes aplicaciones. Crea una oferta para empezar a recibir candidatos.
            </p>
          ) : (
            applications.map((app) => (
              <div
                key={`${app.candidateName}-${app.position}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors duration-200 border border-border/60 hover:border-border/80"
                onClick={handleApplicationClick}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
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
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.statusColor}`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
})
