"use client"

import {
  BriefcaseIcon,
  Building03Icon,
  Calendar01Icon,
  Cash02Icon,
  Clock01Icon,
  Location01Icon,
  StarIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { HtmlContent } from "@/components/dashboard/shared/HtmlContent"
import { Badge } from "@/components/ui/badge"
import { formatAmountCLP } from "@/lib/utils"

type PreviewSalary = {
  min?: number
  max?: number
  currency?: string
  period?: string
  isNegotiable?: boolean
}

type PreviewLocation = {
  city?: string
  country?: string
  isRemote?: boolean
  isHybrid?: boolean
}

type PreviewBenefit = { title: string }

type JobPreviewProps = {
  title: string
  description: string
  employmentType?: string
  experienceLevel?: string
  workMode?: string
  city?: string
  country?: string
  salaryMin?: string
  salaryMax?: string
  isNegotiable?: boolean
  benefits?: PreviewBenefit[]
  requiredSkills?: string[]
  minExperience?: number
  category?: string
  status?: string
  expiresAt?: string
}

function formatSalaryPreview(min?: string, max?: string, isNegotiable?: boolean): string {
  if (isNegotiable || (!min && !max)) return "A convenir"
  if (min && max) return `${formatAmountCLP(Number(min))} - ${formatAmountCLP(Number(max))} CLP/mes`
  if (min) return `Desde ${formatAmountCLP(Number(min))} CLP/mes`
  if (max) return `Hasta ${formatAmountCLP(Number(max))} CLP/mes`
  return "A convenir"
}

const EMPLOYMENT_LABELS: Record<string, string> = {
  full_time: "Tiempo completo",
  part_time: "Medio tiempo",
  contract: "Contrato",
  freelance: "Freelance",
  internship: "Prácticas",
  temporary: "Temporal",
}

const EXPERIENCE_LABELS: Record<string, string> = {
  junior: "Junior (0-2 años)",
  mid: "Mid-level (2-5 años)",
  senior: "Senior (5+ años)",
  lead: "Lead",
  manager: "Manager",
}

const WORKMODE_LABELS: Record<string, string> = {
  remote: "Remoto",
  hybrid: "Híbrido",
  onsite: "Presencial",
}

export function JobPreview({
  title,
  description,
  employmentType,
  experienceLevel,
  workMode,
  city,
  country,
  salaryMin,
  salaryMax,
  isNegotiable,
  benefits = [],
  requiredSkills = [],
  minExperience,
  category,
  status,
  expiresAt,
}: JobPreviewProps) {
  const locationStr = (() => {
    if (workMode === "remote") return "Remoto"
    if (workMode === "hybrid") return "Híbrido"
    const parts = [city, country].filter(Boolean)
    return parts.length ? parts.join(", ") : "Sin especificar"
  })()

  const salaryStr = formatSalaryPreview(salaryMin, salaryMax, isNegotiable)

  return (
    <div className="flex flex-col gap-4 text-sm">
      {/* Header */}
      <div className="rounded-xl border border-border bg-card/80 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold leading-snug text-foreground break-words">
              {title || <span className="text-muted-foreground italic">Sin título</span>}
            </h2>
            {category && <p className="mt-0.5 text-xs text-muted-foreground">{category}</p>}
          </div>
          {status && (
            <Badge variant="secondary" className="shrink-0 text-[10px] uppercase tracking-wider">
              {status === "active" ? "Activa" : status === "draft" ? "Borrador" : status}
            </Badge>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          {locationStr && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <HugeiconsIcon icon={Location01Icon} size={14} strokeWidth={1.5} />
              <span>{locationStr}</span>
            </div>
          )}
          {employmentType && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <HugeiconsIcon icon={BriefcaseIcon} size={14} strokeWidth={1.5} />
              <span>{EMPLOYMENT_LABELS[employmentType] ?? employmentType}</span>
            </div>
          )}
          {workMode && workMode !== "onsite" && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <HugeiconsIcon icon={Building03Icon} size={14} strokeWidth={1.5} />
              <span>{WORKMODE_LABELS[workMode] ?? workMode}</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 text-foreground font-medium">
            <HugeiconsIcon
              icon={Cash02Icon}
              size={14}
              strokeWidth={1.5}
              className="text-secondary"
            />
            <span>{salaryStr}</span>
          </div>
          {experienceLevel && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <HugeiconsIcon icon={StarIcon} size={14} strokeWidth={1.5} />
              <span>{EXPERIENCE_LABELS[experienceLevel] ?? experienceLevel}</span>
            </div>
          )}
          {minExperience ? (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <HugeiconsIcon icon={Clock01Icon} size={14} strokeWidth={1.5} />
              <span>
                Mín. {minExperience} año{minExperience !== 1 ? "s" : ""} de experiencia
              </span>
            </div>
          ) : null}
          {expiresAt && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <HugeiconsIcon icon={Calendar01Icon} size={14} strokeWidth={1.5} />
              <span>Cierra: {expiresAt}</span>
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      {requiredSkills.length > 0 && (
        <div className="rounded-xl border border-border bg-card/80 p-4">
          <div className="flex items-center gap-2 mb-2">
            <HugeiconsIcon
              icon={UserGroupIcon}
              size={14}
              strokeWidth={1.5}
              className="text-secondary"
            />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Habilidades requeridas
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {requiredSkills.map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="rounded-xl border border-border bg-card/80 p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Descripción
        </h3>
        {description ? (
          <HtmlContent html={description} />
        ) : (
          <p className="text-sm text-muted-foreground italic">Sin descripción.</p>
        )}
      </div>

      {/* Benefits */}
      {benefits.length > 0 && (
        <div className="rounded-xl border border-border bg-card/80 p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Beneficios
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {benefits.map((b, i) => (
              <Badge key={b.title + i} variant="secondary" className="text-xs">
                {b.title}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
