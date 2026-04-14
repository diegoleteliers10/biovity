import { tool } from "ai"
import { Result } from "better-result"
import { z } from "zod"
import {
  type ApplicationStatus,
  getApplicationDetail,
  getApplicationsByCandidate,
  getApplicationsByJob,
  updateApplicationStatus,
} from "@/lib/api/applications"
import { createOrFindChat, getChatById, getChatsByRecruiter } from "@/lib/api/chats"
import { createEvent, getEventById, getEvents, updateEvent } from "@/lib/api/events"
import {
  type CreateJobInput,
  createJob,
  getJob,
  getJobs,
  getJobsByOrganization,
  type UpdateJobInput,
  updateJob,
} from "@/lib/api/jobs"
import { getMessagesByChatId, type SendMessageInput, sendMessage } from "@/lib/api/messages"
import { getOrganizationMetrics } from "@/lib/api/organization-metrics"
import { getOrganization } from "@/lib/api/organizations"
import type { CreateEventInput, EventStatus, EventType, UpdateEventInput } from "@/lib/types/events"

export const getJobViewsTool = tool({
  description: "Obtiene el número de vistas de una oferta de trabajo específica",
  inputSchema: z.object({
    jobId: z.string().describe("ID del job offer"),
  }),
  execute: async ({ jobId }) => {
    const result = await getJob(jobId)
    if (!Result.isOk(result)) {
      return { error: "Error al obtener vistas del job", details: String(result.error) }
    }
    return {
      jobId,
      title: result.value.title,
      views: result.value.views ?? 0,
      applicationsCount: result.value.applicationsCount ?? 0,
    }
  },
})

export const createJobTool = tool({
  description:
    "Crea una nueva oferta de trabajo para la organización. IMPORTANTE: Esta acción modifica datos. Requiere confirmación del usuario.",
  inputSchema: z.object({
    organizationId: z.string().describe("ID de la organización"),
    title: z.string().describe("Título del puesto"),
    description: z.string().describe("Descripción completa del puesto"),
    employmentType: z.string().describe("Tipo de empleo: full-time, part-time, contract, etc."),
    experienceLevel: z
      .enum(["junior", "mid", "senior", "lead", "executive"])
      .describe("Nivel de experiencia requerido"),
    salary: z
      .object({
        min: z.number().optional(),
        max: z.number().optional(),
        currency: z.string().default("CLP"),
        period: z.string().default("monthly"),
        isNegotiable: z.boolean().default(false),
      })
      .optional()
      .describe("Rango salarial"),
    location: z
      .object({
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        isRemote: z.boolean().default(false),
        isHybrid: z.boolean().default(false),
      })
      .optional(),
    benefits: z
      .array(
        z.object({
          tipo: z.string(),
          label: z.string(),
        })
      )
      .optional()
      .describe("Beneficios laborales"),
    confirm: z.boolean().default(false).describe("Confirmar la creación del job"),
  }),
  execute: async ({
    organizationId,
    title,
    description,
    employmentType,
    experienceLevel,
    salary,
    location,
    benefits,
    confirm,
  }) => {
    if (!confirm) {
      return {
        confirmation_required: true,
        message: `¿Confirmas que deseas crear la siguiente oferta de trabajo?\n\n**Título:** ${title}\n**Tipo:** ${employmentType}\n**Nivel:** ${experienceLevel}${salary ? `\n**Salario:** ${salary.min ?? "?"} - ${salary.max ?? "?"} ${salary.currency}/${salary.period}` : ""}${location ? `\n**Ubicación:** ${location.isRemote ? "Remoto" : location.isHybrid ? "Híbrido" : [location.city, location.state, location.country].filter(Boolean).join(", ")}` : ""}\n\nResponde "sí" o "confirmar" para proceder.`,
        preview: { title, employmentType, experienceLevel, organizationId },
      }
    }

    const input: CreateJobInput = {
      organizationId,
      title,
      description,
      employmentType,
      experienceLevel,
      salary,
      location,
      benefits,
      status: "active",
    }

    const result = await createJob(input)
    if (!Result.isOk(result)) {
      return {
        success: false,
        error: "Error al crear el job",
        details: String(result.error),
      }
    }

    return {
      success: true,
      message: `✅ Oferta de trabajo creada exitosamente`,
      job: {
        id: result.value.id,
        title: result.value.title,
        status: result.value.status,
      },
    }
  },
})

export const updateJobTool = tool({
  description:
    "Actualiza una oferta de trabajo existente. IMPORTANTE: Esta acción modifica datos. Requiere confirmación para cambios significativos.",
  inputSchema: z.object({
    jobId: z.string().describe("ID del job offer a actualizar"),
    title: z.string().optional().describe("Nuevo título del puesto"),
    description: z.string().optional().describe("Nueva descripción"),
    employmentType: z.string().optional().describe("Nuevo tipo de empleo"),
    experienceLevel: z.string().optional().describe("Nuevo nivel de experiencia"),
    salary: z
      .object({
        min: z.number().optional(),
        max: z.number().optional(),
        currency: z.string().optional(),
        period: z.string().optional(),
        isNegotiable: z.boolean().optional(),
      })
      .optional(),
    location: z
      .object({
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        isRemote: z.boolean().optional(),
        isHybrid: z.boolean().optional(),
      })
      .optional(),
    status: z.string().optional().describe("Nuevo estado: active, closed, paused, draft"),
    confirm: z.boolean().default(false).describe("Confirmar la actualización"),
  }),
  execute: async ({
    jobId,
    title,
    description,
    employmentType,
    experienceLevel,
    salary,
    location,
    status,
    confirm,
  }) => {
    const changes: string[] = []
    if (title) changes.push(`título: "${title}"`)
    if (description) changes.push("descripción")
    if (employmentType) changes.push(`tipo: ${employmentType}`)
    if (experienceLevel) changes.push(`nivel: ${experienceLevel}`)
    if (salary) changes.push("salario")
    if (location) changes.push("ubicación")
    if (status) changes.push(`estado: ${status}`)

    if (!confirm) {
      return {
        confirmation_required: true,
        message: `¿Confirmas los siguientes cambios para el job ${jobId}?\n\n${changes.map((c) => `• ${c}`).join("\n")}\n\nResponde "sí" o "confirmar" para proceder.`,
        preview: { jobId, changes },
      }
    }

    const input: UpdateJobInput = {}
    if (title !== undefined) input.title = title
    if (description !== undefined) input.description = description
    if (employmentType !== undefined) input.employmentType = employmentType
    if (experienceLevel !== undefined) input.experienceLevel = experienceLevel
    if (salary !== undefined) input.salary = salary
    if (location !== undefined) input.location = location
    if (status !== undefined) input.status = status

    const result = await updateJob(jobId, input)
    if (!Result.isOk(result)) {
      return {
        success: false,
        error: "Error al actualizar el job",
        details: String(result.error),
      }
    }

    return {
      success: true,
      message: `✅ Oferta de trabajo actualizada exitosamente`,
      job: {
        id: result.value.id,
        title: result.value.title,
        status: result.value.status,
      },
    }
  },
})

export const closeJobTool = tool({
  description:
    "Cierra una oferta de trabajo (la marca como no activa). IMPORTANTE: Esta acción no puede deshacerse fácilmente.",
  inputSchema: z.object({
    jobId: z.string().describe("ID del job offer a cerrar"),
    confirm: z.boolean().default(false).describe("Confirmar el cierre del job"),
  }),
  execute: async ({ jobId, confirm }) => {
    if (!confirm) {
      return {
        confirmation_required: true,
        message: `⚠️ ¿Estás seguro de que deseas cerrar la oferta de trabajo ${jobId}?\n\nLas ofertas cerradas dejan de ser visibles para nuevos candidatos. Esta acción puede revertirse editando el estado.\n\nResponde "sí" o "confirmar" para proceder.`,
        preview: { jobId, action: "close" },
      }
    }

    const result = await updateJob(jobId, { status: "closed" })
    if (!Result.isOk(result)) {
      return {
        success: false,
        error: "Error al cerrar el job",
        details: String(result.error),
      }
    }

    return {
      success: true,
      message: `✅ Oferta de trabajo cerrada exitosamente`,
      jobId,
      newStatus: "closed",
    }
  },
})

export const getEventsByOrganizationTool = tool({
  description: "Obtiene los eventos (entrevistas, tareas, anuncios) de la organización",
  inputSchema: z.object({
    organizationId: z.string().describe("ID de la organización"),
    type: z
      .enum(["interview", "task_deadline", "announcement", "onboarding"])
      .optional()
      .describe("Filtrar por tipo de evento"),
    status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
    from: z.string().optional().describe("Fecha inicio (ISO 8601)"),
    to: z.string().optional().describe("Fecha fin (ISO 8601)"),
    limit: z.number().optional().default(50),
  }),
  execute: async ({ organizationId, type, status, from, to, limit }) => {
    const result = await getEvents({ organizerId: organizationId, type, status, from, to, limit })
    if (!Result.isOk(result)) {
      return { error: "Error al obtener eventos", details: String(result.error) }
    }

    const events = result.value.data.map((e) => ({
      id: e.id,
      title: e.title,
      type: e.type,
      status: e.status,
      startAt: e.startAt,
      endAt: e.endAt,
      location: e.location,
      meetingUrl: e.meetingUrl,
    }))

    return {
      total: result.value.total,
      events,
    }
  },
})

export const createEventTool = tool({
  description:
    "Crea un nuevo evento como una entrevista, tarea o anuncio. IMPORTANTE: Esta acción crea datos. Requiere confirmación.",
  inputSchema: z.object({
    organizerId: z.string().describe("ID del organizador (usuario)"),
    organizationId: z.string().optional().describe("ID de la organización"),
    title: z.string().describe("Título del evento"),
    description: z.string().optional().describe("Descripción del evento"),
    type: z
      .enum(["interview", "task_deadline", "announcement", "onboarding"])
      .describe("Tipo de evento"),
    startAt: z.string().describe("Fecha y hora de inicio (ISO 8601)"),
    endAt: z.string().optional().describe("Fecha y hora de fin (ISO 8601)"),
    location: z.string().optional().describe("Ubicación física"),
    meetingUrl: z.string().optional().describe("URL de reunión virtual"),
    candidateId: z.string().optional().describe("ID del candidato asociado"),
    applicationId: z.string().optional().describe("ID de la postulación asociada"),
    confirm: z.boolean().default(false).describe("Confirmar la creación"),
  }),
  execute: async ({
    organizerId,
    organizationId,
    title,
    description,
    type,
    startAt,
    endAt,
    location,
    meetingUrl,
    candidateId,
    applicationId,
    confirm,
  }) => {
    if (!confirm) {
      return {
        confirmation_required: true,
        message: `¿Confirmas crear el siguiente evento?\n\n**Título:** ${title}\n**Tipo:** ${type}\n**Fecha:** ${new Date(startAt).toLocaleString("es-CL")}${endAt ? ` - ${new Date(endAt).toLocaleString("es-CL")}` : ""}${location ? `\n**Ubicación:** ${location}` : ""}${meetingUrl ? `\n**Link:** ${meetingUrl}` : ""}\n\nResponde "sí" o "confirmar" para proceder.`,
        preview: { title, type, startAt, organizerId },
      }
    }

    const input: CreateEventInput = {
      title,
      type: type as EventType,
      startAt,
      organizerId,
      description,
      endAt,
      location,
      meetingUrl,
      organizationId,
      candidateId,
      applicationId,
    }

    const result = await createEvent(input)
    if (!Result.isOk(result)) {
      return {
        success: false,
        error: "Error al crear el evento",
        details: String(result.error),
      }
    }

    return {
      success: true,
      message: `✅ Evento creado exitosamente`,
      event: {
        id: result.value.id,
        title: result.value.title,
        type: result.value.type,
        startAt: result.value.startAt,
      },
    }
  },
})

export const updateEventTool = tool({
  description: "Actualiza un evento existente (entrevista, tarea, etc.)",
  inputSchema: z.object({
    eventId: z.string().describe("ID del evento a actualizar"),
    title: z.string().optional(),
    description: z.string().optional(),
    type: z.enum(["interview", "task_deadline", "announcement", "onboarding"]).optional(),
    startAt: z.string().optional(),
    endAt: z.string().optional(),
    location: z.string().optional(),
    meetingUrl: z.string().optional(),
    status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
    confirm: z.boolean().default(false),
  }),
  execute: async ({
    eventId,
    title,
    description,
    type,
    startAt,
    endAt,
    location,
    meetingUrl,
    status,
    confirm,
  }) => {
    const changes: string[] = []
    if (title) changes.push(`título: "${title}"`)
    if (description !== undefined) changes.push("descripción")
    if (type) changes.push(`tipo: ${type}`)
    if (startAt) changes.push(`inicio: ${new Date(startAt).toLocaleString("es-CL")}`)
    if (endAt) changes.push(`fin: ${new Date(endAt).toLocaleString("es-CL")}`)
    if (location !== undefined) changes.push(`ubicación: ${location}`)
    if (meetingUrl !== undefined) changes.push("link de reunión")
    if (status) changes.push(`estado: ${status}`)

    if (!confirm) {
      return {
        confirmation_required: true,
        message: `¿Confirmas los siguientes cambios para el evento ${eventId}?\n\n${changes.map((c) => `• ${c}`).join("\n")}\n\nResponde "sí" o "confirmar" para proceder.`,
        preview: { eventId, changes },
      }
    }

    const input: UpdateEventInput = {}
    if (title !== undefined) input.title = title
    if (description !== undefined) input.description = description
    if (type !== undefined) input.type = type as EventType
    if (startAt !== undefined) input.startAt = startAt
    if (endAt !== undefined) input.endAt = endAt
    if (location !== undefined) input.location = location
    if (meetingUrl !== undefined) input.meetingUrl = meetingUrl
    if (status !== undefined) input.status = status as EventStatus

    const result = await updateEvent(eventId, input)
    if (!Result.isOk(result)) {
      return {
        success: false,
        error: "Error al actualizar el evento",
        details: String(result.error),
      }
    }

    return {
      success: true,
      message: `✅ Evento actualizado exitosamente`,
      event: {
        id: result.value.id,
        title: result.value.title,
        status: result.value.status,
      },
    }
  },
})

export const updateApplicationStatusTool = tool({
  description:
    "Actualiza el estado de una postulación en el pipeline de reclutamiento. IMPORTANTE: Esta acción modifica datos del candidato.",
  inputSchema: z.object({
    applicationId: z.string().describe("ID de la postulación"),
    newStatus: z
      .enum(["pendiente", "entrevista", "oferta", "rechazado", "contratado"])
      .describe("Nuevo estado en el pipeline"),
    reason: z.string().optional().describe("Razón del cambio de estado"),
    confirm: z.boolean().default(false),
  }),
  execute: async ({ applicationId, newStatus, reason, confirm }) => {
    if (!confirm) {
      return {
        confirmation_required: true,
        message: `¿Confirmas mover esta postulación al estado **"${newStatus}"**?${reason ? `\n\n**Motivo:** ${reason}` : ""}\n\nResponde "sí" o "confirmar" para proceder.`,
        preview: { applicationId, newStatus },
      }
    }

    const result = await updateApplicationStatus(applicationId, newStatus as ApplicationStatus)
    if (!Result.isOk(result)) {
      return {
        success: false,
        error: "Error al actualizar el estado",
        details: String(result.error),
      }
    }

    return {
      success: true,
      message: `✅ Postulación movida a "${newStatus}"`,
      application: {
        id: result.value.id,
        status: result.value.status,
      },
    }
  },
})

export const getApplicationDetailTool = tool({
  description: "Obtiene el detalle completo de una postulación",
  inputSchema: z.object({
    applicationId: z.string().describe("ID de la postulación"),
  }),
  execute: async ({ applicationId }) => {
    const result = await getApplicationDetail(applicationId)
    if (!Result.isOk(result)) {
      return { error: "Error al obtener detalle de la postulación", details: String(result.error) }
    }
    return result.value
  },
})

export const getSubscriptionTool = tool({
  description: "Obtiene la información de suscripción y plan de la organización",
  inputSchema: z.object({
    organizationId: z.string().describe("ID de la organización"),
  }),
  execute: async ({ organizationId }) => {
    const orgResult = await getOrganization(organizationId)
    if (!Result.isOk(orgResult)) {
      return { error: "Error al obtener la organización", details: String(orgResult.error) }
    }

    const org = orgResult.value
    return {
      organizationId,
      organizationName: org.name,
      subscriptionId: org.subscriptionId,
      hasSubscription: !!org.subscriptionId,
    }
  },
})

export const getChatsByRecruiterTool = tool({
  description: "Obtiene todos los chats de un reclutador con candidatos",
  inputSchema: z.object({
    recruiterId: z.string().describe("ID del reclutador"),
    limit: z.number().optional().default(50),
  }),
  execute: async ({ recruiterId, limit }) => {
    const result = await getChatsByRecruiter(recruiterId)
    if (!Result.isOk(result)) {
      return { error: "Error al obtener los chats", details: String(result.error) }
    }

    return {
      chats: result.value.slice(0, limit).map((c) => ({
        id: c.id,
        professionalId: c.professionalId,
        lastMessage: c.lastMessage,
        unreadCount: c.unreadCountRecruiter,
        createdAt: c.createdAt,
      })),
      total: result.value.length,
    }
  },
})

export const sendDirectMessageTool = tool({
  description:
    "Envía un mensaje directo a un candidato a través del chat. IMPORTANTE: Esta acción envía un mensaje real.",
  inputSchema: z.object({
    professionalId: z.string().describe("ID del profesional/candidato"),
    senderId: z.string().describe("ID del remitente (recruiter)"),
    content: z.string().describe("Contenido del mensaje"),
    chatId: z
      .string()
      .optional()
      .describe("ID del chat existente (opcional, se crea uno nuevo si no existe)"),
    confirm: z.boolean().default(false),
  }),
  execute: async ({ professionalId, senderId, content, chatId, confirm }) => {
    if (!confirm) {
      return {
        confirmation_required: true,
        message: `¿Confirmas enviar el siguiente mensaje al candidato?\n\n**Mensaje:** ${content}\n\nResponde "sí" o "confirmar" para proceder.`,
        preview: {
          professionalId,
          content: content.slice(0, 100) + (content.length > 100 ? "..." : ""),
        },
      }
    }

    let targetChatId = chatId
    if (!targetChatId) {
      const chatResult = await createOrFindChat(professionalId)
      if (!Result.isOk(chatResult)) {
        return {
          success: false,
          error: "Error al crear o encontrar el chat",
          details: String(chatResult.error),
        }
      }
      targetChatId = chatResult.value.id
    }

    if (!targetChatId) {
      return { success: false, error: "No se pudo obtener el chat" }
    }

    const input: SendMessageInput = {
      chatId: targetChatId,
      senderId,
      content,
      type: "text",
    }

    const result = await sendMessage(input)
    if (!Result.isOk(result)) {
      return {
        success: false,
        error: "Error al enviar el mensaje",
        details: String(result.error),
      }
    }

    return {
      success: true,
      message: `✅ Mensaje enviado exitosamente`,
      messageId: result.value.id,
      chatId: targetChatId,
    }
  },
})

export const getChatMessagesTool = tool({
  description: "Obtiene los mensajes de un chat específico",
  inputSchema: z.object({
    chatId: z.string().describe("ID del chat"),
    limit: z.number().optional().default(50),
    cursor: z.string().optional().describe("Cursor para paginación"),
  }),
  execute: async ({ chatId, limit, cursor }) => {
    const result = await getMessagesByChatId(chatId, { limit, cursor })
    if (!Result.isOk(result)) {
      return { error: "Error al obtener los mensajes", details: String(result.error) }
    }

    return {
      messages: result.value.data.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        content: m.content,
        type: m.type,
        isRead: m.isRead,
        createdAt: m.createdAt,
      })),
      nextCursor: result.value.nextCursor,
    }
  },
})

export const externalTools = {
  getJobViews: getJobViewsTool,
  createJob: createJobTool,
  updateJob: updateJobTool,
  closeJob: closeJobTool,
  getEventsByOrganization: getEventsByOrganizationTool,
  createEvent: createEventTool,
  updateEvent: updateEventTool,
  updateApplicationStatus: updateApplicationStatusTool,
  getApplicationDetail: getApplicationDetailTool,
  getSubscription: getSubscriptionTool,
  getChatsByRecruiter: getChatsByRecruiterTool,
  sendDirectMessage: sendDirectMessageTool,
  getChatMessages: getChatMessagesTool,
}

export type ExternalTools = typeof externalTools
