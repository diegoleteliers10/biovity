"use client"

import {
  BirthdayCakeIcon,
  Building06Icon,
  Delete01Icon,
  FileAttachmentIcon,
  Location01Icon,
  Mail01Icon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { DatePicker } from "@/components/common/DatePicker"
import { Input } from "@/components/ui/input"
import { PhoneInput } from "@/components/ui/phone-input"
import { useUploadResumeCvMutation } from "@/lib/api/use-profile"
import { cn, dateToDateString, parseLocalDate } from "@/lib/utils"
import { EMPTY_PLACEHOLDER, useProfileContext } from "./profile-context"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

const LEVEL_DOTS: Record<string, number> = {
  advanced: 3,
  intermediate: 2,
  entry: 1,
}

const SECTION_LABEL_CLASS = "text-xs leading-4 font-medium text-foreground"

export function ProfileAside() {
  return (
    <div className="space-y-4">
      <SkillsCard />
      <ContactCard />
      <CvCard />
    </div>
  )
}

const AsideCard = ({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) => (
  <section
    className={cn(
      "rounded-xl border border-border/40 bg-surface-container-low p-4 sm:p-5 shadow-none",
      className
    )}
  >
    <h2 className={SECTION_LABEL_CLASS}>{title}</h2>
    <div className="mt-3.5">{children}</div>
  </section>
)

function LevelDots({ level }: { level?: string }) {
  const filled = LEVEL_DOTS[level ?? ""] ?? 0
  return (
    <span className="flex items-center gap-1" title={level ?? ""}>
      {[0, 1, 2].map((dot) => (
        <span
          key={`dot-${dot}`}
          className={cn(
            "size-1.5 rounded-full",
            dot < filled ? "bg-secondary" : "bg-neutral-300 dark:bg-neutral-600"
          )}
        />
      ))}
    </span>
  )
}

export function SkillsCard() {
  const { resume } = useProfileContext()
  const skills = resume?.skills ?? []

  return (
    <AsideCard title="Habilidades">
      {skills.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {skills.map((skill) => {
            const name = typeof skill === "string" ? skill : skill.name
            const level = typeof skill === "string" ? undefined : skill.level
            return (
              <li
                key={`skill-${name}`}
                className="flex items-center gap-1.5 rounded-full bg-surface-container-highest px-3 py-1 text-xs font-medium text-foreground"
              >
                <span className="max-w-[200px] truncate">{name}</span>
                {level && <LevelDots level={level} />}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground">No has agregado habilidades.</p>
      )}
    </AsideCard>
  )
}

const ContactRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail01Icon
  label: string
  value: React.ReactNode
}) => (
  <div className="flex items-center gap-3">
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/40 bg-surface-container-lowest text-secondary">
      <HugeiconsIcon icon={Icon} size={16} strokeWidth={1.5} aria-hidden />
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
    </div>
  </div>
)

export function ContactCard() {
  const { user, profileData, formData, errors, isEditing, handleInputChange } = useProfileContext()

  const data = profileData

  return (
    <AsideCard title="Contacto">
      <div className="space-y-3.5">
        <ContactRow
          icon={Mail01Icon}
          label="Correo"
          value={<span className="truncate block">{data.email || EMPTY_PLACEHOLDER}</span>}
        />
        <ContactRow
          icon={SmartPhone01Icon}
          label="Teléfono"
          value={
            isEditing ? (
              <PhoneInput
                value={formData.phone}
                onChange={(value) => handleInputChange("phone", value)}
                placeholder="+56 9 1234 5678"
                className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm"
              />
            ) : (
              <span className="block truncate">{data.phone || EMPTY_PLACEHOLDER}</span>
            )
          }
        />
        <ContactRow
          icon={Location01Icon}
          label="Ubicación"
          value={
            isEditing ? (
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Ciudad, País"
                className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm"
              />
            ) : (
              <span className="block truncate">{data.location || EMPTY_PLACEHOLDER}</span>
            )
          }
        />
        <ContactRow
          icon={BirthdayCakeIcon}
          label="Cumpleaños"
          value={
            isEditing ? (
              <DatePicker
                date={formData.dateOfBirth ? parseLocalDate(formData.dateOfBirth) : undefined}
                setDate={(d) => handleInputChange("dateOfBirth", d ? dateToDateString(d) : "")}
                className="h-9 rounded-lg border-border/40 bg-surface-container-lowest text-xs sm:text-sm"
              />
            ) : data.dateOfBirth ? (
              <span className="block truncate">
                {format(parseLocalDate(data.dateOfBirth), "d MMMM yyyy", { locale: es })}
              </span>
            ) : (
              EMPTY_PLACEHOLDER
            )
          }
        />
        {user?.organization && (
          <ContactRow
            icon={Building06Icon}
            label="Organización"
            value={<span className="block truncate">{user.organization.name}</span>}
          />
        )}
        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
        {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth}</p>}
      </div>
    </AsideCard>
  )
}

export function CvCard() {
  const { userId, resume, isEditing, handleCvUpload, handleCvDelete } = useProfileContext()
  const uploadCvMutation = useUploadResumeCvMutation(resume?.id ?? "", userId ?? "")

  return (
    <AsideCard title="Currículum">
      <div className="flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/40 bg-surface-container-lowest text-secondary">
          <HugeiconsIcon icon={FileAttachmentIcon} size={16} strokeWidth={1.5} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">CV</p>
          <div className="mt-0.5 min-w-0">
            {isEditing ? (
              resume?.cvFile ? (
                <div className="flex items-center gap-2">
                  <a
                    href={resume.cvFile.url ?? `${API_BASE}/api/v1/resumes/${resume.id}/cv`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-sm font-medium text-primary hover:underline"
                  >
                    {resume.cvFile.originalName ?? "Descargar"}
                  </a>
                  <button
                    type="button"
                    onClick={handleCvDelete}
                    className="shrink-0 rounded p-1 text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive/80"
                    aria-label="Eliminar CV"
                  >
                    <HugeiconsIcon icon={Delete01Icon} size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <label className="cursor-pointer text-sm font-medium text-primary hover:underline">
                    Subir CV
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleCvUpload}
                      className="sr-only"
                      aria-label="Subir archivo CV"
                    />
                  </label>
                  {uploadCvMutation.isPending && (
                    <span className="ml-2 text-xs text-muted-foreground">Subiendo…</span>
                  )}
                  {uploadCvMutation.isError && (
                    <p className="mt-1 text-xs text-destructive">
                      {uploadCvMutation.error?.message ?? "Error al subir"}
                    </p>
                  )}
                </>
              )
            ) : resume?.cvFile ? (
              <a
                href={resume.cvFile.url ?? `${API_BASE}/api/v1/resumes/${resume.id}/cv`}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-sm font-medium text-primary hover:underline"
              >
                {resume.cvFile.originalName ?? "Descargar"}
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">No subido</span>
            )}
          </div>
        </div>
      </div>
    </AsideCard>
  )
}
