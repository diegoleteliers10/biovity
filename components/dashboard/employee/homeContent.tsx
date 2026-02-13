"use client"

import { useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { DATA } from "@/lib/data/data-test"
import { HomeHeader } from "./home/homeHeader"
import { MetricCard } from "./home/metricCard"
import { RecommendedJobCard } from "./home/recommendedJobCard"
import { RecentApplicationsCard } from "./home/recentApplicationsCard"
import { RecentMessagesCard } from "./home/recentMessagesCard"
import { JobAlertsCard } from "./home/jobAlertsCard"
import type { Notification } from "@/lib/types/dashboard"

export const HomeContent = () => {
  const router = useRouter()
  const { useSession } = authClient
  const { data, isPending } = useSession()

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

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications])

  const toSlug = useCallback((value: string): string => {
    return value
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
  }, [])

  const handleJobClick = useCallback(
    (jobTitle: string, _company: string) => {
      const slug = toSlug(jobTitle)
      router.push(`/dashboard/employee/job/${slug}`)
    },
    [toSlug, router]
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
    // TODO: Navigate to all jobs page
    console.log("View all jobs")
  }, [])

  const handleCreateAlert = useCallback(() => {
    // TODO: Implement alert creation logic
    console.log("Create alert")
  }, [])

  const handleNotificationClick = useCallback((id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }, [])

  const firstName = data?.user?.name?.split(" ")[0] || "Usuario"

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <HomeHeader
        firstName={firstName}
        isPending={isPending}
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={handleNotificationClick}
      />

      {/* Metrics Cards */}
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DATA.metrics.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </div>

      {/* Recent Applications and Messages */}
      <div className="mt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RecentApplicationsCard
          applications={DATA.recentApplications}
          onJobClick={handleJobClick}
        />
        <RecentMessagesCard messages={DATA.recentMessages} />
      </div>

      {/* Recommended Jobs Section */}
      <div className="mt-4 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl tracking-tight font-semibold">Empleos Recomendados para Ti</h2>
          <button
            type="button"
            onClick={handleViewAllJobs}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver Todos los Empleos
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight">Alertas de Empleo</h2>
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
