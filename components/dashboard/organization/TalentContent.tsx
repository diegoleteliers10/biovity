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
  SmartPhone01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/base/avatar/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/animate-ui/components/radix/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useProfessionalUsers } from "@/lib/api/use-talent"
import { useResumeByUser, useUser } from "@/lib/api/use-profile"
import { formatUserLocation } from "@/lib/api/users"
import type { ResumeEducation, ResumeExperience } from "@/lib/api/resumes"

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
        className="w-full overflow-y-auto px-8 py-8 sm:max-w-lg"
        aria-describedby={undefined}
      >
        <SheetHeader className="px-0 pt-0">
          <SheetTitle>Perfil del candidato</SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : user ? (
          <div className="mt-8 space-y-8">
            <div className="flex items-center gap-5">
              <Avatar src={user.avatar} alt={user.name} initials={initials} size="xl" />
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-lg">{user.name}</h2>
                {user.profession && (
                  <p className="text-muted-foreground text-sm">{user.profession}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={18}
                  className="mt-0.5 shrink-0 text-muted-foreground"
                />
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <a href={`mailto:${user.email}`} className="text-sm hover:underline">
                    {user.email}
                  </a>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-start gap-4">
                  <HugeiconsIcon
                    icon={SmartPhone01Icon}
                    size={18}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <div>
                    <p className="text-muted-foreground text-xs">Teléfono</p>
                    <p className="text-sm">{user.phone}</p>
                  </div>
                </div>
              )}
              {user.location && (user.location.city || user.location.country) && (
                <div className="flex items-start gap-4">
                  <HugeiconsIcon
                    icon={Location01Icon}
                    size={18}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <div>
                    <p className="text-muted-foreground text-xs">Ubicación</p>
                    <p className="text-sm">{formatUserLocation(user.location)}</p>
                  </div>
                </div>
              )}
            </div>

            {resume?.summary && (
              <div>
                <h3 className="mb-3 flex items-center gap-3 font-medium text-sm">
                  <HugeiconsIcon icon={UserIcon} size={18} />
                  Resumen
                </h3>
                <p className="text-muted-foreground text-pretty text-sm leading-relaxed">
                  {resume.summary}
                </p>
              </div>
            )}

            {resume && resume.experiences.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-3 font-medium text-sm">
                  <HugeiconsIcon icon={Briefcase01Icon} size={18} />
                  Experiencia
                </h3>
                <ul className="space-y-5">
                  {resume.experiences.map((exp, i) => {
                    const d = getExpDisplay(exp)
                    return (
                      <li key={`exp-${i}`} className="relative border-l-2 border-border pl-5">
                        <p className="font-medium text-sm">
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
              <div>
                <h3 className="mb-3 flex items-center gap-3 font-medium text-sm">
                  <HugeiconsIcon icon={GraduationScrollIcon} size={18} />
                  Educación
                </h3>
                <ul className="space-y-5">
                  {resume.education.map((edu, i) => {
                    const d = getEduDisplay(edu)
                    return (
                      <li key={`edu-${i}`} className="relative border-l-2 border-border pl-5">
                        <p className="font-medium text-sm">
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
              <div>
                <h3 className="mb-3 font-medium text-sm">Habilidades</h3>
                <div className="flex flex-wrap gap-3">
                  {(resume.skills ?? []).map((skill, i) => {
                    const name = typeof skill === "string" ? skill : skill.name
                    const level = typeof skill === "string" ? undefined : skill.level
                    return (
                      <span
                        key={`skill-${i}`}
                        className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
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
              <div>
                <h3 className="mb-3 flex items-center gap-3 font-medium text-sm">
                  <HugeiconsIcon icon={Link01Icon} size={18} />
                  Enlaces
                </h3>
                <ul className="space-y-2">
                  {resume.links.map((link, i) => (
                    <li key={`link-${i}`}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm hover:underline"
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

export function TalentContent() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")

  const { data: paginated, isLoading, error } = useProfessionalUsers(page, search)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput.trim())
    setPage(1)
  }

  const handlePrevPage = () => {
    setPage((p) => Math.max(1, p - 1))
  }

  const handleNextPage = () => {
    setPage((p) => Math.min(totalPages, p + 1))
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-balance text-[28px] font-bold tracking-wide">Explorar Talento</h1>
          <p className="text-pretty text-muted-foreground text-sm">
            Busca y revisa perfiles de profesionales en la plataforma.
          </p>
        </div>
        <form onSubmit={handleSearchSubmit} className="flex w-full gap-2 sm:w-72">
          <div className="relative flex-1">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Buscar por nombre o email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
              aria-label="Buscar profesionales"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Buscar
          </Button>
        </form>
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
                    <TableCell className="font-medium">{user.name}</TableCell>
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
                Anterior
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
                Siguiente
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
