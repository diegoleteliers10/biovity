import { Calendar03Icon, File02Icon, Pulse01Icon } from "@hugeicons/core-free-icons"
import type { Application, ApplicationStatus } from "@/lib/api/applications"
import type { Chat } from "@/lib/api/chats"
import type { Job } from "@/lib/api/jobs"
import type { Metric } from "@/lib/types/dashboard"
import type { JobAlert } from "@/lib/types/job-alert"

/**
 * Synthetic fixtures for the public user-dashboard demo on `/`.
 * Every timestamp is derived from load time so the demo always looks fresh.
 * Never present this data as real: the demo frame labels it "Datos de demostración".
 */

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString()
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString()

export const DEMO_USER = {
  name: "Aline Larroucau",
  firstName: "Aline",
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
    candidateId: "demo-aline",
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
    professionalId: "demo-aline",
    lastMessage: "¿Tienes disponibilidad el jueves a las 10:00?",
    unreadCountRecruiter: 0,
    unreadCountProfessional: 1,
    createdAt: daysAgo(3),
    updatedAt: hoursAgo(2),
    lastMessageFromRecruiter:
      "Hola Aline, nos interesó tu perfil. ¿Tienes disponibilidad el jueves a las 10:00?",
    lastMessageFromRecruiterAt: hoursAgo(2),
  },
  {
    id: "chat-2",
    recruiterId: "rec-2",
    professionalId: "demo-aline",
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
    professionalId: "demo-aline",
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
    userId: "demo-aline",
    keywords: "cultivo celular",
    location: "Santiago",
    category: "biotecnologia",
    frequency: "instantanea",
    createdAt: daysAgo(30).toString(),
    updatedAt: daysAgo(30).toString(),
  },
  {
    id: "alert-2",
    userId: "demo-aline",
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
