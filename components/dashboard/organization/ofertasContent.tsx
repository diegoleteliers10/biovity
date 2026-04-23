"use client"

import {
  Cash02Icon,
  Clock01Icon,
  Delete01Icon,
  Edit01Icon,
  EyeIcon,
  FileAddIcon,
  MoreHorizontalIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { addTransitionType, startTransition, useState, ViewTransition } from "react"
import { DirectionalTransition } from "@/components/dashboard/shared/DirectionalTransition"
import { MobileMenuButton } from "@/components/dashboard/shared/MobileMenuButton"
import { NotificationBell } from "@/components/common/NotificationBell"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Job } from "@/lib/api/jobs"
import { formatJobLocation } from "@/lib/api/jobs"
import { useDeleteJobMutation, useJobsByOrganization } from "@/lib/api/use-jobs"
import { authClient } from "@/lib/auth-client"
import { formatCurrencyCLP, formatDateChilean } from "@/lib/utils"
import { CreateJobDialog } from "./CreateJobDialog"

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

function getDaysRemaining(expiresAt?: string): string {
  if (!expiresAt) return ""
  const now = new Date()
  const exp = new Date(expiresAt)
  const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return "Expirada"
  if (diff === 0) return "Expira hoy"
  if (diff === 1) return "Expira mañana"
  if (diff <= 7) return `${diff} días`
  return formatDateChilean(expiresAt, "d MMM yyyy")
}

export function OfertasContent() {
  const router = useRouter()
  const { useSession } = authClient
  const { data: session, isPending: sessionPending } = useSession()
  const organizationId = (session?.user as { organizationId?: string })?.organizationId

  const { data: orgJobs, isLoading, error } = useJobsByOrganization(organizationId)
  const jobList = orgJobs?.data ?? []
  const deleteMutation = useDeleteJobMutation(organizationId ?? "")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [deleteConfirmJob, setDeleteConfirmJob] = useState<Job | null>(null)

  const handleCreateOffer = () => {
    setEditingJob(null)
    setDialogOpen(true)
  }

  const handleEditJob = (job: Job) => {
    setEditingJob(job)
    setDialogOpen(true)
  }

  const handleDeleteClick = (job: Job) => {
    setDeleteConfirmJob(job)
  }

  const handleDeleteConfirm = () => {
    if (!deleteConfirmJob) return
    deleteMutation.mutate(deleteConfirmJob.id, {
      onSuccess: () => setDeleteConfirmJob(null),
    })
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) setEditingJob(null)
    setDialogOpen(open)
  }

  if (sessionPending) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-1">
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          <div className="h-5 w-80 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    )
  }

  if (!organizationId) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-wide">Ofertas</h1>
          <p className="text-muted-foreground text-sm">
            Gestiona tus vacantes y publica nuevas ofertas de empleo.
          </p>
        </div>
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-destructive text-sm">
            No tienes una organización asociada. Completa tu perfil para publicar ofertas.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Top row: menu + notification on mobile */}
      <div className="flex items-center justify-between lg:hidden">
        <MobileMenuButton />
        <NotificationBell notifications={[]} />
      </div>

      <div className="space-y-1">
        <div className="hidden lg:flex justify-end">
          <NotificationBell notifications={[]} />
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-wide">Ofertas</h1>
            <p className="text-muted-foreground text-sm">
              Gestiona tus vacantes y publica nuevas ofertas de empleo.
            </p>
          </div>
          <div className="hidden lg:block">
            <Button onClick={handleCreateOffer}>
              <HugeiconsIcon icon={FileAddIcon} size={18} strokeWidth={1.5} className="mr-2" />
              Crear oferta
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-destructive text-sm">{error.message}</p>
        </div>
      ) : !jobList.length ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed">
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-muted">
              <HugeiconsIcon
                icon={FileAddIcon}
                size={44}
                strokeWidth={1.5}
                className="h-11 w-11 text-muted-foreground"
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Aún no tienes ofertas publicadas.</p>
              <p className="text-xs text-muted-foreground">
                Crea tu primera oferta para empezar a recibir candidatos.
              </p>
            </div>
            <Button onClick={handleCreateOffer} className="mt-2">
              <HugeiconsIcon icon={FileAddIcon} size={18} strokeWidth={1.5} className="mr-2" />
              Crear oferta
            </Button>
          </div>
        </div>
      ) : (
        <DirectionalTransition>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {jobList.map((job) => {
              const salaryStr = formatJobSalary(job)

              return (
                <Card
                  key={job.id}
                  className="group relative cursor-pointer border border-border bg-card"
                >
                  {/* Full-card clickable link */}
                  <button
                    type="button"
                    onClick={() => {
                      startTransition(() => {
                        addTransitionType("nav-forward")
                        router.push(`/dashboard/ofertas/${job.id}`)
                      })
                    }}
                    className="absolute inset-0 z-[1] block rounded-xl transition-all duration-200 hover:bg-secondary/5"
                  />

                  {/* Card content */}
                  <div className="relative z-0 flex flex-col gap-0 p-0">
                    {/* Header: title + status */}
                    <div className="flex items-start justify-between gap-2 px-4 pt-4">
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground pr-2">
                        <ViewTransition name={`job-title-${job.id}`} share="morph" default="none">
                          {job.title}
                        </ViewTransition>
                      </h3>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusColors[job.status] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {getStatusLabel(job.status)}
                      </span>
                    </div>

                    {/* Salary */}
                    <div className="flex items-center gap-2 border-t border-border/10 px-4 py-2">
                      <HugeiconsIcon
                        icon={Cash02Icon}
                        size={13}
                        strokeWidth={1.5}
                        className="h-3.5 w-3.5 shrink-0 text-secondary"
                      />
                      <span className="text-xs font-medium text-foreground">{salaryStr}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 px-4 pb-2">
                      <div className="flex items-center gap-1">
                        <HugeiconsIcon
                          icon={UserGroupIcon}
                          size={13}
                          strokeWidth={1.5}
                          className="h-3.5 w-3.5 text-muted-foreground"
                        />
                        <span className="text-xs text-foreground">
                          {job.applicationsCount ?? 0}
                        </span>
                        <span className="text-xs text-muted-foreground">post.</span>
                      </div>
                      <div className="h-3 w-px bg-border/30" />
                      <div className="flex items-center gap-1">
                        <HugeiconsIcon
                          icon={EyeIcon}
                          size={13}
                          strokeWidth={1.5}
                          className="h-3.5 w-3.5 text-muted-foreground"
                        />
                        <span className="text-xs text-foreground">{job.views ?? 0}</span>
                        <span className="text-xs text-muted-foreground">vistas</span>
                      </div>
                      {job.expiresAt && (
                        <>
                          <div className="h-3 w-px bg-border/30" />
                          <div className="flex items-center gap-1">
                            <HugeiconsIcon
                              icon={Clock01Icon}
                              size={13}
                              strokeWidth={1.5}
                              className="h-3.5 w-3.5 text-muted-foreground"
                            />
                            <span className="text-xs text-muted-foreground">
                              {getDaysRemaining(job.expiresAt)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-border/10 px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                      <span>
                        {job.createdAt ? formatDateChilean(job.createdAt, "d MMM yyyy") : "—"}
                      </span>
                      {job.expiresAt && (
                        <span>Expira: {formatDateChilean(job.expiresAt, "d MMM yyyy")}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions overlay - above the clickable link */}
                  <div className="absolute right-2 top-2 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <HugeiconsIcon icon={MoreHorizontalIcon} size={20} strokeWidth={1.5} onClick={(e) => e.stopPropagation()} className="relative right-2"/>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditJob(job)
                          }}
                        >
                          <HugeiconsIcon
                            icon={Edit01Icon}
                            size={18}
                            strokeWidth={1.5}
                            className="mr-2"
                          />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClick(job)
                          }}
                        >
                          <HugeiconsIcon
                            icon={Delete01Icon}
                            size={18}
                            strokeWidth={1.5}
                            className="mr-2"
                          />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              )
            })}

            {/* Create new offer card */}
            {jobList.length > 0 && (
              <button
                type="button"
                onClick={handleCreateOffer}
                className="group flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/40 bg-transparent px-4 py-6 transition-all duration-200 hover:border-secondary/40 hover:bg-secondary/5 active:scale-[0.98]"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-secondary/10 transition-colors duration-200 group-hover:bg-secondary/20">
                  <HugeiconsIcon
                    icon={FileAddIcon}
                    size={22}
                    strokeWidth={1.5}
                    className="text-secondary"
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  Crear nueva oferta
                </span>
              </button>
            )}
          </div>
        </DirectionalTransition>
      )}

      <CreateJobDialog
        organizationId={organizationId}
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        job={editingJob}
      />

      <AlertDialog
        open={Boolean(deleteConfirmJob)}
        onOpenChange={(open) => !open && setDeleteConfirmJob(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar oferta?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará la oferta &quot;{deleteConfirmJob?.title}&quot;. Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteConfirm()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
