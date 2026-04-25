import { tool } from "ai"
import { Result, type Result as ResultType } from "better-result"
import { z } from "zod"
import {
  getApplicationDetail,
  getApplicationsByCandidate,
  getApplicationsByJob,
  getApplicationsByOrganization,
} from "@/lib/api/applications"
import { createOrFindChat } from "@/lib/api/chats"
import { getJob, getJobQuestions, getJobs } from "@/lib/api/jobs"
import { sendMessage } from "@/lib/api/messages"
import { getOrganizationMetrics } from "@/lib/api/organization-metrics"
import { getResumeByUserId } from "@/lib/api/resumes"
import { getUser, getUsers } from "@/lib/api/users"

const DANGEROUS_PATTERNS = [
  /;\s*drop\s+/i,
  /;\s*delete\s+/i,
  /;\s*truncate\s+/i,
  /;\s*insert\s+/i,
  /;\s*update\s+\w+\s+set/i,
  /exec\s*\(/i,
  /eval\s*\(/i,
  /system\s*\(/i,
  /shell\s*\(/i,
  /\$\{.*\}/,
  /\$\w+/,
]

function containsDangerousInput(input: unknown): boolean {
  if (typeof input === "string") {
    return DANGEROUS_PATTERNS.some((pattern) => pattern.test(input))
  }
  if (Array.isArray(input)) {
    return input.some(containsDangerousInput)
  }
  if (typeof input === "object" && input !== null) {
    return Object.values(input as Record<string, unknown>).some(containsDangerousInput)
  }
  return false
}

function validateToolInput(toolName: string, args: Record<string, unknown>): void {
  if (containsDangerousInput(args)) {
    throw new Error(`Potentially dangerous input detected in ${toolName}`)
  }
}

type KanbanStatus = "applied" | "reviewing" | "interview" | "offer" | "rejected" | "all"

const mapKanbanToApiStatus = (status: Exclude<KanbanStatus, "all">) => {
  switch (status) {
    case "interview":
      return "entrevista"
    case "offer":
      return "oferta"
    case "rejected":
      return "rechazado"
    case "reviewing":
    case "applied":
      return "pendiente"
  }
}

const mapApiToKanbanStatus = (status?: string): Exclude<KanbanStatus, "all"> => {
  switch (status) {
    case "entrevista":
      return "interview"
    case "oferta":
      return "offer"
    case "rechazado":
      return "rejected"
    default:
      return "applied"
  }
}

const hasSkillsMatch = (candidateSkills: string[], requestedSkills: string[]) => {
  const normalizedCandidate = candidateSkills.map((skill) => skill.toLowerCase())
  return requestedSkills.every((skill) =>
    normalizedCandidate.some((candidateSkill) => candidateSkill.includes(skill.toLowerCase()))
  )
}

const getResultValue = <T, E>(result: ResultType<T, E>): T | null => {
  if (!Result.isOk(result)) return null
  return result.value
}

const getCvPathFromSignedUrl = (url: string): string | null => {
  try {
    const parsed = new URL(url, "http://localhost")
    const path = parsed.searchParams.get("path")
    if (!path || !path.startsWith("cv/")) return null
    return path
  } catch {
    return null
  }
}

const resolveCvAccessUrl = (args: {
  applicationResumeUrl?: string | null
  resumeCvUrl?: string | null
  resumeCvPath?: string | null
}): string | null => {
  if (args.resumeCvPath) {
    return `/api/cv/signed-url?path=${encodeURIComponent(args.resumeCvPath)}`
  }
  if (args.applicationResumeUrl) {
    const path = getCvPathFromSignedUrl(args.applicationResumeUrl)
    if (path) return `/api/cv/signed-url?path=${encodeURIComponent(path)}`
    return args.applicationResumeUrl
  }
  if (args.resumeCvUrl) {
    const path = getCvPathFromSignedUrl(args.resumeCvUrl)
    if (path) return `/api/cv/signed-url?path=${encodeURIComponent(path)}`
    return args.resumeCvUrl
  }
  return null
}

export const getCandidatesTool = tool({
  description: "Obtiene todos los candidatos postulados a un job offer con su perfil completo",
  inputSchema: z.object({
    jobOfferId: z.string().min(1).max(100),
    status: z.enum(["applied", "reviewing", "interview", "offer", "rejected", "all"]),
  }),
  execute: async ({ jobOfferId, status }) => {
    validateToolInput("getCandidates", { jobOfferId })
    const apiStatus = status !== "all" ? mapKanbanToApiStatus(status) : undefined
    const result = await getApplicationsByJob(jobOfferId, { limit: 100, status: apiStatus })
    if (!Result.isOk(result)) {
      return { error: "No se pudieron obtener candidatos", details: String(result.error) }
    }

    const applications = result.value
    const candidates = await Promise.all(
      applications.map(async (application) => {
        const userResult = await getUser(application.candidateId)
        const resumeResult = await getResumeByUserId(application.candidateId)
        const user = getResultValue(userResult)
        const resume = getResultValue(resumeResult)

        return {
          id: application.id,
          status: mapApiToKanbanStatus(application.status),
          applied_at: application.createdAt,
          profile: {
            id: application.candidateId,
            name: user?.name ?? application.candidate?.name ?? "Sin nombre",
            email: user?.email ?? application.candidate?.email ?? "",
            profession: user?.profession ?? application.candidate?.profession ?? null,
            skills: Array.isArray(resume?.skills)
              ? resume.skills.map((skill) => (typeof skill === "string" ? skill : skill.name))
              : [],
            bio: resume?.summary ?? null,
          },
        }
      })
    )

    return candidates
  },
})

export const getJobOfferTool = tool({
  description: "Obtiene los detalles completos de un job offer",
  inputSchema: z.object({
    jobOfferId: z.string().min(1).max(100),
  }),
  execute: async ({ jobOfferId }) => {
    validateToolInput("getJobOffer", { jobOfferId })
    const result = await getJob(jobOfferId)
    if (!Result.isOk(result)) {
      return { error: "No se pudo obtener la oferta", details: String(result.error) }
    }
    return result.value
  },
})

export const getJobOffersTool = tool({
  description: "Lista todas las ofertas de trabajo activas de la organización",
  inputSchema: z.object({
    organizationId: z.string().max(100).optional(),
    status: z.enum(["active", "closed", "draft", "paused", "all"]).optional().default("active"),
    limit: z.number().min(1).max(50).default(20),
  }),
  execute: async ({ organizationId, status, limit = 20 }) => {
    const result = await getJobs({
      organizationId,
      status: status === "all" ? undefined : status,
      limit,
      page: 1,
    })

    if (!Result.isOk(result)) {
      return { error: "No se pudieron obtener ofertas", details: String(result.error) }
    }
    return result.value
  },
})

export const updateCandidateStatusTool = tool({
  description: "Mueve un candidato a otra columna del kanban",
  inputSchema: z.object({
    applicationId: z.string().min(1).max(100),
    newStatus: z.enum(["applied", "reviewing", "interview", "offer", "rejected"]),
    reason: z.string().min(1).max(500),
  }),
  execute: async ({ applicationId, newStatus, reason }) => {
    validateToolInput("updateCandidateStatus", { applicationId })
    const { updateApplicationStatus } = await import("@/lib/api/applications")
    const result = await updateApplicationStatus(applicationId, mapKanbanToApiStatus(newStatus))
    if (!Result.isOk(result)) {
      return {
        success: false,
        error: "No se pudo actualizar el estado",
        details: String(result.error),
      }
    }

    return {
      success: true,
      applicationId,
      newStatus,
      reason,
      updatedAt: result.value.updatedAt,
    }
  },
})

export const sendMessageToCandidateTool = tool({
  description: "Envía un mensaje directo a un candidato desde la plataforma",
  inputSchema: z.object({
    candidateId: z.string().min(1).max(100),
    recruiterId: z.string().min(1).max(100),
    subject: z.string().min(1).max(200),
    body: z.string().min(1).max(5000),
  }),
  execute: async ({ candidateId, recruiterId, subject, body }) => {
    validateToolInput("sendMessageToCandidate", { candidateId, subject, body })
    const chatResult = await createOrFindChat(candidateId)
    if (!Result.isOk(chatResult)) {
      return {
        success: false,
        error: "No se pudo crear el chat",
        details: String(chatResult.error),
      }
    }

    const messageResult = await sendMessage({
      chatId: chatResult.value.id,
      senderId: recruiterId,
      content: `${subject}\n\n${body}`,
      type: "text",
    })
    if (!Result.isOk(messageResult)) {
      return {
        success: false,
        error: "No se pudo enviar el mensaje",
        details: String(messageResult.error),
      }
    }

    return { success: true, candidateId, subject, chatId: chatResult.value.id }
  },
})

export const searchCandidatesBySkillsTool = tool({
  description:
    "Busca candidatos en la base de datos por skills específicos, aunque no hayan postulado al job actual",
  inputSchema: z.object({
    skills: z.array(z.string().min(1).max(100)).min(1).max(20),
    minExperience: z.number().min(0).max(50).optional().default(0),
    limit: z.number().min(1).max(50).optional().default(10),
  }),
  execute: async ({ skills, minExperience = 0, limit = 10 }) => {
    validateToolInput("searchCandidatesBySkills", { skills })
    const usersResult = await getUsers({
      type: "professional",
      limit: 100,
      page: 1,
      isActive: true,
    })
    if (!Result.isOk(usersResult)) {
      return { error: "No se pudieron obtener candidatos", details: String(usersResult.error) }
    }

    const candidates = await Promise.all(
      usersResult.value.data.map(async (user) => {
        const resumeResult = await getResumeByUserId(user.id)
        const resume = getResultValue(resumeResult)
        const skillsList = Array.isArray(resume?.skills)
          ? resume.skills.map((skill) => (typeof skill === "string" ? skill : skill.name))
          : []
        const experienceYears = Array.isArray(resume?.experiences) ? resume.experiences.length : 0

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          profession: user.profession,
          skills: skillsList,
          years_of_experience: experienceYears,
          bio: resume?.summary ?? null,
        }
      })
    )

    const filtered = candidates
      .filter((candidate) => hasSkillsMatch(candidate.skills ?? [], skills))
      .filter((candidate) => (candidate.years_of_experience ?? 0) >= minExperience)
      .slice(0, limit)

    return filtered
  },
})

export const getOrganizationStatsTool = tool({
  description: "Obtiene estadísticas de la organización: ofertas activas, postulaciones, métricas",
  inputSchema: z.object({
    organizationId: z.string().min(1).max(100),
  }),
  execute: async ({ organizationId }) => {
    validateToolInput("getOrganizationStats", { organizationId })
    const metricsResult = await getOrganizationMetrics(organizationId, { period: "month" })
    if (!Result.isOk(metricsResult)) {
      return { error: "No se pudieron obtener métricas", details: String(metricsResult.error) }
    }
    return metricsResult.value
  },
})

export const getCandidateDetailTool = tool({
  description: "Obtiene el perfil detallado de un candidato específico",
  inputSchema: z.object({
    candidateId: z.string().min(1).max(100),
  }),
  execute: async ({ candidateId }) => {
    validateToolInput("getCandidateDetail", { candidateId })
    const [userResult, resumeResult, applicationsResult] = await Promise.all([
      getUser(candidateId),
      getResumeByUserId(candidateId),
      getApplicationsByCandidate(candidateId, { limit: 50, page: 1 }),
    ])

    if (!Result.isOk(userResult)) return { error: "Candidato no encontrado" }
    return {
      profile: userResult.value,
      resume: getResultValue(resumeResult),
      applications: Result.isOk(applicationsResult) ? applicationsResult.value : [],
    }
  },
})

export const listApplicationsTool = tool({
  description: "Lista todas las postulaciones de la organización con opción de filtrar",
  inputSchema: z.object({
    organizationId: z.string().min(1).max(100),
    status: z
      .enum(["applied", "reviewing", "interview", "offer", "rejected", "all"])
      .optional()
      .default("all"),
    limit: z.number().min(1).max(100).optional().default(50),
  }),
  execute: async ({ organizationId, status, limit = 50 }) => {
    validateToolInput("listApplications", { organizationId })
    const { getApplicationsByOrganization } = await import("@/lib/api/applications")
    const result = await getApplicationsByOrganization(organizationId, { page: 1, limit })
    if (!Result.isOk(result)) {
      return { error: "No se pudieron obtener postulaciones", details: String(result.error) }
    }

    const applications = result.value.data
    if (status === "all") return applications

    const apiStatus = mapKanbanToApiStatus(status)
    return applications.filter((application) => application.status === apiStatus)
  },
})

export const getApplicationDossierTool = tool({
  description:
    "Obtiene el dossier completo de una postulación: carta, respuestas con pregunta, candidato y CV.",
  inputSchema: z.object({
    applicationId: z.string().min(1).max(100),
  }),
  execute: async ({ applicationId }) => {
    validateToolInput("getApplicationDossier", { applicationId })
    const applicationResult = await getApplicationDetail(applicationId)
    if (!Result.isOk(applicationResult)) {
      return {
        error: "No se pudo obtener la postulación",
        details: String(applicationResult.error),
      }
    }

    const application = applicationResult.value
    const [resumeResult, questionsResult] = await Promise.all([
      getResumeByUserId(application.candidateId),
      getJobQuestions(application.jobId),
    ])

    const resume = getResultValue(resumeResult)
    const questions = getResultValue(questionsResult) ?? []
    const questionLabelById = new Map(questions.map((q) => [q.id, q.label]))

    return {
      id: application.id,
      jobId: application.jobId,
      status: application.status,
      createdAt: application.createdAt,
      candidate: application.candidate,
      coverLetter: application.coverLetter ?? null,
      salary: {
        min: application.salaryMin ?? null,
        max: application.salaryMax ?? null,
        currency: application.salaryCurrency ?? null,
      },
      availabilityDate: application.availabilityDate ?? null,
      cvUrl: resolveCvAccessUrl({
        applicationResumeUrl: application.resumeUrl ?? null,
        resumeCvUrl: resume?.cvFile?.url ?? null,
        resumeCvPath: resume?.cvFile?.path ?? null,
      }),
      answers: (application.answers ?? []).map((answer) => ({
        id: answer.id,
        questionId: answer.questionId,
        question: questionLabelById.get(answer.questionId) ?? "Pregunta",
        value: answer.value,
        createdAt: answer.createdAt,
      })),
    }
  },
})

export const getJobApplicationsWithAnswersTool = tool({
  description:
    "Lista postulaciones de una oferta con carta y respuestas, usando el endpoint de organización.",
  inputSchema: z.object({
    organizationId: z.string().min(1).max(100),
    jobId: z.string().min(1).max(100),
    page: z.number().min(1).max(100).optional().default(1),
    limit: z.number().min(1).max(100).optional().default(10),
  }),
  execute: async ({ organizationId, jobId, page = 1, limit = 10 }) => {
    validateToolInput("getJobApplicationsWithAnswers", { organizationId, jobId })
    const [applicationsResult, questionsResult] = await Promise.all([
      getApplicationsByOrganization(organizationId, { page, limit, includeAnswers: true }),
      getJobQuestions(jobId),
    ])

    if (!Result.isOk(applicationsResult)) {
      return {
        error: "No se pudieron obtener postulaciones",
        details: String(applicationsResult.error),
      }
    }

    const questionLabelById = new Map(
      (getResultValue(questionsResult) ?? []).map((q) => [q.id, q.label])
    )
    const applications = applicationsResult.value.data.filter((app) => app.jobId === jobId)

    return applications.map((application) => ({
      id: application.id,
      candidate: application.candidate,
      status: application.status,
      coverLetter: application.coverLetter ?? null,
      createdAt: application.createdAt,
      answers: (application.answers ?? []).map((answer) => ({
        questionId: answer.questionId,
        question: questionLabelById.get(answer.questionId) ?? "Pregunta",
        value: answer.value,
      })),
    }))
  },
})

export const organizationTools = {
  getCandidates: getCandidatesTool,
  getJobOffer: getJobOfferTool,
  getJobOffers: getJobOffersTool,
  updateCandidateStatus: updateCandidateStatusTool,
  sendMessageToCandidate: sendMessageToCandidateTool,
  searchCandidatesBySkills: searchCandidatesBySkillsTool,
  getOrganizationStats: getOrganizationStatsTool,
  getCandidateDetail: getCandidateDetailTool,
  listApplications: listApplicationsTool,
  getApplicationDossier: getApplicationDossierTool,
  getJobApplicationsWithAnswers: getJobApplicationsWithAnswersTool,
}

export type OrganizationTools = typeof organizationTools
