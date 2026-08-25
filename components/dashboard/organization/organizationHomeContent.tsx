"use client"

import { Calendar03Icon, SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQueries } from "@tanstack/react-query"
import { Result } from "better-result"
import { useRouter } from "next/navigation"
import { useCallback, useId, useMemo } from "react"
import { MetricCard } from "@/components/dashboard/employee/home/metricCard"
import { RecentMessagesCard } from "@/components/dashboard/employee/home/recentMessagesCard"
import { Skeleton } from "@/components/ui/skeleton"
import { useChatsByRecruiter } from "@/lib/api/use-chats"
import { useOrganization } from "@/lib/api/use-organization"
import {
  useOrgMetrics,
  useOrgRecentApplications,
  useOrgUpcomingInterviews,
} from "@/lib/api/use-organization-dashboard"
import { getUser } from "@/lib/api/users"
import { useDashboardSession } from "../DashboardSessionContext"
import { dashboardRaisedCardClass, dashboardTonalCardClass } from "../shared/surface-classes"
import { AccionRequeridaWidget } from "./AccionRequeridaWidget"
import { CreateOfferCard } from "./home/createOfferCard"
import { OrganizationHomeHeader } from "./home/organizationHomeHeader"
import { OrganizationRecentApplicationsCard } from "./home/organizationRecentApplicationsCard"
import { PlaceholderCard } from "./home/placeholderCard"
import { OnboardingChecklist } from "./onboarding/OnboardingChecklist"

export function OrganizationHomeContent() {
  const { push } = useRouter()
  const session = useDashboardSession()

  const organizationId = session?.user?.organizationId ?? undefined
  const { data: organizationData } = useOrganization(organizationId)
  const organizationName = organizationData?.name

  const metricsQuery = useOrgMetrics(organizationId)
  const applicationsQuery = useOrgRecentApplications(organizationId)
  const userId = session?.user?.id
  const messagesQuery = useChatsByRecruiter(userId)
  const interviewsQuery = useOrgUpcomingInterviews(userId)

  const candidateQueries = useQueries({
    queries: (messagesQuery.data ?? []).map((chat) => ({
      queryKey: ["profile", "user", chat.professionalId],
      queryFn: async () => {
        if (!chat.professionalId) return null
        const result = await getUser(chat.professionalId)
        if (!Result.isOk(result)) return null
        return result.value
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

  const hasOrgId = Boolean(organizationId && organizationId.length > 0)

  // Derive skeleton visibility directly from query states instead of useEffect + setState
  const showSkeletons = hasOrgId
    ? applicationsQuery.isPending || applicationsQuery.data === undefined || messagesQuery.isPending
    : true
  const showMessagesSkeletons = showSkeletons

  const handleViewAllMessages = useCallback(() => {
    push("/dashboard/messages")
  }, [push])

  const firstName = session?.user?.name?.split(" ")[0] || "Organización"
  const displayName = organizationName || firstName

  const skeletonId = useId()

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <OrganizationHomeHeader firstName={displayName} isPending={organizationData === undefined} />

      <OnboardingChecklist />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metricsQuery.isPending
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`${skeletonId}-${i}`}
                className={`flex flex-col gap-2 p-4 sm:p-5 ${dashboardTonalCardClass}`}
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="size-4" />
                </div>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))
          : metricsQuery.error
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`${skeletonId}-err-${i}`}
                  className={`flex flex-col gap-2 p-4 sm:p-5 ${dashboardTonalCardClass}`}
                >
                  <span className="text-sm font-medium text-foreground">—</span>
                  <span className="text-2xl font-bold text-muted-foreground tracking-tight">—</span>
                  <span className="text-xs text-destructive">No se pudo cargar</span>
                </div>
              ))
            : metricsQuery.data?.map((metric) => <MetricCard key={metric.title} metric={metric} />)}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {showSkeletons ? (
          <div className={`md:col-span-2 p-4 sm:p-5 ${dashboardRaisedCardClass}`}>
            <div className="mb-6 flex items-center justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={`${skeletonId}-app-${i}`}
                  className="flex items-center justify-between rounded-lg border border-border/30 bg-surface-container-low p-3"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="space-y-1 text-right">
                    <Skeleton className="ml-auto h-3 w-20" />
                    <Skeleton className="ml-auto h-5 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : applicationsQuery.error ? (
          <div className="col-span-full flex items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive md:col-span-2">
            Error al cargar aplicaciones recientes.
          </div>
        ) : (
          <OrganizationRecentApplicationsCard applications={applicationsQuery.data || []} />
        )}

        {showMessagesSkeletons ? (
          <div className={`p-4 sm:p-5 ${dashboardRaisedCardClass}`}>
            <div className="mb-6 flex items-center justify-between">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`${skeletonId}-msg-${i}`} className="space-y-2">
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
          <div className="flex items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            Error al cargar mensajes recientes.
          </div>
        ) : (
          <RecentMessagesCard
            chats={(messagesQuery.data || []).map((chat) => ({
              ...chat,
              lastMessageFromRecruiter: chat.lastMessage ?? null,
              lastMessageFromRecruiterAt: chat.updatedAt,
              isLoading: false,
            }))}
            namesMap={candidateNames}
            participantIdKey="professionalId"
            defaultName="Candidato"
            onViewAll={handleViewAllMessages}
          />
        )}
      </div>

      <CreateOfferCard />

      <div className="grid gap-4 md:grid-cols-2">
        <PlaceholderCard
          title="Proximas entrevistas"
          description="calendario de entrevistas"
          icon={Calendar03Icon}
          onClick={() => push("/dashboard/calendar")}
        >
          {interviewsQuery.isPending ? (
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
          ) : interviewsQuery.isError ? (
            <p className="text-sm text-destructive mt-2">Error al cargar entrevistas.</p>
          ) : interviewsQuery.data && interviewsQuery.data.length > 0 ? (
            <div className="space-y-4 mt-2">
              {interviewsQuery.data.map((interview) => (
                <div
                  key={interview.id}
                  className="flex flex-col gap-1 border-b border-border/30 pb-3 last:border-0"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{interview.candidateName}</span>
                    <span className="text-xs text-muted-foreground">
                      {interview.date}, {interview.time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{interview.position}</span>
                    <span className="inline-flex items-center rounded-md bg-surface-container-highest px-2 py-0.5 text-xs font-medium text-foreground">
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
          description="Recomendaciones inteligentes"
          icon={SparklesIcon}
          iconColor="accent"
        >
          <div className="flex h-full flex-col items-center justify-center rounded-xl bg-surface-container-low p-4 sm:p-5 text-center">
            <div className="mb-2.5 flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <HugeiconsIcon icon={SparklesIcon} size={18} strokeWidth={1.5} />
            </div>
            <h4 className="mb-1 text-xs leading-4 font-medium text-foreground">
              Emparejamiento con IA
            </h4>
            <p className="max-w-[240px] text-xs leading-relaxed text-muted-foreground text-pretty">
              Próximamente analizaremos los perfiles automáticamente para sugerirte los
              profesionales más adecuados para tus vacantes.
            </p>
            <span className="mt-3 inline-flex items-center rounded-full border-0 bg-accent/15 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-accent">
              Próximamente
            </span>
          </div>
        </PlaceholderCard>
      </div>

      <AccionRequeridaWidget />
    </div>
  )
}
