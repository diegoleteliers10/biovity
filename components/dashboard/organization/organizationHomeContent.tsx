"use client"

import { Calendar03Icon, UserIcon } from "@hugeicons/core-free-icons"
import { useQueries } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { MetricCard } from "@/components/dashboard/employee/home/metricCard"
import { RecentMessagesCard } from "@/components/dashboard/employee/home/recentMessagesCard"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useChatsByRecruiter,
} from "@/lib/api/use-chats"
import {
  useOrgFeaturedCandidates,
  useOrgMetrics,
  useOrgNotifications,
  useOrgRecentApplications,
  useOrgUpcomingInterviews,
} from "@/lib/api/use-organization-dashboard"
import { useOrganization } from "@/lib/api/use-organization"
import { getUser } from "@/lib/api/users"
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

  const organizationId = (data?.user as { organizationId?: string } | undefined)?.organizationId
  const { data: organizationData } = useOrganization(organizationId)
  const organizationName = organizationData?.name

  const notificationsQuery = useOrgNotifications()
  const metricsQuery = useOrgMetrics(organizationId)
  const applicationsQuery = useOrgRecentApplications(organizationId)
  const userId = (data?.user as { id?: string } | undefined)?.id
  const messagesQuery = useChatsByRecruiter(userId)
  const interviewsQuery = useOrgUpcomingInterviews()

  const candidateQueries = useQueries({
    queries: (messagesQuery.data ?? []).map((chat) => ({
      queryKey: ["profile", "user", chat.professionalId],
      queryFn: async () => {
        if (!chat.professionalId) return null
        const result = await getUser(chat.professionalId)
        if ("error" in result) return null
        return result.data
      },
      enabled: Boolean(chat.professionalId),
      staleTime: 5 * 60 * 1000,
    })),
  })

  const candidateNames = useMemo(() => {
    const map: Record<string, string> = {}
    candidateQueries.forEach((q, i) => {
      const chat = messagesQuery.data?.[i]
      if (chat?.professionalId) {
        map[chat.professionalId] = q.data?.name ?? "Candidato"
      }
    })
    return map
  }, [candidateQueries, messagesQuery.data])

  const candidatesQuery = useOrgFeaturedCandidates()

  const [localNotifications, setLocalNotifications] = useState<Notification[]>([])
  const [showSkeletons, setShowSkeletons] = useState(true)
  const [showMessagesSkeletons, setShowMessagesSkeletons] = useState(true)

  const hasOrgId = Boolean(organizationId && organizationId.length > 0)

  useEffect(() => {
    if (
      hasOrgId &&
      !applicationsQuery.isPending &&
      applicationsQuery.data !== undefined &&
      !messagesQuery.isPending
    ) {
      setShowSkeletons(false)
      setShowMessagesSkeletons(false)
    } else {
      setShowSkeletons(true)
      setShowMessagesSkeletons(true)
    }
  }, [hasOrgId, applicationsQuery.isPending, applicationsQuery.data, messagesQuery.isPending])

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
  const displayName = organizationName || firstName
  const unreadCount = localNotifications.filter((n) => !n.isRead).length

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <OrganizationHomeHeader
        firstName={displayName}
        isPending={isPending || notificationsQuery.isLoading || organizationData === undefined}
        notifications={localNotifications}
        unreadCount={unreadCount}
        onNotificationClick={handleNotificationClick}
      />

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metricsQuery.isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-border/80 bg-white rounded-xl p-6">
              <div className="flex items-center justify-between pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-24 mt-1" />
            </div>
          ))
        ) : metricsQuery.error ? (
          <div className="col-span-full text-sm text-destructive bg-destructive/10 p-4 rounded-lg">
            Error al cargar métricas.
          </div>
        ) : (
          metricsQuery.data?.map((metric) => <MetricCard key={metric.title} metric={metric} />)
        )}
      </div>

      <div className="mt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {showSkeletons ? (
          <div className="md:col-span-2 border border-border/80 bg-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/60">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="space-y-1 text-right">
                    <Skeleton className="h-3 w-20 ml-auto" />
                    <Skeleton className="h-5 w-16 rounded-full ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : applicationsQuery.error ? (
          <div className="md:col-span-2 text-sm text-destructive bg-destructive/10 p-4 rounded-lg flex items-center justify-center">
            Error al cargar aplicaciones recientes.
          </div>
        ) : (
          <OrganizationRecentApplicationsCard applications={applicationsQuery.data || []} />
        )}

        {showMessagesSkeletons ? (
          <div className="border border-border/80 bg-white rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                  <Skeleton className="h-3 w-56" />
                </div>
              ))}
            </div>
          </div>
        ) : messagesQuery.error ? (
          <div className="text-sm text-destructive bg-destructive/10 p-4 rounded-lg flex items-center justify-center">
            Error al cargar mensajes recientes.
          </div>
        ) : (
          <RecentMessagesCard
            messages={messagesQuery.data?.map((chat) => ({
              sender: candidateNames[chat.professionalId] ?? "Candidato",
              time: new Date(chat.updatedAt).toLocaleDateString("es-CL", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              preview: chat.lastMessage ?? "Sin mensajes",
            })) || []}
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
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2 p-3 rounded-lg border border-border/60">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </div>
              ))}
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
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/15 text-accent">
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
          iconColor="accent"
        >
          {candidatesQuery.isLoading ? (
            <div className="space-y-3 mt-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2 p-3 rounded-lg border border-border/60">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-14" />
                  </div>
                  <Skeleton className="h-3 w-40" />
                </div>
              ))}
            </div>
          ) : candidatesQuery.error ? (
            <p className="text-sm text-destructive mt-2">Error al cargar candidatos.</p>
          ) : candidatesQuery.data && candidatesQuery.data.length > 0 ? (
            <div className="space-y-4 mt-2">
              {candidatesQuery.data.map((candidate) => (
                <div key={candidate.id} className="flex flex-col gap-1 border-b pb-3 last:border-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{candidate.name}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/15 text-accent">
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