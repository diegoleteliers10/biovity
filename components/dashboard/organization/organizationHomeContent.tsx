"use client"

import { Calendar03Icon, UserIcon } from "@hugeicons/core-free-icons"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { MetricCard } from "@/components/dashboard/employee/home/metricCard"
import { RecentMessagesCard } from "@/components/dashboard/employee/home/recentMessagesCard"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useOrgFeaturedCandidates,
  useOrgMetrics,
  useOrgNotifications,
  useOrgRecentApplications,
  useOrgRecentMessages,
  useOrgUpcomingInterviews,
} from "@/lib/api/use-organization-dashboard"
import { authClient } from "@/lib/auth-client"
import type { Notification } from "@/lib/types/dashboard"
import { CreateOfferCard } from "./home/createOfferCard"
import { OrganizationHomeHeader } from "./home/organizationHomeHeader"
import { OrganizationRecentApplicationsCard } from "./home/organizationRecentApplicationsCard"
import { PlaceholderCard } from "./home/placeholderCard"

export function OrganizationHomeContent() {
  const router = useRouter()
  const { useSession } = authClient
  const { data, isPending } = useSession()

  const notificationsQuery = useOrgNotifications()
  const metricsQuery = useOrgMetrics()
  const applicationsQuery = useOrgRecentApplications()
  const messagesQuery = useOrgRecentMessages()
  const interviewsQuery = useOrgUpcomingInterviews()
  const candidatesQuery = useOrgFeaturedCandidates()

  const [localNotifications, setLocalNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (notificationsQuery.data) {
      setLocalNotifications(notificationsQuery.data as Notification[])
    }
  }, [notificationsQuery.data])

  const handleNotificationClick = useCallback((id: number) => {
    setLocalNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }, [])

  const handleViewAllMessages = useCallback(() => {
    router.push("/dashboard/messages")
  }, [router])

  const firstName = data?.user?.name?.split(" ")[0] || "Organización"
  const unreadCount = localNotifications.filter((n) => !n.isRead).length

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <OrganizationHomeHeader
        firstName={firstName}
        isPending={isPending || notificationsQuery.isLoading}
        notifications={localNotifications}
        unreadCount={unreadCount}
        onNotificationClick={handleNotificationClick}
      />

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metricsQuery.isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[120px] w-full" />)
        ) : metricsQuery.error ? (
          <div className="col-span-full text-sm text-destructive bg-destructive/10 p-4 rounded-lg">
            Error al cargar métricas.
          </div>
        ) : (
          metricsQuery.data?.map((metric) => <MetricCard key={metric.title} metric={metric} />)
        )}
      </div>

      <div className="mt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {applicationsQuery.isLoading ? (
          <div className="md:col-span-2">
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : applicationsQuery.error ? (
          <div className="md:col-span-2 text-sm text-destructive bg-destructive/10 p-4 rounded-lg flex items-center justify-center">
            Error al cargar aplicaciones recientes.
          </div>
        ) : (
          <OrganizationRecentApplicationsCard applications={applicationsQuery.data || []} />
        )}

        {messagesQuery.isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : messagesQuery.error ? (
          <div className="text-sm text-destructive bg-destructive/10 p-4 rounded-lg flex items-center justify-center">
            Error al cargar mensajes recientes.
          </div>
        ) : (
          <RecentMessagesCard
            messages={messagesQuery.data || []}
            onViewAll={handleViewAllMessages}
          />
        )}
      </div>

      <div className="mt-4">
        <CreateOfferCard />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <PlaceholderCard
          title="Próximas entrevistas"
          description="calendario de entrevistas"
          icon={Calendar03Icon}
        >
          {interviewsQuery.isLoading ? (
            <div className="space-y-3 mt-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : interviewsQuery.error ? (
            <p className="text-sm text-destructive mt-2">Error al cargar entrevistas.</p>
          ) : interviewsQuery.data && interviewsQuery.data.length > 0 ? (
            <div className="space-y-4 mt-2">
              {interviewsQuery.data.map((interview) => (
                <div key={interview.id} className="flex flex-col gap-1 border-b pb-3 last:border-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{interview.candidateName}</span>
                    <span className="text-xs text-muted-foreground">{interview.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{interview.position}</span>
                    <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {interview.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">No hay entrevistas próximas.</p>
          )}
        </PlaceholderCard>

        <PlaceholderCard
          title="Candidatos destacados"
          description="candidatos que coinciden con tus ofertas"
          icon={UserIcon}
        >
          {candidatesQuery.isLoading ? (
            <div className="space-y-3 mt-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : candidatesQuery.error ? (
            <p className="text-sm text-destructive mt-2">Error al cargar candidatos.</p>
          ) : candidatesQuery.data && candidatesQuery.data.length > 0 ? (
            <div className="space-y-4 mt-2">
              {candidatesQuery.data.map((candidate) => (
                <div key={candidate.id} className="flex flex-col gap-1 border-b pb-3 last:border-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{candidate.name}</span>
                    <span className="text-xs font-bold text-green-600">
                      {candidate.matchPercentage}% Match
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{candidate.role}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">No hay candidatos destacados.</p>
          )}
        </PlaceholderCard>
      </div>
    </div>
  )
}
