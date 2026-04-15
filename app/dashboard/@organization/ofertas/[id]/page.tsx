"use client"

import {
  ArrowLeft01Icon,
  Briefcase01Icon,
  Cash02Icon,
  Clock01Icon,
  EyeIcon,
  Home02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useParams, useRouter } from "next/navigation"
import { addTransitionType, startTransition, ViewTransition } from "react"
import { DirectionalTransition } from "@/components/dashboard/shared/DirectionalTransition"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Job } from "@/lib/api/jobs"
import { useApplicationsByJob } from "@/lib/api/use-applications"
import { useJob } from "@/lib/api/use-jobs"
import { useOrganization } from "@/lib/api/use-organization-mutations"
import { formatCurrencyCLP, formatDateChilean } from "@/lib/utils"

function formatJobSalary(job: Job): string {
  const s = job.salary
  if (!s) return "A convenir"
  if (s.min != null && s.max != null) {
    const currency = s.currency === "USD" ? "USD" : "CLP"
    const period = s.period === "monthly" ? "mes" : (s.period ?? "")
    return `${formatCurrencyCLP(s.min)} - ${formatCurrencyCLP(s.max)} ${currency}/${period}`
  }
  if (s.isNegotiable) return "A convenir"
  return "A convenir"
}

function getJobModalidad(loc: Job["location"]): string {
  if (!loc) return "Presencial"
  if (loc.isRemote) return "Remoto"
  if (loc.isHybrid) return "Híbrido"
  return "Presencial"
}

function formatJobLocation(loc: Job["location"]): string {
  if (!loc) return "Sin especificar"
  const parts = [loc.city, loc.state, loc.country].filter(Boolean)
  return parts.join(", ") || "Sin especificar"
}

const statusColors: Record<string, string> = {
  active: "bg-secondary/10 text-secondary border border-secondary/20",
  cerrada: "bg-muted text-muted-foreground",
  closed: "bg-muted text-muted-foreground",
  borrador: "bg-accent/10 text-accent border border-accent/20",
  draft: "bg-accent/10 text-accent border border-accent/20",
  paused: "bg-yellow-100 text-yellow-800",
  expired: "bg-destructive/10 text-destructive border border-destructive/20",
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: "Activa",
    draft: "Borrador",
    paused: "Pausada",
    closed: "Cerrada",
    expired: "Expirada",
  }
  return labels[status] ?? status.charAt(0).toUpperCase() + status.slice(1)
}

export default function OfertaDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const jobId = params?.id ?? undefined
  const { data: job, isLoading: jobLoading, error } = useJob(jobId)
  const { data: organization } = useOrganization(job?.organizationId)
  const { data: applications, isLoading: appsLoading } = useApplicationsByJob(jobId)

  if (!jobId) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-muted-foreground text-sm">ID de oferta no válido.</p>
      </div>
    )
  }

  if (jobLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        <div className="h-40 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <p className="text-destructive text-sm">{error?.message ?? "No se encontró la oferta."}</p>
        <button
          type="button"
          onClick={() => {
            startTransition(() => {
              addTransitionType("nav-back")
              router.push("/dashboard/ofertas")
            })
          }}
          className="text-primary text-sm hover:underline bg-transparent border-none p-0 font-inherit cursor-pointer"
        >
          ← Volver
        </button>
      </div>
    )
  }

  const salaryStr = formatJobSalary(job)
  const modalidad = getJobModalidad(job.location)
  const locationStr = formatJobLocation(job.location)

  return (
    <DirectionalTransition>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Back button */}
        <button
          type="button"
          onClick={() => {
            startTransition(() => {
              addTransitionType("nav-back")
              router.push("/dashboard/ofertas")
            })
          }}
          className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground bg-transparent border-none p-0 font-inherit cursor-pointer"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={1.5} />
          Volver a ofertas
        </button>

        {/* Job Header */}
        <Card className="border border-border bg-card">
          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-semibold leading-tight text-foreground">
                  <ViewTransition name={`job-title-${job.id}`} share="morph" default="none">
                    {job.title}
                  </ViewTransition>
                </h1>
                <p className="mt-1 text-muted-foreground text-sm">
                  {organization?.name ?? job.organization?.name ?? "Organización"}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider ${statusColors[job.status] ?? "bg-muted text-muted-foreground"}`}
              >
                {getStatusLabel(job.status)}
              </span>
            </div>

            {/* Job meta */}
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-xs">
              <span className="inline-flex items-center gap-1">
                <HugeiconsIcon
                  icon={Home02Icon}
                  size={13}
                  strokeWidth={1.5}
                  className="h-3.5 w-3.5"
                />
                {locationStr}
              </span>
              <span className="text-muted-foreground/30">·</span>
              <span className={modalidad !== "Presencial" ? "text-secondary font-medium" : ""}>
                {modalidad}
              </span>
              <span className="text-muted-foreground/30">·</span>
              <span className="inline-flex items-center gap-1">
                <HugeiconsIcon
                  icon={Briefcase01Icon}
                  size={13}
                  strokeWidth={1.5}
                  className="h-3.5 w-3.5"
                />
                {job.employmentType}
              </span>
              <span className="text-muted-foreground/30">·</span>
              <span>{job.experienceLevel}</span>
            </div>

            {/* Salary */}
            <div className="flex items-center gap-2 rounded-lg bg-[#f3f3f5] px-4 py-2.5">
              <HugeiconsIcon
                icon={Cash02Icon}
                size={16}
                strokeWidth={1.5}
                className="h-4 w-4 text-secondary"
              />
              <span className="text-sm font-medium text-foreground">{salaryStr}</span>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <HugeiconsIcon
                  icon={UserGroupIcon}
                  size={15}
                  strokeWidth={1.5}
                  className="h-4 w-4 text-secondary"
                />
                <span className="text-sm font-medium text-foreground">
                  {applications?.length ?? 0}
                </span>
                <span className="text-sm text-muted-foreground">postulaciones</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HugeiconsIcon
                  icon={EyeIcon}
                  size={15}
                  strokeWidth={1.5}
                  className="h-4 w-4 text-muted-foreground"
                />
                <span className="text-sm font-medium text-foreground">{job.views ?? 0}</span>
                <span className="text-sm text-muted-foreground">vistas</span>
              </div>
              {job.expiresAt && (
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    size={15}
                    strokeWidth={1.5}
                    className="h-4 w-4 text-muted-foreground"
                  />
                  <span className="text-sm text-muted-foreground">
                    Expira {formatDateChilean(job.expiresAt, "d MMM yyyy")}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Applicants Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Postulaciones ({applications?.length ?? 0})
            </h2>
          </div>

          {appsLoading ? (
            <div className="rounded-lg border border-border">
              <div className="h-12 animate-pulse border-b border-border bg-muted/50" />
              <div className="h-12 animate-pulse border-b border-border bg-muted/50" />
              <div className="h-12 animate-pulse bg-muted/50" />
            </div>
          ) : !applications || applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
              <HugeiconsIcon
                icon={UserGroupIcon}
                size={32}
                strokeWidth={1.5}
                className="mb-2 h-8 w-8 text-muted-foreground"
              />
              <p className="text-sm text-muted-foreground">
                Aún no hay postulaciones para esta oferta.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Candidato</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-secondary/10 text-secondary text-xs font-semibold">
                              {app.candidate?.name?.charAt(0).toUpperCase() ?? "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {app.candidate?.name ?? "Candidato"}
                            </p>
                            <p className="truncate text-muted-foreground text-xs">
                              {app.candidate?.email ?? ""}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            app.status === "pendiente"
                              ? "outline"
                              : app.status === "entrevista"
                                ? "secondary"
                                : app.status === "oferta"
                                  ? "default"
                                  : app.status === "rechazado"
                                    ? "destructive"
                                    : "secondary"
                          }
                          className="text-[10px] uppercase tracking-wider"
                        >
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-xs">
                        {formatDateChilean(app.createdAt, "d MMM yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </DirectionalTransition>
  )
}
