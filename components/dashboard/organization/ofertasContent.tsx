"use client"

import {
  Delete01Icon,
  Edit01Icon,
  FileAddIcon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useJobsByOrganization, useDeleteJobMutation } from "@/lib/api/use-jobs"
import type { Job } from "@/lib/api/jobs"
import { formatJobLocation } from "@/lib/api/jobs"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/animate-ui/components/radix/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateJobDialog } from "./CreateJobDialog"

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  cerrada: "bg-gray-100 text-gray-800",
  closed: "bg-gray-100 text-gray-800",
  borrador: "bg-yellow-100 text-yellow-800",
  draft: "bg-yellow-100 text-yellow-800",
  paused: "bg-yellow-100 text-yellow-800",
  expired: "bg-red-100 text-red-800",
}

function getApplicationsCount(job: { applicationsCount?: number }): number {
  return job.applicationsCount ?? 0
}

function formatApplicationsCount(count: number): string {
  return count === 1 ? "1 aplicación" : `${count} aplicaciones`
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

export function OfertasContent() {
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
          <h1 className="text-[28px] font-bold tracking-wide">Ofertas</h1>
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
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold tracking-wide">Ofertas</h1>
          <p className="text-muted-foreground text-sm">
            Gestiona tus vacantes y publica nuevas ofertas de empleo.
          </p>
        </div>
        <Button onClick={handleCreateOffer}>
          <HugeiconsIcon icon={FileAddIcon} size={18} strokeWidth={1.5} className="mr-2" />
          Crear oferta
        </Button>
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
        <div className="grid grid-cols-1 gap-4">
          {jobList.map((job) => (
            <Card
              key={job.id}
              className="cursor-pointer border-border/60 transition-colors duration-200 hover:border-border"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-0.5">
                    <CardTitle className="line-clamp-2 text-[15px] font-semibold leading-tight md:text-base">
                      {job.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {formatJobLocation(job.location) || "Sin especificar"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[job.status] ?? "bg-gray-100 text-gray-800"}`}
                    >
                      {getStatusLabel(job.status)}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label="Más opciones"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <HugeiconsIcon icon={MoreHorizontalIcon} size={20} strokeWidth={1.5} />
                        </Button>
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
                          className="cursor-pointer text-destructive focus:text-destructive [&_svg]:text-current"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClick(job)
                          }}
                        >
                          <HugeiconsIcon
                            icon={Delete01Icon}
                            size={18}
                            strokeWidth={1.5}
                            className="mr-2 text-current"
                          />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-muted-foreground text-xs">
                  <span>
                    Publicada:{" "}
                    {job.createdAt
                      ? format(new Date(job.createdAt), "d MMM yyyy", { locale: es })
                      : "—"}
                  </span>
                  <span>{formatApplicationsCount(getApplicationsCount(job))}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
