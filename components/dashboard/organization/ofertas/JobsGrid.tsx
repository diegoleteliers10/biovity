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
  onPublish: (job: Job) => void
  onCreate: () => void
  onDuplicate?: (job: Job) => void
}

export function JobsGrid({
  jobs,
  onEdit,
  onDelete,
  onPublish,
  onCreate,
  onDuplicate,
}: JobsGridProps) {
  return (
    <DirectionalTransition>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <OfertaCard
            key={job.id}
            job={job}
            onEdit={onEdit}
            onDelete={onDelete}
            onPublish={onPublish}
            onDuplicate={onDuplicate}
          />
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
    <div className="flex flex-1 items-center justify-center">
      <div className="flex w-full max-w-md flex-col items-center rounded-xl border border-border/40 bg-surface-container-low p-6 text-center shadow-none">
        <div className="size-10 rounded-full bg-surface-container-highest flex items-center justify-center text-muted-foreground">
          <HugeiconsIcon icon={FileAddIcon} size={20} strokeWidth={1.5} />
        </div>
        <p className="mt-3 mb-1 text-sm font-medium text-foreground">
          Aún no tienes ofertas publicadas.
        </p>
        <p className="mb-4 text-xs text-muted-foreground">
          Crea tu primera oferta para empezar a recibir candidatos.
        </p>
        <Button
          onClick={onCreate}
          size="sm"
          className="h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs font-medium"
        >
          Crear oferta
        </Button>
      </div>
    </div>
  )
}
