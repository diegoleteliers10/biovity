"use client"

import {
  Atom01Icon,
  Briefcase01Icon,
  Calendar01Icon,
  CheckmarkCircle02Icon,
  Download04Icon,
  File02Icon,
  GraduationScrollIcon,
  Link01Icon,
  Location01Icon,
  Mail01Icon,
  Pdf01Icon,
  Sent02Icon,
  SmartPhone01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/animate-ui/components/radix/sheet"
import { Avatar } from "@/components/base/avatar/avatar"
import { Button } from "@/components/ui/button"
import type { ResumeEducation, ResumeExperience } from "@/lib/api/resumes"
import { useCreateOrFindChatMutation } from "@/lib/api/use-chats"
import { useResumeByUser, useUser } from "@/lib/api/use-profile"
import { useIncrementProfileViews } from "@/lib/api/use-user-metrics"
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
  recruiterId?: string | null
}

export function TalentDetailSheet({
  userId,
  open,
  onOpenChange,
  recruiterId,
}: TalentDetailSheetProps) {
  const { push } = useRouter()
  const { data: user, isLoading: userLoading } = useUser(userId ?? undefined)
  const { data: resume, isLoading: resumeLoading } = useResumeByUser(userId ?? undefined)
  const createChatMutation = useCreateOrFindChatMutation(recruiterId ?? undefined)
  const incrementProfileViews = useIncrementProfileViews()

  useEffect(() => {
    if (open && userId) {
      incrementProfileViews.mutate(userId)
    }
  }, [open, userId, incrementProfileViews])

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
        className="flex flex-col h-full w-full p-0 sm:max-w-xl bg-background border-l border-border"
        aria-describedby={undefined}
      >
        {/* Stationary Header */}
        <div className="px-6 py-5 border-b border-border">
          <SheetTitle className="text-base font-semibold text-foreground">
            Perfil del candidato
          </SheetTitle>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-7 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : user ? (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  initials={initials}
                  size="xl"
                  className="size-20 border-2 border-background shadow-md bg-gradient-to-tr from-secondary to-primary text-white font-bold"
                />
                <h2 className="mt-4 font-bold text-xl tracking-tight text-foreground flex items-center gap-1.5 justify-center">
                  {user.name}
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} className="text-blue-500 shrink-0" />
                </h2>
                {user.profession && (
                  <p className="text-secondary text-xs font-semibold mt-1.5 bg-secondary/5 px-3 py-1 rounded-full border border-secondary/10">
                    {user.profession}
                  </p>
                )}
                
                {/* Compact Contact details */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <HugeiconsIcon icon={Mail01Icon} size={14} className="text-secondary shrink-0" />
                    <a href={`mailto:${user.email}`} className="hover:text-foreground hover:underline transition-colors">
                      {user.email}
                    </a>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-1">
                      <HugeiconsIcon icon={SmartPhone01Icon} size={14} className="text-secondary shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.location && (user.location.city || user.location.country) && (
                    <div className="flex items-center gap-1">
                      <HugeiconsIcon icon={Location01Icon} size={14} className="text-secondary shrink-0" />
                      <span>{formatUserLocation(user.location)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              {resume?.summary && (
                <div className="space-y-2.5">
                  <h3 className="flex items-center gap-2 font-bold text-xs text-slate-400 uppercase tracking-wider">
                    <HugeiconsIcon icon={UserIcon} size={14} className="text-secondary" />
                    Resumen Profesional
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                    {resume.summary}
                  </p>
                </div>
              )}

              {/* CV File Attachment */}
              {resume?.cvFile && resume.cvFile.url && (
                <>
                  <div className="h-px bg-slate-100" />
                  <div className="space-y-2.5">
                    <h3 className="flex items-center gap-2 font-bold text-xs text-slate-400 uppercase tracking-wider">
                      <HugeiconsIcon icon={File02Icon} size={14} className="text-secondary" />
                      Currículum Adjunto
                    </h3>
                    <a
                      href={resume.cvFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-100/50 rounded-xl border border-slate-150 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-red-50 text-red-500 shrink-0">
                          <HugeiconsIcon icon={Pdf01Icon} size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {resume.cvFile.originalName || "curriculum.pdf"}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {resume.cvFile.size
                              ? `${(resume.cvFile.size / 1024 / 1024).toFixed(2)} MB`
                              : "Documento PDF"}
                          </p>
                        </div>
                      </div>
                      <HugeiconsIcon icon={Download04Icon} size={16} className="text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                    </a>
                  </div>
                </>
              )}

              {/* Experience */}
              {resume && resume.experiences.length > 0 && (
                <>
                  <div className="h-px bg-slate-100" />
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-bold text-xs text-slate-400 uppercase tracking-wider">
                      <HugeiconsIcon icon={Briefcase01Icon} size={14} className="text-secondary" />
                      Experiencia Laboral
                    </h3>
                    <ul className="relative border-l border-slate-100 pl-2.5 space-y-6">
                      {resume.experiences.map((exp) => {
                        const d = getExpDisplay(exp)
                        const key = [d.title, d.company, d.start, d.current].filter(Boolean).join("||")
                        return (
                          <li key={`exp-${key}`} className="relative pl-6 pb-2 last:pb-0">
                            {/* Timeline dot */}
                            <div className="absolute left-[-5px] top-1.5 size-2.5 rounded-full border border-background bg-secondary shadow-sm" />
                            <h4 className="font-semibold text-foreground text-sm leading-snug">
                              {d.title || d.company || EMPTY_PLACEHOLDER}
                            </h4>
                            {d.company && d.title && (
                              <p className="text-xs font-semibold text-muted-foreground mt-0.5">{d.company}</p>
                            )}
                            <p className="text-[10px] font-semibold text-secondary mt-1.5 tabular-nums bg-secondary/5 px-2 py-0.5 rounded w-fit border border-secondary/10">
                              {d.start} – {d.current ? "Actualidad" : d.end || ""}
                            </p>
                            {exp.description && (
                              <p className="mt-2 text-muted-foreground text-xs leading-relaxed text-pretty">
                                {exp.description}
                              </p>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </>
              )}

              {/* Education */}
              {resume && resume.education.length > 0 && (
                <>
                  <div className="h-px bg-slate-100" />
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-bold text-xs text-slate-400 uppercase tracking-wider">
                      <HugeiconsIcon icon={GraduationScrollIcon} size={14} className="text-secondary" />
                      Educación
                    </h3>
                    <ul className="relative border-l border-slate-100 pl-2.5 space-y-6">
                      {resume.education.map((edu) => {
                        const d = getEduDisplay(edu)
                        const key = [d.title, d.institute, d.start, d.current]
                          .filter(Boolean)
                          .join("||")
                        return (
                          <li key={`edu-${key}`} className="relative pl-6 pb-2 last:pb-0">
                            {/* Timeline dot */}
                            <div className="absolute left-[-5px] top-1.5 size-2.5 rounded-full border border-background bg-secondary shadow-sm" />
                            <h4 className="font-semibold text-foreground text-sm leading-snug">
                              {d.title || d.institute || EMPTY_PLACEHOLDER}
                            </h4>
                            {d.institute && d.title && (
                              <p className="text-xs font-semibold text-muted-foreground mt-0.5">{d.institute}</p>
                            )}
                            <p className="text-[10px] font-semibold text-secondary mt-1.5 tabular-nums bg-secondary/5 px-2 py-0.5 rounded w-fit border border-secondary/10">
                              {d.start} – {d.current ? "Actualidad" : d.end || ""}
                            </p>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </>
              )}

              {/* Skills */}
              {resume && (resume.skills?.length ?? 0) > 0 && (
                <>
                  <div className="h-px bg-slate-100" />
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 font-bold text-xs text-slate-400 uppercase tracking-wider">
                      <HugeiconsIcon icon={Atom01Icon} size={14} className="text-secondary" />
                      Habilidades
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(resume.skills ?? []).map((skill) => {
                        const name = typeof skill === "string" ? skill : skill.name
                        const level = typeof skill === "string" ? undefined : skill.level
                        return (
                          <span
                            key={`skill-${name}`}
                            className="rounded-lg border border-secondary/15 bg-secondary/5 px-3 py-1 text-xs font-medium text-secondary hover:bg-secondary/10 transition-colors"
                          >
                            {name}
                            {level && <span className="ml-1 text-muted-foreground/80 font-normal">({level})</span>}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Links */}
              {resume && resume.links.length > 0 && (
                <>
                  <div className="h-px bg-slate-100" />
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 font-bold text-xs text-slate-400 uppercase tracking-wider">
                      <HugeiconsIcon icon={Link01Icon} size={14} className="text-secondary" />
                      Enlaces de interés
                    </h3>
                    <ul className="space-y-2.5">
                      {resume.links.map((link) => (
                        <li key={`link-${link.url}`} className="flex items-center gap-2 text-sm">
                          <HugeiconsIcon icon={Link01Icon} size={14} className="text-muted-foreground shrink-0" />
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary truncate hover:underline"
                          >
                            {link.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="py-8 text-muted-foreground text-sm text-center">No se pudo cargar el perfil.</p>
          )}
        </div>

        {/* Stationary Action Footer */}
        {user && (
          <div className="p-4 border-t border-border bg-slate-50/70">
            <div className="flex gap-3">
              <Button
                className="flex-1 gap-2 text-sm"
                onClick={() => {
                  if (!recruiterId || !userId) return
                  createChatMutation.mutate(userId, {
                    onSuccess: (chat) => {
                      if (chat?.id) {
                        onOpenChange(false)
                        push(`/dashboard/messages?chat=${chat.id}`)
                      }
                    },
                  })
                }}
                disabled={!recruiterId || createChatMutation.isPending}
                id={`sheet-message-${userId}`}
              >
                {createChatMutation.isPending ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <HugeiconsIcon icon={Sent02Icon} size={16} />
                )}
                Enviar mensaje
              </Button>
              <Button
                variant="outline"
                className="gap-2 text-sm"
                onClick={() => {
                  push(`/dashboard/calendar?candidateId=${userId}`)
                }}
                id={`sheet-schedule-${userId}`}
              >
                <HugeiconsIcon icon={Calendar01Icon} size={16} />
                Agendar
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
