import type { OfferWithApplicants } from "@/lib/types/dashboard"

export const OFFERS_WITH_APPLICANTS: OfferWithApplicants[] = [
  {
    id: "1",
    title: "Investigador en Biotecnología",
    location: "Santiago, Chile",
    status: "activa",
    publishedAt: "28 Feb 2026",
    applicants: [
      {
        id: "a1",
        candidateName: "María González",
        position: "Investigador en Biotecnología",
        dateApplied: "4 Mar 2026",
        stage: "pendiente",
      },
      {
        id: "a2",
        candidateName: "Carlos Rodríguez",
        position: "Investigador en Biotecnología",
        dateApplied: "3 Mar 2026",
        stage: "entrevista",
      },
      {
        id: "a3",
        candidateName: "Ana Martínez",
        position: "Investigador en Biotecnología",
        dateApplied: "2 Mar 2026",
        stage: "oferta",
      },
      {
        id: "a4",
        candidateName: "Pedro Sánchez",
        position: "Investigador en Biotecnología",
        dateApplied: "1 Mar 2026",
        stage: "contratado",
      },
      {
        id: "a5",
        candidateName: "Laura Fernández",
        position: "Investigador en Biotecnología",
        dateApplied: "28 Feb 2026",
        stage: "rechazado",
      },
    ],
  },
  {
    id: "2",
    title: "Especialista en Control de Calidad",
    location: "Remoto",
    status: "activa",
    publishedAt: "25 Feb 2026",
    applicants: [
      {
        id: "b1",
        candidateName: "Roberto Díaz",
        position: "Especialista en Control de Calidad",
        dateApplied: "3 Mar 2026",
        stage: "pendiente",
      },
      {
        id: "b2",
        candidateName: "Carmen López",
        position: "Especialista en Control de Calidad",
        dateApplied: "2 Mar 2026",
        stage: "entrevista",
      },
      {
        id: "b3",
        candidateName: "Jorge Muñoz",
        position: "Especialista en Control de Calidad",
        dateApplied: "1 Mar 2026",
        stage: "rechazado",
      },
    ],
  },
  {
    id: "3",
    title: "Técnico de Laboratorio Clínico",
    location: "Valparaíso, Chile",
    status: "activa",
    publishedAt: "1 Mar 2026",
    applicants: [],
  },
]
