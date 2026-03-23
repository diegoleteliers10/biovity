"use client"

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Briefcase01Icon,
  GraduationScrollIcon,
  Link01Icon,
  Location01Icon,
  Mail01Icon,
  Search01Icon,
  Sent02Icon,
  SmartPhone01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRouter } from "next/navigation"
import { useQueryStates } from "nuqs"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/animate-ui/components/radix/sheet"
import { Avatar } from "@/components/base/avatar/avatar"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ResumeEducation, ResumeExperience } from "@/lib/api/resumes"
import { useCreateOrFindChatMutation } from "@/lib/api/use-chats"
import { useResumeByUser, useUser } from "@/lib/api/use-profile"
import { useProfessionalUsers } from "@/lib/api/use-talent"
import { formatUserLocation } from "@/lib/api/users"
import { authClient } from "@/lib/auth-client"
import { talentParsers } from "@/lib/parsers/talent"

const EMPTY_PLACEHOLDER = "No especificado"

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

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

function TalentDetailSheet({
  userId,
  open,
  onOpenChange,
}: {
  userId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
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
                  {resume.experiences.map((exp, i) => {
                    const d = getExpDisplay(exp)
                    return (
                      <li key={`exp-${i}`} className="relative border-l-2 border-border/60 pl-4">
                        <p className="font-medium text-foreground text-sm">
                          {d.title || d.company || EMPTY_PLACEHOLDER}
                        </p>
                        {d.company && d.title && (
                          <p className="mt-0.5 text-muted-foreground text-sm">{d.company}</p>
                        )}
                        <p className="mt-0.5 tabular-nums text-muted-foreground text-xs">
                          {d.start} — {d.current ? "Actualidad" : d.end || ""}
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
                  {resume.education.map((edu, i) => {
                    const d = getEduDisplay(edu)
                    return (
                      <li key={`edu-${i}`} className="relative border-l-2 border-border/60 pl-4">
                        <p className="font-medium text-foreground text-sm">
                          {d.title || d.institute || EMPTY_PLACEHOLDER}
                        </p>
                        {d.institute && d.title && (
                          <p className="mt-0.5 text-muted-foreground text-sm">{d.institute}</p>
                        )}
                        <p className="mt-0.5 tabular-nums text-muted-foreground text-xs">
                          {d.start} — {d.current ? "Actualidad" : d.end || ""}
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
                  {(resume.skills ?? []).map((skill, i) => {
                    const name = typeof skill === "string" ? skill : skill.name
                    const level = typeof skill === "string" ? undefined : skill.level
                    return (
                      <span
                        key={`skill-${i}`}
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
                  {resume.links.map((link, i) => (
                    <li key={`link-${i}`}>
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

const SEARCH_DEBOUNCE_MS = 400

export function TalentContent() {
  const [urlState, setUrlState] = useQueryStates(talentParsers, {
    history: "push",
    shallow: false,
  })
  const { page, search } = urlState

  const [inputSearch, setInputSearch] = useState(search)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setInputSearch(search)
  }, [search])

  const fetchSearch = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        setUrlState({ search: value, page: 1 })
        debounceRef.current = null
      }, SEARCH_DEBOUNCE_MS)
    },
    [setUrlState]
  )

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleSearchChange = useCallback(
    (value: string) => {
      setInputSearch(value)
      fetchSearch(value)
    },
    [fetchSearch]
  )

  const { useSession } = authClient
  const { data: session } = useSession()
  const recruiterId = (session?.user as { id?: string })?.id
  const createChatMutation = useCreateOrFindChatMutation(recruiterId)
  const router = useRouter()

  const { data: paginated, isLoading, error } = useProfessionalUsers(page, search)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleSendMessage = useCallback(
    (professionalId: string) => (e: React.MouseEvent) => {
      e.stopPropagation()
      createChatMutation.mutate(professionalId, {
        onSuccess: (chat) => {
          router.push(`/dashboard/messages?chat=${chat.id}`)
        },
      })
    },
    [createChatMutation, router]
  )

  const users = paginated?.data ?? []
  const total = paginated?.total ?? 0
  const totalPages = paginated?.totalPages ?? 1
  const currentPage = paginated?.page ?? 1
  const limit = paginated?.limit ?? 20

  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const endItem = Math.min(currentPage * limit, total)

  const handleRowClick = (userId: string) => {
    setSelectedUserId(userId)
    setSheetOpen(true)
  }

  const handlePrevPage = useCallback(() => {
    setUrlState({ page: Math.max(1, page - 1) })
  }, [page, setUrlState])

  const handleNextPage = useCallback(() => {
    setUrlState({ page: Math.min(totalPages, page + 1) })
  }, [page, totalPages, setUrlState])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-balance text-[28px] font-bold tracking-wide">Explorar Talento</h1>
          <p className="text-pretty text-muted-foreground text-sm">
            Busca y revisa perfiles de profesionales en la plataforma.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <HugeiconsIcon
            icon={Search01Icon}
            size={18}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Buscar por nombre o email..."
            value={inputSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
            aria-label="Buscar profesionales"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-destructive text-sm">{error.message}</p>
        </div>
      ) : !users.length ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-12 text-center">
          <p className="text-muted-foreground text-sm">
            {search
              ? "No se encontraron profesionales con ese criterio."
              : "No hay profesionales registrados en la plataforma."}
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Nombre</TableHead>
                  <TableHead>Profesión</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer"
                    onClick={() => handleRowClick(user.id)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        handleRowClick(user.id)
                      }
                    }}
                    role="button"
                    aria-label={`Ver perfil de ${user.name}`}
                  >
                    <TableCell className="font-medium">
                      <HoverCard openDelay={100} closeDelay={200}>
                        <HoverCardTrigger asChild>
                          <span
                            className="inline-block cursor-pointer font-medium text-foreground transition-colors hover:text-primary hover:underline"
                            tabIndex={0}
                          >
                            {user.name}
                          </span>
                        </HoverCardTrigger>
                        <HoverCardContent
                          side="bottom"
                          align="start"
                          sideOffset={10}
                          className="w-80 overflow-hidden rounded-xl border-0 bg-background p-0 shadow-xl ring-1 ring-border/50"
                        >
                          <div className="bg-muted/30 px-4 py-4">
                            <div className="flex items-center gap-4">
                              <Avatar
                                src={user.avatar}
                                alt={user.name}
                                initials={getInitials(user.name)}
                                size="xl"
                                className="ring-2 ring-background"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold text-foreground">
                                  {user.name}
                                </p>
                                {user.profession && (
                                  <p className="mt-0.5 truncate text-muted-foreground text-sm">
                                    {user.profession}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-px px-4 py-3">
                            <a
                              href={`mailto:${user.email}`}
                              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                                <HugeiconsIcon
                                  icon={Mail01Icon}
                                  size={16}
                                  className="text-primary"
                                />
                              </div>
                              <span className="min-w-0 truncate">{user.email}</span>
                            </a>
                            {user.phone && (
                              <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground text-sm">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                                  <HugeiconsIcon
                                    icon={SmartPhone01Icon}
                                    size={16}
                                    className="text-primary"
                                  />
                                </div>
                                <span>{user.phone}</span>
                              </div>
                            )}
                            {formatUserLocation(user.location) && (
                              <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground text-sm">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                                  <HugeiconsIcon
                                    icon={Location01Icon}
                                    size={16}
                                    className="text-primary"
                                  />
                                </div>
                                <span>{formatUserLocation(user.location)}</span>
                              </div>
                            )}
                          </div>
                          <div className="border-t border-border/50 px-4 py-3">
                            <Button
                              size="sm"
                              className="w-full gap-2"
                              onClick={handleSendMessage(user.id)}
                              disabled={!recruiterId || createChatMutation.isPending}
                              aria-label={`Enviar mensaje a ${user.name}`}
                            >
                              <HugeiconsIcon icon={Sent02Icon} size={16} />
                              {createChatMutation.isPending &&
                              createChatMutation.variables === user.id
                                ? "Creando..."
                                : "Enviar mensaje"}
                            </Button>
                            <p className="mt-2 text-center text-muted-foreground text-xs">
                              Haz clic en la fila para ver el perfil completo
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.profession ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatUserLocation(user.location) || "—"}
                    </TableCell>
                    <TableCell className="hidden truncate text-muted-foreground md:table-cell">
                      {user.email}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="tabular-nums text-muted-foreground text-sm">
              Mostrando {startItem}–{endItem} de {total}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                aria-label="Página anterior"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
              </Button>
              <span className="tabular-nums text-muted-foreground text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                aria-label="Página siguiente"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
              </Button>
            </div>
          </div>
        </>
      )}

      <TalentDetailSheet userId={selectedUserId} open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  )
}
