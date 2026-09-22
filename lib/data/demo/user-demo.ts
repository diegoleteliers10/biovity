import { Calendar03Icon, File02Icon, Pulse01Icon } from "@hugeicons/core-free-icons"
import type { Application, ApplicationStatus } from "@/lib/api/applications"
import type { Chat } from "@/lib/api/chats"
import type { Job } from "@/lib/api/jobs"
import type { Message } from "@/lib/api/messages"
import type { User } from "@/lib/api/users"
import type { Metric } from "@/lib/types/dashboard"
import type { JobAlert } from "@/lib/types/job-alert"
import type { UserMetrics } from "@/lib/types/user-metrics"

/**
 * Synthetic fixtures for the public user-dashboard demo on `/`.
 * Every timestamp is derived from load time so the demo always looks fresh.
 * Never present this data as real: the demo frame labels it "Datos de demostración".
 */

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString()
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString()

export const DEMO_USER = {
  name: "Javiera Paredes",
  firstName: "Javiera",
  title: "Biotecnóloga",
}

export const DEMO_USER_METRICS: Metric[] = [
  {
    title: "Total postulaciones",
    value: 12,
    subtitle: "total",
    icon: File02Icon,
  },
  {
    title: "Postulaciones activas",
    value: 4,
    subtitle: "en proceso",
    icon: Calendar03Icon,
  },
  {
    title: "Tasa de respuesta",
    value: "67%",
    subtitle: "respuestas recibidas",
    icon: Pulse01Icon,
  },
]

function application(
  id: string,
  jobId: string,
  title: string,
  status: ApplicationStatus,
  createdAt: string
): Application {
  return {
    id,
    jobId,
    job: { id: jobId, title, organizationId: "demo-org" },
    candidateId: "demo-javiera",
    status,
    createdAt,
    updatedAt: createdAt,
  }
}

export const DEMO_APPLICATIONS: Application[] = [
  application("app-1", "job-2", "Analista QC Microbiología", "entrevista", daysAgo(2)),
  application("app-2", "job-5", "Especialista Bioinformática", "oferta", daysAgo(5)),
  application("app-3", "job-1", "Biotecnólogo/a I+D — Cultivo Celular", "pendiente", daysAgo(7)),
  application("app-4", "job-4", "Técnico de Laboratorio Clínico", "pendiente", daysAgo(12)),
  application("app-5", "job-3", "Investigador/a Preclínico", "rechazado", daysAgo(20)),
]

type DemoChat = Chat & {
  lastMessageFromRecruiter: string | null
  lastMessageFromRecruiterAt: string
  isLoading?: boolean
}

export const DEMO_RECRUITER_NAMES: Record<string, string> = {
  "rec-1": "Camila Rojas · Genomika Labs",
  "rec-2": "Diego Fuenzalida · Litoral Biotech",
  "rec-3": "Valentina Paz · BioAtacama",
}

export const DEMO_CHATS: DemoChat[] = [
  {
    id: "chat-1",
    recruiterId: "rec-1",
    professionalId: "demo-javiera",
    lastMessage: "¿Tienes disponibilidad el jueves a las 10:00?",
    unreadCountRecruiter: 0,
    unreadCountProfessional: 1,
    createdAt: daysAgo(3),
    updatedAt: hoursAgo(2),
    lastMessageFromRecruiter:
      "Hola Javiera, nos interesó tu perfil. ¿Tienes disponibilidad el jueves a las 10:00?",
    lastMessageFromRecruiterAt: hoursAgo(2),
  },
  {
    id: "chat-2",
    recruiterId: "rec-2",
    professionalId: "demo-javiera",
    lastMessage: "Te enviamos la oferta formal por correo.",
    unreadCountRecruiter: 0,
    unreadCountProfessional: 0,
    createdAt: daysAgo(6),
    updatedAt: daysAgo(1),
    lastMessageFromRecruiter:
      "Te enviamos la oferta formal, revisa los términos y cuéntanos qué te parece.",
    lastMessageFromRecruiterAt: daysAgo(1),
  },
  {
    id: "chat-3",
    recruiterId: "rec-3",
    professionalId: "demo-javiera",
    lastMessage: "Gracias por postular, revisaremos tu perfil esta semana.",
    unreadCountRecruiter: 0,
    unreadCountProfessional: 0,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(3),
    lastMessageFromRecruiter: "Gracias por postular, revisaremos tu perfil esta semana.",
    lastMessageFromRecruiterAt: daysAgo(3),
  },
]

export const DEMO_JOBS: Job[] = [
  {
    id: "job-1",
    organizationId: "org-1",
    organization: { id: "org-1", name: "Genomika Labs" },
    title: "Biotecnólogo/a I+D — Cultivo Celular",
    description: "",
    employmentType: "Full-time",
    experienceLevel: "Junior",
    salary: { min: 1_800_000, max: 2_300_000, currency: "CLP", period: "monthly" },
    location: { city: "Santiago", state: "Región Metropolitana", country: "Chile", isHybrid: true },
    status: "publicada",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: "job-2",
    organizationId: "org-2",
    organization: { id: "org-2", name: "BioAtacama" },
    title: "Analista QC Microbiología",
    description: "",
    employmentType: "Full-time",
    experienceLevel: "Mid-Senior",
    salary: { min: 1_500_000, max: 1_800_000, currency: "CLP", period: "monthly" },
    location: { city: "Santiago", state: "Región Metropolitana", country: "Chile" },
    status: "publicada",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    id: "job-3",
    organizationId: "org-3",
    organization: { id: "org-3", name: "Helix Chile" },
    title: "Investigador/a Preclínico",
    description: "",
    employmentType: "Contrato",
    experienceLevel: "Senior",
    salary: { min: 2_400_000, currency: "CLP", period: "monthly" },
    location: { city: "Santiago", country: "Chile", isRemote: true },
    status: "publicada",
    createdAt: daysAgo(7),
    updatedAt: daysAgo(7),
  },
  {
    id: "job-4",
    organizationId: "org-4",
    organization: { id: "org-4", name: "Andina Diagnósticos" },
    title: "Técnico de Laboratorio Clínico",
    description: "",
    employmentType: "Part-time",
    experienceLevel: "Entrante",
    salary: { min: 1_200_000, max: 1_450_000, currency: "CLP", period: "monthly" },
    location: { city: "Viña del Mar", state: "Valparaíso", country: "Chile" },
    status: "publicada",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: "job-5",
    organizationId: "org-5",
    organization: { id: "org-5", name: "Litoral Biotech" },
    title: "Especialista Bioinformática",
    description: "",
    employmentType: "Full-time",
    experienceLevel: "Mid-Senior",
    salary: { min: 2_800_000, max: 3_400_000, currency: "CLP", period: "monthly" },
    location: { country: "Chile", isRemote: true },
    status: "publicada",
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    id: "job-6",
    organizationId: "org-6",
    organization: { id: "org-6", name: "CyanBio" },
    title: "Practicante I+D Alimentos",
    description: "",
    employmentType: "Practica",
    experienceLevel: "Entrante",
    salary: { min: 600_000, currency: "CLP", period: "monthly" },
    location: { city: "Santiago", state: "Región Metropolitana", country: "Chile" },
    status: "publicada",
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(5),
  },
]

/** Jobs pre-marked as saved when the demo mounts. */
export const DEMO_SAVED_JOB_IDS = ["job-1", "job-5"]

export const DEMO_JOB_ALERTS: JobAlert[] = [
  {
    id: "alert-1",
    userId: "demo-javiera",
    keywords: "cultivo celular",
    location: "Santiago",
    category: "biotecnologia",
    frequency: "instantanea",
    createdAt: daysAgo(30).toString(),
    updatedAt: daysAgo(30).toString(),
  },
  {
    id: "alert-2",
    userId: "demo-javiera",
    keywords: null,
    location: "remoto",
    category: null,
    frequency: "semanal",
    createdAt: daysAgo(12).toString(),
    updatedAt: daysAgo(12).toString(),
  },
]

/** Sidebar badges mirroring the live shell (messages unread, applications, saved). */
export const DEMO_USER_NAV_BADGES: Record<string, number> = {
  "/dashboard/messages": 2,
  "/dashboard/applications": 12,
  "/dashboard/saved": 7,
}

/** User objects for the messages showcase (recruiter + Javiera herself). */
function demoUser(
  id: string,
  name: string,
  profession: string | null,
  extra: Partial<User> = {}
): User {
  return {
    id,
    email: `${id}@demo.biovity.cl`,
    name,
    type: "professional",
    isEmailVerified: true,
    isActive: true,
    organizationId: null,
    avatar: null,
    profession,
    birthday: null,
    phone: null,
    location: null,
    notificationPreferences: null,
    createdAt: daysAgo(400),
    updatedAt: daysAgo(5),
    ...extra,
  }
}

export const DEMO_PROFESSIONAL_USER = demoUser("demo-javiera", DEMO_USER.name, "Biotecnóloga")

export const DEMO_RECRUITER_USER = demoUser("rec-1", "Camila Rojas", "Reclutadora I+D", {
  type: "organization",
  organizationId: "org-1",
  organization: { id: "org-1", name: "Genomika Labs" },
})

/** Conversation for the messages showcase (senderId: rec-1 = recruiter side). */
export const DEMO_CHAT_MESSAGES: Message[] = [
  {
    id: "msg-1",
    chatId: "chat-1",
    senderId: "rec-1",
    content:
      "Hola Javiera, vi tu perfil y nos pareció muy interesante tu experiencia en cultivo celular. ¿Tienes disponibilidad para conversar esta semana?",
    type: "text",
    contentType: null,
    isRead: true,
    createdAt: hoursAgo(26),
  },
  {
    id: "msg-2",
    chatId: "chat-1",
    senderId: "demo-javiera",
    content: "¡Hola Camila! Sí, con gusto. ¿Qué día y hora le acomoda al equipo?",
    type: "text",
    contentType: null,
    isRead: true,
    createdAt: hoursAgo(25),
  },
  {
    id: "msg-3",
    chatId: "chat-1",
    senderId: "rec-1",
    content:
      "¿Te parece el jueves a las 10:00? Sería una entrevista de 45 minutos con la jefa de laboratorio.",
    type: "text",
    contentType: null,
    isRead: true,
    createdAt: hoursAgo(3),
  },
  {
    id: "msg-4",
    chatId: "chat-1",
    senderId: "demo-javiera",
    content: "Perfecto, jueves a las 10:00 me funciona. ¿Es presencial o por videollamada?",
    type: "text",
    contentType: null,
    isRead: true,
    createdAt: hoursAgo(2.5),
  },
  {
    id: "msg-5",
    chatId: "chat-1",
    senderId: "rec-1",
    content: "Por Google Meet, te dejo el link en el calendario. ¡Nos vemos el jueves!",
    type: "text",
    contentType: null,
    isRead: false,
    createdAt: hoursAgo(2),
  },
  {
    id: "msg-6",
    chatId: "chat-1",
    senderId: "rec-1",
    content: "",
    type: "event",
    contentType: {
      eventId: "event-1",
      title: "Entrevista técnica — Cultivo Celular",
      description: "45 minutos con la jefa de laboratorio. Revisa el protocolo de la oferta antes.",
      type: "interview",
      startAt: "2026-09-24T10:00:00",
      endAt: "2026-09-24T10:45:00",
      meetingUrl: "https://meet.google.com/demo-biovity",
      status: "confirmed",
      participantStatus: "pending",
      candidateName: DEMO_USER.name,
    },
    isRead: false,
    createdAt: hoursAgo(1.5),
  },
]

/** Full UserMetrics fixture for the metrics showcase (year view). */
const MONTHS_2026 = Array.from(
  { length: 12 },
  (_, i) => `2026-${String(i + 1).padStart(2, "0")}-01`
)
const MONTHLY_APPLICATIONS = [0, 1, 0, 2, 3, 2, 4, 3, 6, 5, 7, 6]

export const DEMO_USER_METRICS_DATA: UserMetrics = {
  quickMetrics: {
    totalApplications: 12,
    activeApplications: 4,
    responseRate: 67,
  },
  kpis: {
    applicationsLast30Days: 6,
    interviews: 3,
    offers: 1,
    avgResponseTimeDays: 2,
    profileViews: 23,
  },
  applicationsTrend: MONTHS_2026.map((date, i) => ({
    date,
    applications: MONTHLY_APPLICATIONS[i],
  })),
  responseTimeDistribution: {
    lessThan24h: 5,
    oneToThreeDays: 4,
    threeToSevenDays: 2,
    moreThanSevenDays: 1,
  },
  statusBreakdown: {
    pendiente: { count: 4, percentage: 33 },
    entrevista: { count: 3, percentage: 25 },
    oferta: { count: 1, percentage: 8 },
    contratado: { count: 0, percentage: 0 },
    rechazado: { count: 3, percentage: 25 },
    desistido: { count: 1, percentage: 8 },
  },
  categoriesApplied: [
    { category: "Biotecnología", count: 5, percentage: 42 },
    { category: "Control de Calidad", count: 3, percentage: 25 },
    { category: "Investigación", count: 2, percentage: 17 },
    { category: "Bioinformática", count: 2, percentage: 17 },
  ],
}
