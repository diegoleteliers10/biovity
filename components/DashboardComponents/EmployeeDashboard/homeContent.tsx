"use client"

import {
  Bookmark02Icon,
  Cash02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  File02Icon,
  IdeaIcon,
  Location05Icon,
  Notification01Icon,
  TradeUpIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Suspense, useState } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"
import { DATA } from "@/lib/data/data-test"

export const HomeContent = () => {
  const router = useRouter()
  const { useSession } = authClient
  const { data, isPending } = useSession()

  // Estado para las notificaciones
  const [notifications, setNotifications] = useState([
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

  const toSlug = (value: string): string => {
    return value
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleJobClick = (jobTitle: string, company: string) => {
    const slug = toSlug(jobTitle)
    router.push(`/dashboard/employee/job/${slug}`)
  }

  const handleApplyJob = (jobId: number, jobTitle: string, company: string) => {
    router.push(`/dashboard/employee/job/${jobId}`)
  }

  const handleSaveJob = (jobId: number, jobTitle: string, company: string) => {
    console.log(`Saving job: ${jobTitle} at ${company} (ID: ${jobId})`)
  }

  const handleViewAllJobs = () => {
    console.log("Viewing all recommended jobs")
  }

  const handleCreateAlert = () => {
    console.log("Creating new job alert")
  }

  // Componente para el header con skeleton
  const HeaderContent = () => {
    if (isPending) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-9 w-80" />
          <Skeleton className="h-5 w-96" />
        </div>
      )
    }

    const firstName = data?.user?.name?.split(" ")[0] || "Usuario"

    return (
      <div className="space-y-2">
        <h1 className="text-[28px] font-bold tracking-wide">¡Bienvenido/a de vuelta, {firstName}!</h1>
        <p className="text-muted-foreground">
          Aquí está lo que está pasando con tus aplicaciones de trabajo hoy.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Suspense
          fallback={
            <div className="space-y-2">
              <Skeleton className="h-9 w-80" />
              <Skeleton className="h-5 w-96" />
            </div>
          }
        >
          <HeaderContent />
        </Suspense>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <HugeiconsIcon icon={Notification01Icon} size={24} strokeWidth={1.5} />
                {unreadCount > 0 && (
                  <span className="absolute top-[8px] right-[9px] h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>

              {/* Ejemplo de notificaciones */}
              <div className="p-2 space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      // Marcar como leída
                      setNotifications((prev) =>
                        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
                      )
                    }}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                        notification.isRead
                          ? "bg-gray-300"
                          : notification.type === "application"
                            ? "bg-blue-500"
                            : notification.type === "interview"
                              ? "bg-green-500"
                              : "bg-purple-500"
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${notification.isRead ? "font-normal" : "font-medium"}`}
                      >
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/*<div className="p-2">
                <Button variant="ghost" className="w-full justify-center text-xs">
                  Ver todas las notificaciones
                </Button>
              </div>*/}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DATA.metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <HugeiconsIcon
                icon={metric.icon}
                size={24}
                strokeWidth={1.5}
                className="h-4 w-4 text-muted-foreground"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.trend && (
                <p
                  className={`text-xs ${metric.trendPositive ? "text-green-600" : "text-red-600"}`}
                >
                  <HugeiconsIcon
                    icon={TradeUpIcon}
                    size={24}
                    strokeWidth={1.5}
                    className="inline h-3 w-3 mr-1"
                  />
                  {metric.trend}
                </p>
              )}
              {metric.subtitle && (
                <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Applications and Messages */}
      <div className="mt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Applications */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Aplicaciones Recientes</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Ver Todo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DATA.recentApplications.map((app) => (
                <div
                  key={app.jobTitle}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200 border border-transparent hover:border-gray-200"
                  onClick={() => handleJobClick(app.jobTitle, app.company)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleJobClick(app.jobTitle, app.company)
                    }
                  }}
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

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mensajes Recientes</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Ver Todo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {DATA.recentMessages.map((message) => (
                <div key={message.sender} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{message.sender}</p>
                    <p className="text-xs text-muted-foreground">{message.time}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{message.preview}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Jobs Section */}
      <div className="mt-4 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl tracking-tight font-semibold">Empleos Recomendados para Ti</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewAllJobs}
            className="text-muted-foreground hover:text-foreground"
          >
            Ver Todos los Empleos
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DATA.recommendedJobs.map((job) => (
            <Card
              key={job.jobTitle}
              className="relative overflow-hidden flex flex-col cursor-pointer transition-colors duration-300"
              onClick={() => handleJobClick(job.jobTitle, job.company)}
              aria-label={`Ver detalles del trabajo ${job.jobTitle} en ${job.company}`}
            >
              <CardHeader className="relative">
                <div className="space-y-8">
                  <div className="flex items-start justify-start">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {job.compatibility}% compatibilidad
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                      <HugeiconsIcon icon={File02Icon} size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold leading-tight line-clamp-2">
                        {job.jobTitle}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{job.company}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0 flex-1 flex flex-col">
                {/* Job Details */}
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <HugeiconsIcon
                      icon={Location05Icon}
                      size={24}
                      strokeWidth={1.5}
                      className="h-3 w-3 flex-shrink-0"
                    />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HugeiconsIcon
                      icon={Cash02Icon}
                      size={24}
                      strokeWidth={1.5}
                      className="h-3 w-3 flex-shrink-0"
                    />
                    <span className="truncate">{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HugeiconsIcon
                      icon={Clock01Icon}
                      size={24}
                      strokeWidth={1.5}
                      className="h-3 w-3 flex-shrink-0"
                    />
                    <span className="truncate">{job.postedTime}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {job.tags.slice(0, 2).map((tag) => (
                    <span
                      key={job.jobTitle}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground truncate"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    +{job.additionalTags}
                  </span>
                </div>

                {/* Action Buttons - pushed to bottom */}
                <div className="pt-4 mt-auto">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleApplyJob(job.id, job.jobTitle, job.company)
                      }}
                    >
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        size={24}
                        strokeWidth={1.5}
                        className="h-3 w-3 mr-1"
                      />
                      Aplicar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSaveJob(job.id, job.jobTitle, job.company)
                      }}
                      className="px-3 text-xs"
                    >
                      <HugeiconsIcon
                        icon={Bookmark02Icon}
                        size={24}
                        strokeWidth={1.5}
                        className={`h-3 w-3 ${job.isSaved ? "fill-current" : ""}`}
                      />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
          {/* New Alert Form */}
          <Card>
            <CardContent className="p-4 flex gap-4">
              <div className="space-y-4 mx-auto w-full">
                <div className="space-y-2">
                  <label htmlFor="keywords" className="text-sm font-medium">
                    Palabras clave
                  </label>
                  <Input
                    id="keywords"
                    placeholder="Ej: biotecnología, investigación, laboratorio..."
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Ubicación
                  </label>
                  <Input id="location" placeholder="Ciudad, país o remoto" className="text-sm" />
                </div>

                <Button className="w-full" onClick={handleCreateAlert}>
                  <HugeiconsIcon
                    icon={Notification01Icon}
                    size={24}
                    strokeWidth={1.5}
                    className="h-4 w-4 mr-2"
                  />
                  Crear Nueva Alerta
                </Button>

                {/* Tip Section */}
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <HugeiconsIcon
                    icon={IdeaIcon}
                    size={24}
                    strokeWidth={1.5}
                    className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Consejo:</span> Crea múltiples alertas con
                    diferentes palabras clave para no perderte oportunidades.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
