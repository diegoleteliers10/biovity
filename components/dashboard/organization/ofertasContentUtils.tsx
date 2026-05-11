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
import { useRouter } from "next/navigation"
import { addTransitionType, startTransition, ViewTransition } from "react"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Job } from "@/lib/api/jobs"
import { formatAmountCLP, formatDateChilean } from "@/lib/utils"

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
    return `${formatAmountCLP(s.min)} - ${formatAmountCLP(s.max)} ${currency}/${period}`
  }
  if (s.isNegotiable) return "A convenir"
  return "A convenir"
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

interface OfertaCardProps {
  job: Job
  onEdit: (job: Job) => void
  onDelete: (job: Job) => void
}

export function OfertaCard({ job, onEdit, onDelete }: OfertaCardProps) {
  const { push } = useRouter()
  const salaryStr = formatJobSalary(job)

  return (
    <Card className="group relative cursor-pointer border border-border bg-card">
      <button
        type="button"
        onClick={() => {
          startTransition(() => {
            addTransitionType("nav-forward")
            push(`/dashboard/ofertas/${job.id}`)
          })
        }}
        className="absolute inset-0 z-[1] block rounded-xl transition-all duration-200 hover:bg-secondary/5"
      />
      <div className="relative z-0 flex flex-col gap-0 p-0">
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

        <div className="flex items-center gap-2 border-t border-border/10 px-4 py-2">
          <HugeiconsIcon
            icon={Cash02Icon}
            size={13}
            strokeWidth={1.5}
            className="size-3.5 shrink-0 text-secondary"
          />
          <span className="text-xs font-medium text-foreground">{salaryStr}</span>
        </div>

        <div className="flex items-center gap-3 px-4 pb-2">
          <div className="flex items-center gap-1">
            <HugeiconsIcon
              icon={UserGroupIcon}
              size={13}
              strokeWidth={1.5}
              className="size-3.5 text-muted-foreground"
            />
            <span className="text-xs text-foreground">{job.applicationsCount ?? 0}</span>
            <span className="text-xs text-muted-foreground">post.</span>
          </div>
          <div className="h-3 w-px bg-border/30" />
          <div className="flex items-center gap-1">
            <HugeiconsIcon
              icon={EyeIcon}
              size={13}
              strokeWidth={1.5}
              className="size-3.5 text-muted-foreground"
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
                  className="size-3.5 text-muted-foreground"
                />
                <span className="text-xs text-muted-foreground">
                  {getDaysRemaining(job.expiresAt)}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border/10 px-4 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>{job.createdAt ? formatDateChilean(job.createdAt, "d MMM yyyy") : "—"}</span>
          {job.expiresAt && <span>Expira: {formatDateChilean(job.expiresAt, "d MMM yyyy")}</span>}
        </div>
      </div>

      <div className="absolute right-2 top-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <HugeiconsIcon
              icon={MoreHorizontalIcon}
              size={20}
              strokeWidth={1.5}
              onClick={(e) => e.stopPropagation()}
              className="relative right-2"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(job)
              }}
            >
              <HugeiconsIcon icon={Edit01Icon} size={18} strokeWidth={1.5} className="mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(job)
              }}
            >
              <HugeiconsIcon icon={Delete01Icon} size={18} strokeWidth={1.5} className="mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}

interface CreateOfferCardProps {
  onClick: () => void
}

export function CreateOfferCard({ onClick }: CreateOfferCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/40 bg-transparent px-4 py-6 transition-all duration-200 hover:border-secondary/40 hover:bg-secondary/5 active:scale-[0.98]"
    >
      <div className="flex size-10 items-center justify-center rounded-full bg-secondary/10 transition-colors duration-200 group-hover:bg-secondary/20">
        <HugeiconsIcon icon={FileAddIcon} size={22} strokeWidth={1.5} className="text-secondary" />
      </div>
      <span className="text-xs font-medium text-muted-foreground">Crear nueva oferta</span>
    </button>
  )
}
