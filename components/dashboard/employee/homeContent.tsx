"use client"

import { useQueries } from "@tanstack/react-query"
import { Result } from "better-result"
import * as m from "motion/react-m"
import { useRouter } from "next/navigation"
import { cache, useCallback, useMemo, useState } from "react"
import { getLastMessageFromSender } from "@/lib/api/messages"
import { useApplicationsByCandidate } from "@/lib/api/use-applications"
import { useChatsByProfessional } from "@/lib/api/use-chats"
import { getUser } from "@/lib/api/users"
import { DATA } from "@/lib/data/data-test"
import type { Notification } from "@/lib/types/dashboard"
import { useDashboardSession } from "../DashboardSessionContext"
import { HomeHeader } from "./home/homeHeader"
import { JobAlertsCard } from "./home/jobAlertsCard"
import { MetricCard } from "./home/metricCard"
import { RecentApplicationsCard } from "./home/recentApplicationsCard"
import { RecentMessagesCard } from "./home/recentMessagesCard"
import { RecommendedJobCard } from "./home/recommendedJobCard"

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
  const router = useRouter()
  const session = useDashboardSession()

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Nueva aplicación recibida",
      message: "TechCorp ha revisado tu aplicación para Desarrollador Senior",
      time: "Hace 2 horas",
      isRead: false,
      type: "application",
    },
    {
      id: 2,
      title: "Entrevista programada",
      message: "BioCorp ha programado una entrevista para mañana",
      time: "Hace 4 horas",
      isRead: false,
      type: "interview",
    },
    {
      id: 3,
      title: "Nuevo empleo recomendado",
      message: "Hemos encontrado 3 empleos que podrían interesarte",
      time: "Hace 1 día",
      isRead: true,
      type: "recommendation",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const toSlug = useCallback((value: string): string => {
    return value
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
  }, [])

  const handleJobClick = useCallback(
    (jobId: string) => {
      router.push(`/dashboard/job/${jobId}`)
    },
    [router]
  )

  const handleApplyJob = useCallback((_jobId: number, _jobTitle: string, _company: string) => {
    // TODO: Implement job application logic
    console.log("Apply job")
  }, [])

  const handleSaveJob = useCallback((_jobId: number, _jobTitle: string, _company: string) => {
    // TODO: Implement job save logic
    console.log("Save job")
  }, [])

  const handleViewAllJobs = useCallback(() => {
    router.push("/dashboard/jobs")
  }, [router])

  const handleViewAllMessages = useCallback(() => {
    router.push("/dashboard/messages")
  }, [router])

  const handleViewAllApplications = useCallback(() => {
    router.push("/dashboard/applications")
  }, [router])

  const handleCreateAlert = useCallback(() => {
    // TODO: Implement alert creation logic
    console.log("Create alert")
  }, [])

  const handleNotificationClick = useCallback((id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }, [])

  const firstName = session?.user?.name?.split(" ")[0] || "Usuario"

  const professionalId = session?.user?.id
  const {
    data: chats = [],
    isPending: chatsPending,
    isSuccess: chatsSuccess,
  } = useChatsByProfessional(professionalId)

  const {
    data: applications = [],
    isPending: applicationsPending,
    isSuccess: applicationsSuccess,
  } = useApplicationsByCandidate(professionalId)

  // Deduplicate recruiter IDs to avoid redundant queries
  // Per async-parallel rule: parallelize independent operations
  // Per server-parallel-nested-fetching rule: deduplicate before fetching
  const uniqueRecruiterIds = useMemo(() => {
    const seen = new Set<string>()
    return (chats ?? [])
      .map((c) => c.recruiterId)
      .filter((id): id is string => {
        if (!id) return false
        if (seen.has(id)) return false
        seen.add(id)
        return true
      })
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

  const isInitialLoad =
    !chatsSuccess ||
    !applicationsSuccess ||
    (chats.length > 0 && lastRecruiterMessageQueries.some((q) => q.isFetching))

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
        {DATA.metrics.map((metric, i) => (
          <m.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            <MetricCard metric={metric} />
          </m.div>
        ))}
      </div>

      {/* Recent Applications and Messages */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <RecentApplicationsCard
          applications={applications}
          onJobClick={handleJobClick}
          onViewAll={handleViewAllApplications}
          isLoading={!applicationsSuccess}
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
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl tracking-tight font-semibold text-foreground">
            Empleos Recomendados para Ti
          </h2>
          <button
            type="button"
            onClick={handleViewAllJobs}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Ver Todos los Empleos
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {DATA.recommendedJobs.map((job) => (
            <RecommendedJobCard
              key={job.jobTitle}
              job={job}
              onJobClick={handleJobClick}
              onApplyJob={handleApplyJob}
              onSaveJob={handleSaveJob}
            />
          ))}
        </div>
      </div>

      {/* Job Alerts Section */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Alertas de Empleo
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Configura alertas para recibir notificaciones de nuevos empleos que coincidan con tus
          intereses.
        </p>

        <div className="grid gap-6 lg:grid-cols-1">
          <JobAlertsCard onCreateAlert={handleCreateAlert} />
        </div>
      </div>
    </div>
  )
}
