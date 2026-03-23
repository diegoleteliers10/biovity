import { BubbleChatIcon, File02Icon, FileAddIcon } from "@hugeicons/core-free-icons"

export type JobOffer = {
  id: string
  title: string
  location: string
  applicationsCount: number
  status: "activa" | "cerrada" | "borrador"
  publishedAt: string
}

export const ORGANIZATION_OFFERS: JobOffer[] = [
  {
    id: "1",
    title: "Investigador en Biotecnología",
    location: "Santiago, Chile",
    applicationsCount: 8,
    status: "activa",
    publishedAt: "28 Feb 2026",
  },
  {
    id: "2",
    title: "Especialista en Control de Calidad",
    location: "Remoto",
    applicationsCount: 12,
    status: "activa",
    publishedAt: "25 Feb 2026",
  },
  {
    id: "3",
    title: "Técnico de Laboratorio Clínico",
    location: "Valparaíso, Chile",
    applicationsCount: 0,
    status: "activa",
    publishedAt: "1 Mar 2026",
  },
]

export const ORGANIZATION_DATA = {
  metrics: [
    {
      title: "Ofertas Activas",
      value: "5",
      icon: FileAddIcon,
      subtitle: "publicadas",
    },
    {
      title: "Aplicaciones Nuevas",
      value: "12",
      icon: File02Icon,
      trend: "+3 esta semana",
      trendPositive: true,
    },
    {
      title: "Mensajes Sin Leer",
      value: "4",
      icon: BubbleChatIcon,
      subtitle: "pendientes",
    },
  ],
  recentApplications: [
    {
      candidateName: "María González",
      position: "Investigador en Biotecnología",
      dateApplied: "4 Mar 2026",
      status: "Nuevo",
      statusColor: "bg-blue-100 text-blue-800",
    },
    {
      candidateName: "Carlos Rodríguez",
      position: "Especialista en Control de Calidad",
      dateApplied: "3 Mar 2026",
      status: "En revisión",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
      candidateName: "Ana Martínez",
      position: "Técnico de Laboratorio",
      dateApplied: "2 Mar 2026",
      status: "Entrevista programada",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      candidateName: "Pedro Sánchez",
      position: "Desarrollador de Productos Farma",
      dateApplied: "1 Mar 2026",
      status: "Nuevo",
      statusColor: "bg-blue-100 text-blue-800",
    },
  ],
  recentMessages: [
    {
      sender: "María González",
      time: "10:30 AM",
      preview: "Gracias por la oportunidad de entrevista...",
    },
    {
      sender: "Carlos Rodríguez",
      time: "9:15 AM",
      preview: "Tengo algunas preguntas sobre el proceso...",
    },
    {
      sender: "Ana Martínez",
      time: "Ayer",
      preview: "Confirmo mi asistencia para mañana...",
    },
  ],
}

export const ORGANIZATION_UPCOMING_INTERVIEWS = [
  {
    id: "1",
    candidateName: "Ana Martínez",
    position: "Técnico de Laboratorio",
    date: "Mañana, 10:00 AM",
    type: "Videollamada",
  },
  {
    id: "2",
    candidateName: "Pedro Sánchez",
    position: "Desarrollador de Productos Farma",
    date: "Jueves, 15:30 PM",
    type: "Presencial",
  },
]

export const ORGANIZATION_FEATURED_CANDIDATES = [
  {
    id: "1",
    name: "Laura Gómez",
    role: "Investigador Senior",
    matchPercentage: 95,
  },
  {
    id: "2",
    name: "Diego Silva",
    role: "Especialista en Control de Calidad",
    matchPercentage: 88,
  },
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchOrgNotifications() {
  await delay(800)
  return [
    {
      id: 1,
      title: "Nueva aplicación recibida",
      message: "María González aplicó a Investigador en Biotecnología",
      time: "Hace 2 horas",
      isRead: false,
      type: "application",
    },
    {
      id: 2,
      title: "Entrevista programada",
      message: "Ana Martínez confirmó entrevista para mañana",
      time: "Hace 4 horas",
      isRead: false,
      type: "interview",
    },
    {
      id: 3,
      title: "Nuevo mensaje",
      message: "Carlos Rodríguez te envió un mensaje",
      time: "Hace 1 día",
      isRead: true,
      type: "recommendation",
    },
  ]
}

export async function fetchOrgMetrics() {
  await delay(800)
  return ORGANIZATION_DATA.metrics
}

export async function fetchOrgRecentApplications() {
  await delay(800)
  return ORGANIZATION_DATA.recentApplications
}

export async function fetchOrgRecentMessages() {
  await delay(800)
  return ORGANIZATION_DATA.recentMessages
}

export async function fetchOrgUpcomingInterviews() {
  await delay(800)
  return ORGANIZATION_UPCOMING_INTERVIEWS
}

export async function fetchOrgFeaturedCandidates() {
  await delay(800)
  return ORGANIZATION_FEATURED_CANDIDATES
}

