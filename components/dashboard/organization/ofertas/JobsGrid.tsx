"use client"

import { FileAddIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CreateOfferCard,
  OfertaCard,
} from "@/components/dashboard/organization/ofertasContentUtils"
import { DirectionalTransition } from "@/components/dashboard/shared/DirectionalTransition"
import { Button } from "@/components/ui/button"
import type { Job } from "@/lib/api/jobs"

interface JobsGridProps {
  jobs: Job[]
  onEdit: (job: Job) => void
  onDelete: (job: Job) => void
  onCreate: () => void
}

export function JobsGrid({ jobs, onEdit, onDelete, onCreate }: JobsGridProps) {
  return (
    <DirectionalTransition>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <OfertaCard key={job.id} job={job} onEdit={onEdit} onDelete={onDelete} />
        ))}
        {jobs.length > 0 && <CreateOfferCard onClick={onCreate} />}
      </div>
    </DirectionalTransition>
  )
}

interface EmptyStateProps {
  onCreate: () => void
}

export function EmptyJobsState({ onCreate }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed">
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-muted">
          <HugeiconsIcon
            icon={FileAddIcon}
            size={44}
            strokeWidth={1.5}
            className="size-11 text-muted-foreground"
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Aún no tienes ofertas publicadas.</p>
          <p className="text-xs text-muted-foreground">
            Crea tu primera oferta para empezar a recibir candidatos.
          </p>
        </div>
        <Button onClick={onCreate} className="mt-2">
          <HugeiconsIcon icon={FileAddIcon} size={18} strokeWidth={1.5} className="mr-2" />
          Crear oferta
        </Button>
      </div>
    </div>
  )
}
