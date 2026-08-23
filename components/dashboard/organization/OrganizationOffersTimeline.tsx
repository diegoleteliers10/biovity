"use client"

import { ArrowRight01Icon, Briefcase01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import type { Job } from "@/lib/api/jobs"
import { useJobsByOrganization } from "@/lib/api/use-jobs"
import { cn, formatDateChilean } from "@/lib/utils"

const STATUS_LABELS: Record<string, string> = {
  active: "Activa",
  draft: "Borrador",
  paused: "Pausada",
  closed: "Cerrada",
  expired: "Expirada",
}

const STATUS_CHIP: Record<string, string> = {
  active: "bg-secondary/10 text-secondary",
  draft: "bg-surface-container-highest text-muted-foreground",
  paused: "bg-yellow-500/10 text-yellow-700",
  closed: "bg-surface-container-highest text-foreground",
  expired: "bg-destructive/10 text-destructive",
}

export function OrganizationOffersTimeline({ organizationId }: { organizationId: string }) {
  const router = useRouter()
  const { data, isLoading, error } = useJobsByOrganization(organizationId, { limit: 20 })
  const jobs: Job[] = data?.data ?? []

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-destructive text-pretty">{error.message}</p>
  }

  if (jobs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-pretty">
        Aún no has publicado ofertas. Crea tu primera oferta para recibir postulaciones.
      </p>
    )
  }

  return (
    <div className="relative before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-px before:bg-border">
      {jobs.map((job) => (
        <article key={job.id} className="relative pb-7 pl-12 last:pb-0">
          <span className="absolute top-0 left-0 grid size-[31px] place-items-center rounded-full border border-border bg-background text-muted-foreground">
            <HugeiconsIcon icon={Briefcase01Icon} size={14} strokeWidth={1.7} aria-hidden />
          </span>
          <div className="flex items-baseline justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-base leading-6 font-semibold text-foreground">{job.title}</h3>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-xs leading-4 font-medium",
                  STATUS_CHIP[job.status] ?? "bg-surface-container-highest text-foreground"
                )}
              >
                {STATUS_LABELS[job.status] ?? job.status}
              </span>
            </div>
            <span className="shrink-0 text-[13px] whitespace-nowrap text-muted-foreground tabular-nums">
              Publicada el {formatDateChilean(job.createdAt, "d MMM yyyy")}
            </span>
          </div>
          {job.description && (
            <p className="mt-1.5 line-clamp-2 max-w-[55ch] text-sm leading-6 text-muted-foreground text-pretty">
              {job.description}
            </p>
          )}
          <button
            type="button"
            onClick={() => router.push(`/dashboard/ofertas/${job.id}`)}
            className="mt-2.5 inline-flex cursor-pointer items-center gap-1.5 text-[13px] leading-4 font-medium text-primary hover:underline"
          >
            Ver postulaciones
            <HugeiconsIcon icon={ArrowRight01Icon} size={12} strokeWidth={1.8} aria-hidden />
          </button>
        </article>
      ))}
    </div>
  )
}
