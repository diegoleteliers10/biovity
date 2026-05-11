"use client"

import {
  ArrowLeft01Icon,
  FileAttachmentIcon,
  Mail01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useQuery } from "@tanstack/react-query"
import { Result } from "better-result"
import { useParams, useRouter } from "next/navigation"
import { addTransitionType, startTransition } from "react"
import { DirectionalTransition } from "@/components/dashboard/shared/DirectionalTransition"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getApplicationDetail } from "@/lib/api/applications"
import { getQuestionsByJob } from "@/lib/api/job-questions"
import { formatUserLocation, useResumeByUser, useUser } from "@/lib/api/use-profile"
import { getResultErrorMessage } from "@/lib/result"
import { formatAmountCLP, formatDateChilean } from "@/lib/utils"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

function buildInternalCvUrl(path: string | undefined): string | null {
  if (!path) return null
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path
  return `/api/cv/signed-url?path=${encodeURIComponent(normalizedPath)}`
}

function extractCvPath(rawUrl: string | null | undefined): string | undefined {
  if (!rawUrl?.trim()) return undefined
  const trimmed = rawUrl.trim()

  if (trimmed.startsWith("cv/")) return trimmed

  const parse = (urlValue: string) => {
    if (urlValue.startsWith("http://") || urlValue.startsWith("https://")) {
      return new URL(urlValue)
    }
    return new URL(urlValue, "http://localhost")
  }

  const parsed = parse(trimmed)
  const signedPath = parsed.searchParams.get("path")
  if (signedPath?.startsWith("cv/")) return signedPath

  const marker = "/storage/v1/object/public/"
  const markerIndex = parsed.pathname.indexOf(marker)
  if (markerIndex < 0) return undefined

  const storagePath = parsed.pathname.slice(markerIndex + marker.length)
  const firstSlash = storagePath.indexOf("/")
  if (firstSlash < 0) return undefined

  const objectPath = storagePath.slice(firstSlash + 1)
  return objectPath.startsWith("cv/") ? objectPath : undefined
}

function normalizeCvUrl(rawUrl: string | null | undefined): string | null {
  const cvPath = extractCvPath(rawUrl)
  if (cvPath) return buildInternalCvUrl(cvPath)
  if (!rawUrl?.trim()) return null
  return rawUrl.trim()
}

function getCandidateInitials(name: string | undefined): string {
  if (!name?.trim()) return "?"
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export default function OrganizationApplicationDetailPage() {
  const { push } = useRouter()
  const params = useParams<{ id: string; applicationId: string }>()
  const jobId = params?.id
  const applicationId = params?.applicationId

  const applicationQuery = useQuery({
    queryKey: ["applications", "detail", applicationId],
    queryFn: async () => {
      if (!applicationId) throw new Error("Application ID required")
      const result = await getApplicationDetail(applicationId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(applicationId),
  })

  const application =
    applicationQuery.data && applicationQuery.data.jobId === jobId ? applicationQuery.data : null

  const candidateId = application?.candidateId
  const { data: candidateProfile } = useUser(candidateId)
  const { data: resume } = useResumeByUser(candidateId)

  const questionsQuery = useQuery({
    queryKey: ["job-questions", "job", jobId],
    queryFn: async () => {
      if (!jobId) throw new Error("Job ID required")
      const result = await getQuestionsByJob(jobId)
      if (!Result.isOk(result)) throw new Error(getResultErrorMessage(result.error))
      return result.value
    },
    enabled: Boolean(jobId),
  })

  const questionLabelById = new Map((questionsQuery.data ?? []).map((q) => [q.id, q.label]))
  const candidateName = application?.candidate?.name ?? candidateProfile?.name ?? "Candidato"
  const applicationCandidate = (application?.candidate ?? {}) as {
    resumeUrl?: string | null
    cvUrl?: string | null
    cv?: string | null
  }
  const candidateWithExtras = (candidateProfile ?? {}) as {
    resumeUrl?: string | null
    cvUrl?: string | null
    cv?: string | null
  }
  const cvUrl =
    buildInternalCvUrl(resume?.cvFile?.path) ??
    normalizeCvUrl(applicationCandidate.resumeUrl) ??
    normalizeCvUrl(applicationCandidate.cvUrl) ??
    normalizeCvUrl(applicationCandidate.cv) ??
    normalizeCvUrl(resume?.cvFile?.url) ??
    normalizeCvUrl(application?.resumeUrl) ??
    (resume?.id ? `${API_BASE}/api/v1/resumes/${resume.id}/cv` : null) ??
    normalizeCvUrl(candidateWithExtras.resumeUrl) ??
    normalizeCvUrl(candidateWithExtras.cvUrl) ??
    normalizeCvUrl(candidateWithExtras.cv)

  if (!jobId || !applicationId) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">Ruta de postulación no válida.</p>
      </div>
    )
  }

  if (applicationQuery.isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">Cargando postulación…</p>
      </div>
    )
  }

  if (applicationQuery.isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          {applicationQuery.error instanceof Error
            ? applicationQuery.error.message
            : "No pudimos cargar esta postulación."}
        </p>
        <Button
          variant="outline"
          onClick={() => {
            startTransition(() => {
              addTransitionType("nav-back")
              push(`/dashboard/ofertas/${jobId}`)
            })
          }}
        >
          Volver a la oferta
        </Button>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No encontramos esta postulación para la oferta.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            startTransition(() => {
              addTransitionType("nav-back")
              push(`/dashboard/ofertas/${jobId}`)
            })
          }}
        >
          Volver a la oferta
        </Button>
      </div>
    )
  }

  return (
    <DirectionalTransition>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <button
          type="button"
          onClick={() => {
            startTransition(() => {
              addTransitionType("nav-back")
              push(`/dashboard/ofertas/${jobId}`)
            })
          }}
          className="flex items-center gap-2 bg-transparent p-0 text-sm text-muted-foreground hover:text-foreground"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={1.5} />
          Volver a postulaciones
        </button>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Detalle de postulación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 rounded-lg border border-border/60 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  {application.candidate?.avatar && (
                    <AvatarImage src={application.candidate.avatar} alt="" />
                  )}
                  <AvatarFallback>{getCandidateInitials(candidateName)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{candidateName}</p>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <HugeiconsIcon icon={Mail01Icon} size={14} />
                    {application.candidate?.email ?? "Sin email"}
                  </p>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <HugeiconsIcon icon={UserIcon} size={14} />
                    {application.candidate?.profession ??
                      candidateProfile?.profession ??
                      "Sin profesión"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="uppercase">
                  {application.status}
                </Badge>
                <Badge variant="secondary">
                  Postuló el {formatDateChilean(application.createdAt, "d MMM yyyy")}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Pretensión mínima</p>
                <p className="font-medium">
                  {application.salaryMin != null
                    ? formatAmountCLP(application.salaryMin)
                    : "No especificada"}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Pretensión máxima</p>
                <p className="font-medium">
                  {application.salaryMax != null
                    ? formatAmountCLP(application.salaryMax)
                    : "No especificada"}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Disponibilidad</p>
                <p className="font-medium">
                  {application.availabilityDate
                    ? formatDateChilean(application.availabilityDate, "d MMM yyyy")
                    : "No especificada"}
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Ubicación</p>
                <p className="font-medium">
                  {formatUserLocation(candidateProfile?.location ?? null) || "No especificada"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Carta de presentación</p>
              <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
                {application.coverLetter?.trim() || "No envió carta de presentación."}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">CV del candidato</p>
                {cvUrl ? (
                  <Button asChild size="sm">
                    <a href={cvUrl} target="_blank" rel="noreferrer">
                      <HugeiconsIcon icon={FileAttachmentIcon} size={14} className="mr-2" />
                      Ver CV
                    </a>
                  </Button>
                ) : (
                  <Badge variant="secondary">Sin CV adjunto</Badge>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Preguntas respondidas</p>
              {!application.answers?.length ? (
                <div className="rounded-lg border bg-background p-4 text-sm text-muted-foreground">
                  Esta postulación no tiene respuestas guardadas.
                </div>
              ) : (
                <div className="space-y-2">
                  {application.answers.map((answer) => (
                    <div key={answer.id} className="rounded-lg border bg-background p-4">
                      <p className="text-sm font-medium text-foreground">
                        {questionLabelById.get(answer.questionId) ?? "Pregunta"}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                        {answer.value}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Respondida el {formatDateChilean(answer.createdAt, "d MMM yyyy HH:mm")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DirectionalTransition>
  )
}
