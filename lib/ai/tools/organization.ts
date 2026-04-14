import { tool } from "ai"
import { Result, type Result as ResultType } from "better-result"
import { z } from "zod"
import { getApplicationsByCandidate, getApplicationsByJob } from "@/lib/api/applications"
import { createOrFindChat } from "@/lib/api/chats"
import { getJob, getJobs } from "@/lib/api/jobs"
import { sendMessage } from "@/lib/api/messages"
import { getOrganizationMetrics } from "@/lib/api/organization-metrics"
import { getResumeByUserId } from "@/lib/api/resumes"
import { getUser, getUsers } from "@/lib/api/users"

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

export const getCandidatesTool = tool({
  description: "Obtiene todos los candidatos postulados a un job offer con su perfil completo",
  inputSchema: z.object({
    jobOfferId: z.string().describe("ID del job offer"),
    status: z.enum(["applied", "reviewing", "interview", "offer", "rejected", "all"] as const),
  }),
  execute: async ({ jobOfferId, status }) => {
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
    jobOfferId: z.string().describe("ID del job offer"),
  }),
  execute: async ({ jobOfferId }) => {
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
    organizationId: z.string().optional().describe("ID de la organización"),
    status: z
      .enum(["active", "closed", "draft", "paused", "all"])
      .optional()
      .default("active")
      .describe("Filtrar por estado de la oferta"),
    limit: z.number().optional().default(20),
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
    applicationId: z.string().describe("ID de la postulación"),
    newStatus: z
      .enum(["applied", "reviewing", "interview", "offer", "rejected"])
      .describe("Nuevo estado del candidato"),
    reason: z.string().describe("Razón del cambio de estado"),
  }),
  execute: async ({ applicationId, newStatus, reason }) => {
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
    candidateId: z.string().describe("ID del candidato"),
    recruiterId: z.string().describe("ID del recruiter que envía el mensaje"),
    subject: z.string().describe("Asunto del mensaje"),
    body: z.string().describe("Contenido del mensaje"),
  }),
  execute: async ({ candidateId, recruiterId, subject, body }) => {
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
    skills: z.array(z.string()).describe("Lista de skills a buscar"),
    minExperience: z.number().optional().default(0),
    limit: z.number().optional().default(10),
  }),
  execute: async ({ skills, minExperience = 0, limit = 10 }) => {
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
    organizationId: z.string().describe("ID de la organización"),
  }),
  execute: async ({ organizationId }) => {
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
    candidateId: z.string().describe("ID del perfil/candidato"),
  }),
  execute: async ({ candidateId }) => {
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
    organizationId: z.string().describe("ID de la organización"),
    status: z
      .enum(["applied", "reviewing", "interview", "offer", "rejected", "all"])
      .optional()
      .default("all"),
    limit: z.number().optional().default(50),
  }),
  execute: async ({ organizationId, status, limit = 50 }) => {
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
}

export type OrganizationTools = typeof organizationTools
