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

type PreviewBenefit = { title: string }

type JobPreviewProps = {
  title: string
  description: string
  employmentType?: string
  experienceLevel?: string
  workMode?: string
  city?: string
  region?: string
  country?: string
  salaryMin?: string
  salaryMax?: string
  benefits?: PreviewBenefit[]
  requiredSkills?: string[]
  minExperience?: number
  category?: string
  status?: string
  expiresAt?: string
}

function formatSalaryPreview(min?: string, max?: string): string {
  if (!min && !max) return "Sin especificar"
  if (min && max) return `${formatAmountCLP(Number(min))} - ${formatAmountCLP(Number(max))} CLP/mes`
  if (min) return `Desde ${formatAmountCLP(Number(min))} CLP/mes`
  if (max) return `Hasta ${formatAmountCLP(Number(max))} CLP/mes`
  return "Sin especificar"
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
  region,
  country,
  salaryMin,
  salaryMax,
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
    const parts = [city, region, country].filter(Boolean)
    return parts.length ? parts.join(", ") : "Sin especificar"
  })()

  const salaryStr = formatSalaryPreview(salaryMin, salaryMax)

  return (
    <div className="flex flex-col gap-4 text-sm">
      {/* Header */}
      <div className="rounded-xl border border-border/40 bg-surface-container-lowest p-4 shadow-none">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold leading-snug text-foreground break-words">
              {title || <span className="text-muted-foreground italic">Sin título</span>}
            </h2>
            {category && <p className="mt-0.5 text-xs text-muted-foreground">{category}</p>}
          </div>
          {status && (
            <Badge
              variant="secondary"
              className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${
                status === "active"
                  ? "bg-secondary/10 text-secondary"
                  : "bg-surface-container-highest text-muted-foreground"
              }`}
            >
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
        <div className="rounded-xl border border-border/40 bg-surface-container-lowest p-4 shadow-none">
          <div className="flex items-center gap-2 mb-2">
            <HugeiconsIcon
              icon={UserGroupIcon}
              size={14}
              strokeWidth={1.5}
              className="text-secondary"
            />
            <h3 className="text-sm font-semibold text-foreground">Habilidades requeridas</h3>
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
      <div className="rounded-xl border border-border/40 bg-surface-container-lowest p-4 shadow-none">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Descripción</h3>
        {description ? (
          <HtmlContent html={description} />
        ) : (
          <p className="text-sm text-muted-foreground italic">Sin descripción.</p>
        )}
      </div>

      {/* Benefits */}
      {benefits.length > 0 && (
        <div className="rounded-xl border border-border/40 bg-surface-container-lowest p-4 shadow-none">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Beneficios</h3>
          <div className="flex flex-wrap gap-1.5">
            {benefits.map((b) => (
              <Badge key={b.title} variant="secondary" className="text-xs">
                {b.title}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
