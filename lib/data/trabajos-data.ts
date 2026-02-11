import type { Trabajo } from "@/lib/types/trabajos"

// Datos de ejemplo para desarrollo
export const TRABAJOS_MOCK: Trabajo[] = [
  {
    id: "1",
    titulo: "Investigador en Biotecnología",
    empresa: "BioTech Solutions",
    ubicacion: "Santiago, Chile",
    modalidad: "hibrido",
    formato: "full-time",
    fechaPublicacion: new Date("2025-01-20"),
    rangoSalarial: {
      min: 2500000,
      max: 3500000,
      moneda: "CLP",
    },
    beneficios: [
      { tipo: "salud", label: "Seguro de salud y dental" },
      { tipo: "vacaciones", label: "Vacaciones pagadas" },
      { tipo: "formacion", label: "Presupuesto para formación" },
      { tipo: "equipo", label: "Equipo y trabajo híbrido" },
    ],
    descripcion:
      "Buscamos un investigador en biotecnología para unirse a nuestro equipo de I+D. El candidato trabajará en proyectos innovadores relacionados con biología molecular y desarrollo de productos biotecnológicos.",
    requisitos: [
      "Título profesional en Biotecnología, Bioquímica o área relacionada",
      "Mínimo 2 años de experiencia en investigación",
      "Conocimientos en técnicas de biología molecular",
      "Trabajo colaborativo y comunicación efectiva",
    ],
    responsabilidades: [
      "Diseñar y ejecutar experimentos de investigación",
      "Analizar resultados y preparar reportes técnicos",
      "Colaborar con equipos multidisciplinarios",
      "Mantener documentación actualizada de proyectos",
    ],
    categoria: "biotecnologia",
    experiencia: "mid",
    slug: "investigador-biotecnologia",
  },
  {
    id: "2",
    titulo: "Especialista en Control de Calidad",
    empresa: "Pharma Solutions",
    ubicacion: "Valparaíso, Chile",
    modalidad: "presencial",
    formato: "full-time",
    fechaPublicacion: new Date("2025-01-18"),
    rangoSalarial: {
      min: 1800000,
      max: 2500000,
      moneda: "CLP",
    },
    beneficios: [
      { tipo: "salud", label: "Seguro de salud" },
      { tipo: "vacaciones", label: "Vacaciones pagadas" },
    ],
    descripcion:
      "Oportunidad para un especialista en control de calidad en laboratorio farmacéutico. Responsable de asegurar que todos los productos cumplan con los estándares de calidad requeridos.",
    requisitos: [
      "Título en Química, Bioquímica o Farmacia",
      "Experiencia en laboratorios de control de calidad",
      "Conocimiento de normativas GMP",
    ],
    responsabilidades: [
      "Realizar análisis de calidad de productos",
      "Documentar resultados según protocolos",
      "Asegurar cumplimiento de normativas",
    ],
    categoria: "quimica",
    experiencia: "junior",
    slug: "especialista-control-calidad",
  },
  {
    id: "3",
    titulo: "Ingeniero de Procesos Químicos",
    empresa: "Chemical Industries",
    ubicacion: "Concepción, Chile",
    modalidad: "remoto",
    formato: "full-time",
    fechaPublicacion: new Date("2025-01-15"),
    rangoSalarial: {
      min: 3000000,
      max: 4000000,
      moneda: "CLP",
    },
    beneficios: [
      { tipo: "salud", label: "Seguro de salud completo" },
      { tipo: "vacaciones", label: "Vacaciones y días personales" },
      { tipo: "formacion", label: "Capacitación continua" },
      { tipo: "equipo", label: "Equipo de trabajo remoto" },
    ],
    descripcion:
      "Buscamos un ingeniero de procesos químicos con experiencia en optimización de procesos industriales. Trabajo remoto con visitas ocasionales a planta.",
    requisitos: [
      "Título en Ingeniería Química",
      "Mínimo 5 años de experiencia",
      "Conocimientos en simulación de procesos",
    ],
    responsabilidades: [
      "Optimizar procesos de producción",
      "Desarrollar mejoras continuas",
      "Supervisar implementación de cambios",
    ],
    categoria: "ingenieria-quimica",
    experiencia: "senior",
    slug: "ingeniero-procesos-quimicos",
  },
  {
    id: "4",
    titulo: "Bioquímico Clínico",
    empresa: "Laboratorio Clínico Central",
    ubicacion: "Santiago, Chile",
    modalidad: "presencial",
    formato: "full-time",
    fechaPublicacion: new Date("2025-01-22"),
    rangoSalarial: {
      min: 2000000,
      max: 2800000,
      moneda: "CLP",
    },
    beneficios: [
      { tipo: "salud", label: "Seguro de salud" },
      { tipo: "vacaciones", label: "Vacaciones pagadas" },
      { tipo: "formacion", label: "Capacitación técnica" },
    ],
    descripcion:
      "Oportunidad para bioquímico clínico en laboratorio de análisis clínicos. Realizar análisis de muestras biológicas y emitir resultados confiables.",
    requisitos: [
      "Título en Bioquímica o Química y Farmacia",
      "Experiencia en laboratorio clínico",
      "Conocimiento de técnicas analíticas",
    ],
    responsabilidades: [
      "Realizar análisis de muestras clínicas",
      "Validar resultados de laboratorio",
      "Mantener equipos y reactivos",
    ],
    categoria: "bioquimica",
    experiencia: "mid",
    slug: "bioquimico-clinico",
  },
  {
    id: "5",
    titulo: "Ingeniero en Alimentos - I+D",
    empresa: "FoodTech Innovations",
    ubicacion: "La Serena, Chile",
    modalidad: "hibrido",
    formato: "full-time",
    fechaPublicacion: new Date("2025-01-19"),
    rangoSalarial: {
      min: 2200000,
      max: 3000000,
      moneda: "CLP",
    },
    beneficios: [
      { tipo: "salud", label: "Seguro de salud" },
      { tipo: "vacaciones", label: "Vacaciones pagadas" },
      { tipo: "equipo", label: "Trabajo híbrido" },
    ],
    descripcion:
      "Buscamos ingeniero en alimentos para área de I+D. Desarrollar nuevos productos alimenticios y mejorar procesos de producción.",
    requisitos: [
      "Título en Ingeniería en Alimentos",
      "Experiencia en desarrollo de productos",
      "Conocimientos en seguridad alimentaria",
    ],
    responsabilidades: [
      "Desarrollar nuevos productos",
      "Optimizar formulaciones",
      "Realizar pruebas de calidad",
    ],
    categoria: "alimentos",
    experiencia: "mid",
    slug: "ingeniero-alimentos-i-d",
  },
]
