"use client"

import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RecentApplication } from "@/lib/types/dashboard"

interface RecentApplicationsCardProps {
  applications: RecentApplication[]
  onJobClick: (jobTitle: string, company: string) => void
}

export const RecentApplicationsCard = memo(function RecentApplicationsCard({
  applications,
  onJobClick,
}: RecentApplicationsCardProps) {
  const handleJobClick = (jobTitle: string, company: string) => {
    onJobClick(jobTitle, company)
  }

  const handleKeyDown = (e: React.KeyboardEvent, jobTitle: string, company: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleJobClick(jobTitle, company)
    }
  }

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Aplicaciones Recientes</CardTitle>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Ver Todo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.jobTitle}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200 border border-transparent hover:border-gray-200"
              onClick={() => handleJobClick(app.jobTitle, app.company)}
              onKeyDown={(e) => handleKeyDown(e, app.jobTitle, app.company)}
              tabIndex={0}
              role="button"
              aria-label={`Ver detalles del trabajo ${app.jobTitle} en ${app.company}`}
            >
              <div className="space-y-2">
                <p className="text-sm font-medium leading-none">{app.jobTitle}</p>
                <p className="text-sm text-muted-foreground">{app.company}</p>
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
          ))}
        </div>
      </CardContent>
    </Card>
  )
})
