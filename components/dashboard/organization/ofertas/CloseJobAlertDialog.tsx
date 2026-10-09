"use client"

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
import type { Job } from "@/lib/api/jobs"
import { useUpdateJobMutation } from "@/lib/api/use-jobs"

interface CloseJobAlertDialogProps {
  job: Job | null
  onClose: () => void
  organizationId: string
  /** Controlled visibility; defaults to whether a job is set. */
  open?: boolean
}

export function CloseJobAlertDialog({
  job,
  onClose,
  organizationId,
  open,
}: CloseJobAlertDialogProps) {
  const updateJobMutation = useUpdateJobMutation(organizationId)

  const handleCloseConfirm = () => {
    if (!job) return
    updateJobMutation.mutate(
      { id: job.id, input: { status: "closed" } },
      { onSuccess: () => onClose() }
    )
  }

  return (
    <AlertDialog open={open ?? Boolean(job)} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Cerrar oferta?</AlertDialogTitle>
          <AlertDialogDescription>
            La oferta &quot;{job?.title}&quot; dejará de recibir postulaciones y pasará a estado
            Cerrada. Puedes reactivarla más tarde editándola.
          </AlertDialogDescription>
          {updateJobMutation.isError && (
            <p className="text-sm text-destructive">{updateJobMutation.error.message}</p>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={updateJobMutation.isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleCloseConfirm()
            }}
            disabled={updateJobMutation.isPending}
          >
            {updateJobMutation.isPending ? "Cerrando..." : "Cerrar oferta"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
