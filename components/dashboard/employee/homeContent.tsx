"use client"

import { Calendar03Icon, File02Icon, Pulse01Icon } from "@hugeicons/core-free-icons"
import { useQueries } from "@tanstack/react-query"
import { Result } from "better-result"
import * as m from "motion/react-m"
import { useRouter } from "next/navigation"
import { cache, useCallback, useMemo } from "react"
import { getLastMessageFromSender } from "@/lib/api/messages"
import { useApplicationsByCandidate } from "@/lib/api/use-applications"
import { useChatsByProfessional } from "@/lib/api/use-chats"
import { useMarkNotificationRead, useNotifications } from "@/lib/api/use-notifications"
import { useUserMetrics } from "@/lib/api/use-user-metrics"
import { getUser } from "@/lib/api/users"
import { useDashboardSession } from "../DashboardSessionContext"
import { HomeHeader } from "./home/homeHeader"
import { MetricCard } from "./home/metricCard"
import { RecentApplicationsCard } from "./home/recentApplicationsCard"
import { RecentMessagesCard } from "./home/recentMessagesCard"

// Cached user fetcher - deduplicates within the request using React.cache
// Per async-parallel rule: use Promise.all for independent operations
// Per server-parallel-nested-fetching rule: each item chains its own nested fetch
const getCachedUser = cache(async (recruiterId: string) => {
  if (!recruiterId) return null
  const result = await getUser(recruiterId)
  if (!Result.isOk(result)) return null
  return result.value
})

export const HomeContent = () => {
  const { push } = useRouter()
  const session = useDashboardSession()

  const { data: notificationsData } = useNotifications()
  const notifications = notificationsData?.data ?? []
  const unreadCount = notificationsData?.unreadCount ?? 0
  const markRead = useMarkNotificationRead()

  const _toSlug = useCallback((value: string): string => {
    return value
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
  }, [])

  const handleJobClick = useCallback(
    (jobId: string) => {
      push(`/dashboard/job/${jobId}`)
    },
    [push]
  )

  const handleViewAllJobs = useCallback(() => {
    push("/dashboard/jobs")
  }, [push])

  const handleViewAllMessages = useCallback(() => {
    push("/dashboard/messages")
  }, [push])

  const handleViewAllApplications = useCallback(() => {
    push("/dashboard/applications")
  }, [push])

  const handleNotificationClick = useCallback(
    (id: string) => {
      markRead.mutate(id)
      const target = notifications.find((n) => n.id === id)
      if (target?.link) push(target.link)
    },
    [markRead, notifications, push]
  )

  const firstName = session?.user?.name?.split(" ")[0] || "Usuario"

  const professionalId = session?.user?.id
  const { data: quickMetrics } = useUserMetrics(professionalId, "month")
  const { data: chats = [] } = useChatsByProfessional(professionalId)
  const { data: recentApplications = [], isLoading: applicationsLoading } =
    useApplicationsByCandidate(professionalId)

  // Deduplicate recruiter IDs to avoid redundant queries
  // Per async-parallel rule: parallelize independent operations
  // Per server-parallel-nested-fetching rule: deduplicate before fetching
  const uniqueRecruiterIds = useMemo(() => {
    const seen = new Set<string>()
    return (chats ?? []).reduce<string[]>((acc, c) => {
      const id = c.recruiterId
      if (id && !seen.has(id)) {
        seen.add(id)
        acc.push(id)
      }
      return acc
    }, [])
  }, [chats])

  const recruiterQueries = useQueries({
    queries: uniqueRecruiterIds.map((recruiterId) => ({
      queryKey: ["profile", "user", recruiterId],
      queryFn: () => getCachedUser(recruiterId),
      enabled: Boolean(recruiterId),
      staleTime: 5 * 60 * 1000,
    })),
  })

  // Build recruiter names map from deduplicated queries
  const recruiterNames = useMemo(() => {
    const map: Record<string, string> = {}
    recruiterQueries.forEach((q, i) => {
      const recruiterId = uniqueRecruiterIds[i]
      if (recruiterId) {
        map[recruiterId] = q.data?.name ?? "Reclutador"
      }
    })
    return map
  }, [recruiterQueries, uniqueRecruiterIds])

  const lastRecruiterMessageQueries = useQueries({
    queries: (chats ?? []).map((chat) => ({
      queryKey: ["messages", "last-recruiter", chat.id],
      queryFn: async () => {
        if (!chat.recruiterId) return null
        const msg = await getLastMessageFromSender(chat.id, chat.recruiterId)
        return msg
      },
      enabled: Boolean(chat.id && chat.recruiterId),
      staleTime: 30 * 1000,
    })),
  })

  const enrichedChats = useMemo(() => {
    return chats.map((chat, i) => {
      const lastMsg = lastRecruiterMessageQueries[i]?.data
      return {
        ...chat,
        lastMessageFromRecruiter: lastMsg?.content ?? null,
        lastMessageFromRecruiterAt: lastMsg?.createdAt ?? chat.updatedAt,
        isLoading: lastRecruiterMessageQueries[i]?.isLoading ?? true,
      }
    })
  }, [chats, lastRecruiterMessageQueries])

  const isInitialLoad = chats.length === 0 && lastRecruiterMessageQueries.some((q) => q.isFetching)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <HomeHeader
        firstName={firstName}
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={handleNotificationClick}
      />

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {quickMetrics
          ? [
              {
                title: "Total postulaciones",
                value: quickMetrics.quickMetrics.totalApplications,
                subtitle: "total",
                icon: File02Icon,
              },
              {
                title: "Postulaciones activas",
                value: quickMetrics.quickMetrics.activeApplications,
                subtitle: "en proceso",
                icon: Calendar03Icon,
              },
              {
                title: "Tasa de respuesta",
                value: `${quickMetrics.quickMetrics.responseRate}%`,
                subtitle: "respuestas recibidas",
                icon: Pulse01Icon,
              },
            ].map((metric, i) => (
              <m.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                <MetricCard metric={metric} />
              </m.div>
            ))
          : [0, 1, 2].map((n) => (
              <div
                key={n}
                className="border border-border/80 bg-white rounded-lg h-24 animate-pulse"
              />
            ))}
      </div>

      {/* Recent Applications and Messages */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <RecentApplicationsCard
          applications={recentApplications}
          onJobClick={handleJobClick}
          onViewAll={handleViewAllApplications}
          isLoading={applicationsLoading}
        />
        <RecentMessagesCard
          chats={enrichedChats}
          isLoading={isInitialLoad}
          namesMap={recruiterNames}
          participantIdKey="recruiterId"
          defaultName="Reclutador"
          onViewAll={handleViewAllMessages}
        />
      </div>

      {/* Recommended Jobs Section */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl tracking-tight font-semibold text-foreground">
            Empleos Recomendados
          </h2>
        </div>
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Proximamente recibiras recomendaciones personalizadas basadas en tu perfil y
            preferencias.
          </p>
        </div>
      </div>

      {/* Job Alerts Section */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-4">
          Alertas de Empleo
        </h2>
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Proximamente podras configurar alertas para recibir notificaciones de nuevos empleos.
          </p>
        </div>
      </div>
    </div>
  )
}
