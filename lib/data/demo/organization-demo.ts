import { Calendar03Icon, File02Icon, FileAddIcon } from "@hugeicons/core-free-icons"
import type { CandidateScore } from "@/app/api/ai/score-candidates/route"
import type { Chat } from "@/lib/api/chats"
import type { Job } from "@/lib/api/jobs"
import type {
  Applicant,
  ApplicationStage,
  Metric,
  OrganizationRecentApplication,
} from "@/lib/types/dashboard"

/**
 * Synthetic fixtures for the public organization-dashboard demo on `/companies`.
 * Mirrors the shapes produced by lib/api/use-organization-dashboard so the real
 * presentational cards render exactly as they do for a logged-in recruiter.
 * The demo frame labels all of this as "Datos de demostración".
 */

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString()
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString()

const dateApplied = (d: number) =>
  new Date(Date.now() - d * 86_400_000).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

export const DEMO_ORG = {
  name: "Genomika Labs",
  recruiter: { name: "Camila Rojas", title: "Reclutamiento" },
}

export const DEMO_ORG_METRICS: Metric[] = [
  {
    title: "Ofertas Activas",
    value: 4,
    icon: FileAddIcon,
    subtitle: "publicadas",
  },
  {
    title: "Postulaciones Nuevas",
    value: 18,
    icon: File02Icon,
    trend: "+32%",
    trendPositive: true,
    subtitle: "este mes",
  },
  {
    title: "Entrevistas",
    value: 6,
    icon: Calendar03Icon,
    trend: "+20%",
    trendPositive: true,
    subtitle: "este mes",
  },
]

export const DEMO_ORG_APPLICATIONS: OrganizationRecentApplication[] = [
  {
    candidateName: "Josefa Muñoz",
    position: "Analista QC Microbiología",
    dateApplied: dateApplied(1),
    status: "pendiente",
    statusColor: "bg-secondary/10 text-secondary",
  },
  {
    candidateName: "Matías Contreras",
    position: "Biotecnólogo/a I+D — Cultivo Celular",
    dateApplied: dateApplied(2),
    status: "entrevista",
    statusColor: "bg-primary/10 text-primary",
  },
  {
    candidateName: "Rocío Vera",
    position: "Especialista Bioinformática",
    dateApplied: dateApplied(3),
    status: "oferta",
    statusColor: "bg-yellow-500/10 text-yellow-700",
  },
  {
    candidateName: "Tomás Herrera",
    position: "Analista QC Microbiología",
    dateApplied: dateApplied(5),
    status: "pendiente",
    statusColor: "bg-secondary/10 text-secondary",
  },
  {
    candidateName: "Isidora Salas",
    position: "Biotecnólogo/a I+D — Cultivo Celular",
    dateApplied: dateApplied(6),
    status: "rechazado",
    statusColor: "bg-destructive/10 text-destructive",
  },
]

type DemoOrgChat = Chat & {
  lastMessageFromRecruiter: string | null
  lastMessageFromRecruiterAt: string
  isLoading?: boolean
}

export const DEMO_CANDIDATE_NAMES: Record<string, string> = {
  "cand-1": "Matías Contreras",
  "cand-2": "Rocío Vera",
  "cand-3": "Josefa Muñoz",
}

export const DEMO_ORG_CHATS: DemoOrgChat[] = [
  {
    id: "chat-o-1",
    recruiterId: "demo-recruiter",
    professionalId: "cand-1",
    lastMessage: "Perfecto, me funciona el jueves a las 10:00.",
    unreadCountRecruiter: 1,
    unreadCountProfessional: 0,
    createdAt: daysAgo(4),
    updatedAt: hoursAgo(3),
    lastMessageFromRecruiter: "Perfecto, me funciona el jueves a las 10:00.",
    lastMessageFromRecruiterAt: hoursAgo(3),
  },
  {
    id: "chat-o-2",
    recruiterId: "demo-recruiter",
    professionalId: "cand-2",
    lastMessage: "Sí, la oferta me interesa, ¿cuándo conversamos?",
    unreadCountRecruiter: 0,
    unreadCountProfessional: 0,
    createdAt: daysAgo(8),
    updatedAt: daysAgo(1),
    lastMessageFromRecruiter: "Sí, la oferta me interesa, ¿cuándo conversamos?",
    lastMessageFromRecruiterAt: daysAgo(1),
  },
  {
    id: "chat-o-3",
    recruiterId: "demo-recruiter",
    professionalId: "cand-3",
    lastMessage: "Adjunto mi CV actualizado con la práctica en QC.",
    unreadCountRecruiter: 2,
    unreadCountProfessional: 0,
    createdAt: daysAgo(12),
    updatedAt: daysAgo(2),
    lastMessageFromRecruiter: "Adjunto mi CV actualizado con la práctica en QC.",
    lastMessageFromRecruiterAt: daysAgo(2),
  },
]

function orgJob(id: string, title: string, isRemote = false): Job {
  return {
    id,
    organizationId: "demo-org-genomika",
    organization: { id: "demo-org-genomika", name: DEMO_ORG.name },
    title,
    description: "",
    employmentType: "Full-time",
    experienceLevel: "Mid-Senior",
    location: isRemote
      ? { country: "Chile", isRemote: true }
      : { city: "Santiago", state: "Región Metropolitana", country: "Chile", isHybrid: true },
    salary: { min: 1_800_000, max: 2_400_000, currency: "CLP", period: "monthly" },
    status: "publicada",
    createdAt: daysAgo(9),
    updatedAt: daysAgo(9),
  }
}

export const DEMO_ORG_JOBS: Job[] = [
  orgJob("ojob-1", "Biotecnólogo/a I+D — Cultivo Celular"),
  orgJob("ojob-2", "Analista QC Microbiología"),
  orgJob("ojob-3", "Especialista Bioinformática", true),
  orgJob("ojob-4", "Técnico de Laboratorio Clínico"),
]

function applicant(
  id: string,
  candidateName: string,
  position: string,
  stage: ApplicationStage,
  days: number,
  extra: Partial<Applicant> = {}
): Applicant {
  return {
    id,
    candidateId: `cand-${id}`,
    candidateName,
    position,
    dateApplied: dateApplied(days),
    stage,
    ...extra,
  }
}

const TAG = (id: string, name: string, color: string) => ({ id, name, color })

/** Applicants per job (keyed by DEMO_ORG_JOBS id) shown in the demo pipeline. */
export const DEMO_KANBAN_BY_JOB: Record<string, Applicant[]> = {
  "ojob-1": [
    applicant("a-1", "Matías Contreras", "Biotecnólogo/a I+D", "entrevista", 2, {
      isSaved: true,
      salaryMin: 2_000_000,
      salaryMax: 2_300_000,
      tags: [TAG("t-msc", "MSc Biotec", "#006b5e"), TAG("t-hplc", "HPLC", "#8483d4")],
    }),
    applicant("a-2", "Isidora Salas", "Biotecnólogo/a I+D", "pendiente", 1, {
      salaryMin: 1_900_000,
      tags: [TAG("t-qc", "QC", "#0369a1")],
    }),
    applicant("a-3", "Cristián Barra", "Biotecnólogo/a I+D", "oferta", 6, {
      salaryMin: 2_100_000,
      salaryMax: 2_400_000,
      tags: [TAG("t-cel", "Cultivo celular", "#006b5e")],
    }),
    applicant("a-4", "Paula Undurraga", "Biotecnólogo/a I+D", "contratado", 15, {
      salaryMin: 2_200_000,
    }),
    applicant("a-5", "Felipe Carrasco", "Biotecnólogo/a I+D", "rechazado", 9, {}),
    applicant("a-6", "Antonia Riquelme", "Biotecnólogo/a I+D", "pendiente", 3, {
      isSaved: true,
      tags: [TAG("t-msc", "MSc Biotec", "#006b5e"), TAG("t-pcr", "qPCR", "#8483d4")],
    }),
  ],
  "ojob-2": [
    applicant("b-1", "Josefa Muñoz", "Analista QC", "pendiente", 1, {
      tags: [TAG("t-qc", "QC", "#0369a1")],
    }),
    applicant("b-2", "Tomás Herrera", "Analista QC", "pendiente", 5, {}),
    applicant("b-3", "Daniela Fuentealba", "Analista QC", "entrevista", 4, {
      isSaved: true,
      tags: [TAG("t-micro", "Microbiología", "#006b5e")],
    }),
    applicant("b-4", "Sebastián Lillo", "Analista QC", "rechazado", 10, {}),
  ],
  "ojob-3": [
    applicant("c-1", "Rocío Vera", "Bioinformática", "oferta", 3, {
      isSaved: true,
      salaryMin: 3_000_000,
      salaryMax: 3_300_000,
      tags: [TAG("t-python", "Python", "#0369a1"), TAG("t-ngs", "NGS", "#8483d4")],
    }),
    applicant("c-2", "Andrés Peña", "Bioinformática", "entrevista", 5, {
      salaryMin: 2_900_000,
    }),
    applicant("c-3", "Gabriela Núñez", "Bioinformática", "pendiente", 2, {}),
  ],
  "ojob-4": [
    applicant("d-1", "Vicente Araya", "Técnico Lab. Clínico", "pendiente", 2, {}),
    applicant("d-2", "Millaray Sandoval", "Técnico Lab. Clínico", "entrevista", 6, {}),
  ],
}

/** Pre-seeded AI scores displayed on the kanban cards (getScore callback shape). */
export const DEMO_AI_SCORES: Record<string, CandidateScore> = {
  "cand-a-1": {
    candidateId: "cand-a-1",
    score: 92,
    label: "Excelente",
    reason:
      "Experiencia directa en cultivo celular y HPLC alineada con los requisitos de la oferta.",
    strengths: ["5 años en cultivo celular", "Manejo de HPLC", "Magíster en Biotecnología"],
    gaps: ["Sin experiencia en GMP"],
    recommendation: "Avanzar",
  },
  "cand-a-6": {
    candidateId: "cand-a-6",
    score: 78,
    label: "Bueno",
    reason: "Perfil sólido en qPCR y análisis de datos; le falta experiencia en biorreactores.",
    strengths: ["qPCR avanzado", "Publicaciones en revistas indexadas"],
    gaps: ["Sin manejo de biorreactores"],
    recommendation: "Avanzar",
  },
  "cand-b-3": {
    candidateId: "cand-b-3",
    score: 61,
    label: "Regular",
    reason:
      "Cumple requisitos base de microbiología, pero con poca experiencia en control de calidad formal.",
    strengths: ["Práctica en laboratorio clínico"],
    gaps: ["Poca experiencia en QC", "Sin certificación ISO 17025"],
    recommendation: "Evaluar",
  },
  "cand-c-1": {
    candidateId: "cand-c-1",
    score: 88,
    label: "Excelente",
    reason:
      "Pipelines NGS y Python productivo; encaja directo con lo que busca el rol de bioinformática.",
    strengths: ["Pipelines NGS propios", "Python/R", "Trabajo con equipos I+D"],
    gaps: ["Inglés técnico intermedio"],
    recommendation: "Avanzar",
  },
  "cand-c-3": {
    candidateId: "cand-c-3",
    score: 43,
    label: "Bajo",
    reason: "Perfil orientado a datos clínicos más que a bioinformática de investigación.",
    strengths: ["Bases de SQL"],
    gaps: ["Sin experiencia NGS", "Sin Python productivo"],
    recommendation: "Descartar",
  },
}

/** Sidebar badges mirroring the live organization shell. */
export const DEMO_ORG_NAV_BADGES: Record<string, number> = {
  "/dashboard/applications": 6,
  "/dashboard/messages": 3,
}

/** Onboarding checklist state (2 of 4 done) for the demo home. */
export const DEMO_ONBOARDING_DONE = ["complete_profile", "create_offer"]

/** Upcoming interviews shown in the demo home placeholder card. */
export const DEMO_UPCOMING_INTERVIEWS = [
  {
    id: "int-1",
    candidateName: "Matías Contreras",
    date: "Jue 24 sept",
    time: "10:00",
    position: "Biotecnólogo/a I+D — Cultivo Celular",
    type: "Google Meet",
  },
  {
    id: "int-2",
    candidateName: "Andrés Peña",
    date: "Vie 26 sept",
    time: "15:30",
    position: "Especialista Bioinformática",
    type: "Presencial",
  },
]

/** Pending-application alert row shown in the demo "Acción Requerida" card. */
export const DEMO_ACCION_REQUERIDA = [
  {
    jobId: "ojob-2",
    title: "Analista QC Microbiología",
    count: 2,
    daysSince: 6,
  },
]
