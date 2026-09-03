"use client"

import { Calendar03Icon, File02Icon, Pulse01Icon, SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQueries } from "@tanstack/react-query"
import { Result } from "better-result"
import { useRouter } from "next/navigation"
import { cache, useCallback, useMemo } from "react"
import { getLastMessageFromSender } from "@/lib/api/messages"
import { useApplicationsByCandidate } from "@/lib/api/use-applications"
import { useChatsByProfessional } from "@/lib/api/use-chats"
import { useUserMetrics } from "@/lib/api/use-user-metrics"
import { getUser } from "@/lib/api/users"
import { useDashboardSession } from "../DashboardSessionContext"
import { HomeHeader } from "./home/homeHeader"
import { JobAlertsCard } from "./home/jobAlertsCard"
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

  const handleJobClick = useCallback(
    (jobId: string) => {
      push(`/dashboard/job/${jobId}`)
    },
    [push]
  )

  const handleViewAllMessages = useCallback(() => {
    push("/dashboard/messages")
  }, [push])

  const handleViewAllApplications = useCallback(() => {
    push("/dashboard/applications")
  }, [push])

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
      <HomeHeader firstName={firstName} />

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
            ].map((metric) => <MetricCard key={metric.title} metric={metric} />)
          : [0, 1, 2].map((n) => (
              <div
                key={n}
                className="h-24 rounded-xl border border-border/40 bg-surface-container-low animate-pulse"
              />
            ))}
      </div>

      {/* Recent Applications and Messages */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">Empleos Recomendados</h2>
        <div className="rounded-xl border border-border/40 bg-surface-container-low p-6 text-center shadow-none">
          <div className="size-10 rounded-full bg-surface-container-highest flex items-center justify-center mx-auto mb-3 text-muted-foreground">
            <HugeiconsIcon icon={SparklesIcon} size={20} />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Recomendaciones en camino</p>
          <p className="text-xs text-muted-foreground">
            Próximamente recibirás recomendaciones personalizadas basadas en tu perfil y
            preferencias.
          </p>
        </div>
      </section>

      {/* Job Alerts Section */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-foreground">Alertas de Empleo</h2>
        <JobAlertsCard userId={professionalId} />
      </section>
    </div>
  )
}
