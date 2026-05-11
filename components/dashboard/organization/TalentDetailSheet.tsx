"use client"

import {
  Briefcase01Icon,
  GraduationScrollIcon,
  Link01Icon,
  Location01Icon,
  Mail01Icon,
  SmartPhone01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMemo } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/animate-ui/components/radix/sheet"
import { Avatar } from "@/components/base/avatar/avatar"
import type { ResumeEducation, ResumeExperience } from "@/lib/api/resumes"
import { useResumeByUser, useUser } from "@/lib/api/use-profile"
import { formatUserLocation } from "@/lib/api/users"

const EMPTY_PLACEHOLDER = "No especificado"

const getExpDisplay = (exp: ResumeExperience) => ({
  title: exp.title ?? exp.position ?? "",
  company: exp.company ?? "",
  start: exp.startYear ?? exp.startDate?.slice(0, 4) ?? "",
  end: exp.endYear ?? exp.endDate?.slice(0, 4) ?? "",
  current: exp.stillWorking ?? exp.current ?? false,
})

const getEduDisplay = (edu: ResumeEducation) => ({
  title: edu.title ?? edu.degree ?? "",
  institute: edu.institute ?? edu.institution ?? "",
  start: edu.startYear ?? edu.startDate?.slice(0, 4) ?? "",
  end: edu.endYear ?? edu.endDate?.slice(0, 4) ?? "",
  current: edu.stillStudying ?? false,
})

interface TalentDetailSheetProps {
  userId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TalentDetailSheet({ userId, open, onOpenChange }: TalentDetailSheetProps) {
  const { data: user, isLoading: userLoading } = useUser(userId ?? undefined)
  const { data: resume, isLoading: resumeLoading } = useResumeByUser(userId ?? undefined)

  const initials = useMemo(() => {
    if (!user?.name) return undefined
    const parts = user.name.trim().split(/\s+/)
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return user.name.slice(0, 2).toUpperCase()
  }, [user?.name])

  const isLoading = userLoading || resumeLoading

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto px-6 py-6 sm:max-w-xl md:px-7"
        aria-describedby={undefined}
      >
        <SheetHeader className="px-0 pt-0">
          <SheetTitle className="text-lg font-semibold tracking-tight text-foreground">
            Perfil del candidato
          </SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : user ? (
          <div className="mt-7 space-y-6">
            <div className="rounded-2xl border border-[#1d4e63]/70 bg-[#1d4e63] p-5">
              <div className="flex items-center gap-4">
                <Avatar src={user.avatar} alt={user.name} initials={initials} size="xl" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
                    Candidato
                  </p>
                  <h2 className="font-semibold text-lg tracking-tight text-white">{user.name}</h2>
                  {user.profession && <p className="text-white/85 text-sm">{user.profession}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-border/35 bg-background p-4">
              <div className="flex items-start gap-3 rounded-lg border border-border/30 bg-muted/20 px-3 py-2.5">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={18}
                  className="mt-0.5 shrink-0 text-secondary"
                />
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <a
                    href={`mailto:${user.email}`}
                    className="text-sm text-foreground hover:underline"
                  >
                    {user.email}
                  </a>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-start gap-3 rounded-lg border border-border/30 bg-muted/20 px-3 py-2.5">
                  <HugeiconsIcon
                    icon={SmartPhone01Icon}
                    size={18}
                    className="mt-0.5 shrink-0 text-secondary"
                  />
                  <div>
                    <p className="text-muted-foreground text-xs">Telefono</p>
                    <p className="text-sm text-foreground">{user.phone}</p>
                  </div>
                </div>
              )}
              {user.location && (user.location.city || user.location.country) && (
                <div className="flex items-start gap-3 rounded-lg border border-border/30 bg-muted/20 px-3 py-2.5">
                  <HugeiconsIcon
                    icon={Location01Icon}
                    size={18}
                    className="mt-0.5 shrink-0 text-secondary"
                  />
                  <div>
                    <p className="text-muted-foreground text-xs">Ubicacion</p>
                    <p className="text-sm text-foreground">{formatUserLocation(user.location)}</p>
                  </div>
                </div>
              )}
            </div>

            {resume?.summary && (
              <div className="space-y-3 rounded-2xl border border-border/35 bg-background p-4">
                <h3 className="flex items-center gap-2.5 font-medium text-sm text-foreground">
                  <HugeiconsIcon icon={UserIcon} size={18} className="text-secondary" />
                  Resumen
                </h3>
                <p className="text-muted-foreground text-pretty text-sm leading-relaxed">
                  {resume.summary}
                </p>
              </div>
            )}

            {resume && resume.experiences.length > 0 && (
              <div className="space-y-3 rounded-2xl border border-border/35 bg-background p-4">
                <h3 className="flex items-center gap-2.5 font-medium text-sm text-foreground">
                  <HugeiconsIcon icon={Briefcase01Icon} size={18} className="text-secondary" />
                  Experiencia
                </h3>
                <ul className="space-y-5">
                  {resume.experiences.map((exp) => {
                    const d = getExpDisplay(exp)
                    const key = [d.title, d.company, d.start, d.current].filter(Boolean).join("||")
                    return (
                      <li key={`exp-${key}`} className="relative border-l-2 border-border/60 pl-4">
                        <p className="font-medium text-foreground text-sm">
                          {d.title || d.company || EMPTY_PLACEHOLDER}
                        </p>
                        {d.company && d.title && (
                          <p className="mt-0.5 text-muted-foreground text-sm">{d.company}</p>
                        )}
                        <p className="mt-0.5 tabular-nums text-muted-foreground text-xs">
                          {d.start} – {d.current ? "Actualidad" : d.end || ""}
                        </p>
                        {exp.description && (
                          <p className="mt-2 text-muted-foreground text-pretty text-sm leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {resume && resume.education.length > 0 && (
              <div className="space-y-3 rounded-2xl border border-border/35 bg-background p-4">
                <h3 className="flex items-center gap-2.5 font-medium text-sm text-foreground">
                  <HugeiconsIcon icon={GraduationScrollIcon} size={18} className="text-secondary" />
                  Educacion
                </h3>
                <ul className="space-y-5">
                  {resume.education.map((edu) => {
                    const d = getEduDisplay(edu)
                    const key = [d.title, d.institute, d.start, d.current]
                      .filter(Boolean)
                      .join("||")
                    return (
                      <li key={`edu-${key}`} className="relative border-l-2 border-border/60 pl-4">
                        <p className="font-medium text-foreground text-sm">
                          {d.title || d.institute || EMPTY_PLACEHOLDER}
                        </p>
                        {d.institute && d.title && (
                          <p className="mt-0.5 text-muted-foreground text-sm">{d.institute}</p>
                        )}
                        <p className="mt-0.5 tabular-nums text-muted-foreground text-xs">
                          {d.start} – {d.current ? "Actualidad" : d.end || ""}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {resume && (resume.skills?.length ?? 0) > 0 && (
              <div className="space-y-3 rounded-2xl border border-border/35 bg-background p-4">
                <h3 className="font-medium text-sm text-foreground">Habilidades</h3>
                <div className="flex flex-wrap gap-2.5">
                  {(resume.skills ?? []).map((skill) => {
                    const name = typeof skill === "string" ? skill : skill.name
                    const level = typeof skill === "string" ? undefined : skill.level
                    return (
                      <span
                        key={`skill-${name}`}
                        className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {name}
                        {level && <span className="ml-1 text-muted-foreground">({level})</span>}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {resume && resume.links.length > 0 && (
              <div className="space-y-3 rounded-2xl border border-border/35 bg-background p-4">
                <h3 className="flex items-center gap-2.5 font-medium text-sm text-foreground">
                  <HugeiconsIcon icon={Link01Icon} size={18} className="text-secondary" />
                  Enlaces
                </h3>
                <ul className="space-y-2">
                  {resume.links.map((link) => (
                    <li key={`link-${link.url}`}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary break-all text-sm hover:underline"
                      >
                        {link.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="py-8 text-muted-foreground text-sm">No se pudo cargar el perfil.</p>
        )}
      </SheetContent>
    </Sheet>
  )
}
