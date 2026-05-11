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
import { useDeleteJobMutation } from "@/lib/api/use-jobs"

interface DeleteJobAlertDialogProps {
  job: Job | null
  onClose: () => void
  organizationId: string
}

export function DeleteJobAlertDialog({ job, onClose, organizationId }: DeleteJobAlertDialogProps) {
  const deleteMutation = useDeleteJobMutation(organizationId)

  const handleDeleteConfirm = () => {
    if (!job) return
    deleteMutation.mutate(job.id, {
      onSuccess: () => onClose(),
    })
  }

  return (
    <AlertDialog open={Boolean(job)} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar oferta?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará la oferta &quot;{job?.title}&quot;. Esta acción no se puede deshacer.
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
  )
}
