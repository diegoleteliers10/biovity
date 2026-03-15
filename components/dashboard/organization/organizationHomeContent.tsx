"use client"

import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { ORGANIZATION_DATA } from "@/lib/data/organization-dashboard-data"
import type { Notification } from "@/lib/types/dashboard"
import { MetricCard } from "@/components/dashboard/employee/home/metricCard"
import { RecentMessagesCard } from "@/components/dashboard/employee/home/recentMessagesCard"
import { OrganizationHomeHeader } from "./home/organizationHomeHeader"
import { CreateOfferCard } from "./home/createOfferCard"
import { OrganizationRecentApplicationsCard } from "./home/organizationRecentApplicationsCard"
import { PlaceholderCard } from "./home/placeholderCard"
import { Calendar03Icon, UserIcon } from "@hugeicons/core-free-icons"

export function OrganizationHomeContent() {
  const router = useRouter()
  const { useSession } = authClient
  const { data, isPending } = useSession()

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Nueva aplicación recibida",
      message: "María González aplicó a Investigador en Biotecnología",
      time: "Hace 2 horas",
      isRead: false,
      type: "application",
    },
    {
      id: 2,
      title: "Entrevista programada",
      message: "Ana Martínez confirmó entrevista para mañana",
      time: "Hace 4 horas",
      isRead: false,
      type: "interview",
    },
    {
      id: 3,
      title: "Nuevo mensaje",
      message: "Carlos Rodríguez te envió un mensaje",
      time: "Hace 1 día",
      isRead: true,
      type: "recommendation",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleNotificationClick = useCallback((id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }, [])

  const handleViewAllMessages = useCallback(() => {
    router.push("/dashboard/messages")
  }, [router])

  const firstName = data?.user?.name?.split(" ")[0] || "Organización"

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <OrganizationHomeHeader
        firstName={firstName}
        isPending={isPending}
        notifications={notifications}
        unreadCount={unreadCount}
        onNotificationClick={handleNotificationClick}
      />

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ORGANIZATION_DATA.metrics.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </div>

      <div className="mt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <OrganizationRecentApplicationsCard applications={ORGANIZATION_DATA.recentApplications} />
        <RecentMessagesCard
          messages={ORGANIZATION_DATA.recentMessages}
          onViewAll={handleViewAllMessages}
        />
      </div>

      <div className="mt-4">
        <CreateOfferCard />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <PlaceholderCard
          title="Próximas entrevistas"
          description="calendario de entrevistas"
          icon={Calendar03Icon}
        />
        <PlaceholderCard
          title="Candidatos destacados"
          description="candidatos que coinciden con tus ofertas"
          icon={UserIcon}
        />
      </div>
    </div>
  )
}
