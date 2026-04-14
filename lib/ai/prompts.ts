import type { AIActionType, CandidateContext } from "./types"

export function getSystemPrompt(action: AIActionType): string {
  const systemPrompts: Record<AIActionType, string> = {
    summarize_candidates:
      "Eres un asistente experto en reclutamiento para el sector científico y biotecnológico latinoamericano. Eres directo, objetivo y útil.",
    generate_reply:
      "Eres un asistente de comunicación profesional para una plataforma de empleos científicos. Escribes respuestas naturales y concisas.",
    generate_job_description:
      "Eres un experto en recursos humanos del sector biotecnológico y científico en LATAM. Redactas descripciones de trabajo atractivas y profesionales.",
    enhance_profile:
      "Eres un coach de carrera especializado en el sector científico y biotecnológico. Mejoras perfiles profesionales para maximizar su atractivo ante reclutadores.",
    generate_cover_letter:
      "Eres un experto en comunicación profesional para el sector científico. Escribes cartas de presentación personalizadas y efectivas.",
    generate_interview_questions:
      "Eres un experto en selección de talento científico y biotecnológico. Generas preguntas de entrevista estrategias y relevantes.",
    score_candidate_fit: "Eres un sistema de scoring objetivo. Responde solo con JSON.",
  }

  return systemPrompts[action]
}

export function buildPrompt(dto: {
  action: AIActionType
  context: Record<string, unknown>
}): string {
  const ctx = dto.context

  switch (dto.action) {
    case "summarize_candidates": {
      const jobTitle = ctx.jobTitle as string
      const jobDescription = ctx.jobDescription as string
      const requiredSkills = (ctx.requiredSkills as string[]) ?? []
      const minExperience = ctx.minExperience as number
      const candidates = (ctx.candidates as CandidateContext[]) ?? []

      return `
        JOB OFFER:
        Título: ${jobTitle}
        Descripción: ${jobDescription}
        Skills requeridos: ${requiredSkills.join(", ")}
        Experiencia mínima: ${minExperience} años

        CANDIDATOS POSTULADOS:
        ${candidates
          .map(
            (c, i) => `
        ${i + 1}. ${c.name}
           - Formación: ${c.education}
           - Skills: ${(c.skills ?? []).join(", ")}
           - Experiencia: ${c.yearsOfExperience} años
           - Bio: ${c.bio}
        `
          )
          .join("\n")}

        Genera un análisis ejecutivo de cada candidato con:
        - **Fit Score** estimado (1-10) justificado en una línea
        - **Fortalezas clave** respecto al rol (2-3 puntos)
        - **Posibles gaps** a evaluar en entrevista (1-2 puntos)
        - **Recomendación**: Avanzar / Evaluar con cautela / Descartar

        Formato markdown. Sé directo y útil.
      `
    }

    case "generate_reply": {
      const conversationHistory = ctx.conversationHistory as
        | { content: string; senderRole: string }[]
        | undefined
      const messageToReply = ctx.messageToReply as string
      const userRole = ctx.userRole as string
      const tone = (ctx.tone as string) ?? "profesional y amigable"

      return `
        Historial de conversación:
        ${conversationHistory?.map((m) => `${m.senderRole}: "${m.content}"`).join("\n") ?? "Sin historial previo"}

        Mensaje a responder: "${messageToReply}"
        Rol del usuario que responde: ${userRole}
        Tono: ${tone}

        Escribe solo el texto de la respuesta, sin comillas ni explicaciones.
      `
    }

    case "generate_job_description": {
      const jobTitle = ctx.jobTitle as string
      const companyName = ctx.companyName as string
      const area = ctx.area as string
      const skills = (ctx.skills as string[]) ?? []
      const contractType = ctx.contractType as string
      const modality = ctx.modality as string
      const sector = ctx.sector as string
      const currentDescription = (ctx.currentDescription as string | undefined) ?? ""

      const baseInfo = `
Información del rol:
- Título: ${jobTitle}
- Empresa: ${companyName}
- Área: ${area}
- Skills requeridos: ${skills.join(", ") || "No especificados"}
- Tipo de contrato: ${contractType || "No especificado"}
- Modalidad: ${modality || "No especificada"}
- Sector: ${sector}
`

      if (currentDescription.trim()) {
        return `${baseInfo}
DESCRIPCIÓN ACTUAL A MEJORAR:
${currentDescription}

Tarea: Lee la descripción actual y reescríbela mejorándola significativamente. Mantén toda la información real pero exprésala de forma más profesional, clara y con saltos de párrafo claros entre secciones.

Reglas:
- Responde únicamente en formato markdown válido
- Toda la respuesta debe ser completamente en español, sin palabras en otros idiomas
- Conserva toda la información real de la descripción original sin inventar datos
- Mejora estructura, claridad y tono profesional
- Usa saltos de párrafo para separar secciones (no juntes todo en un bloque)
- Usa puntuación correcta: punto final en oraciones, comas donde corresponda, dos puntos antes de listas
- No uses emojis, iconos ni caracteres especiales decorativos
- Usa listas markdown con guiones (-) o números para enumerar elementos
- No uses frases decorativas entre guiones ni negritas decorativas
- Usa encabezados markdown (##) para separar secciones principales
`
      }

      return `${baseInfo}
Redacta una descripción de trabajo que incluya:
1. Resumen del rol (2-3 oraciones)
2. Responsabilidades principales (5-7 puntos separados por oraciones completas)
3. Requisitos obligatorios y deseables (en párrafos separados)
4. Lo que ofrecemos
5. Llamado a la acción para postular

Reglas:
- Responde únicamente en formato markdown válido
- Toda la respuesta debe ser completamente en español, sin palabras en otros idiomas
- Usa saltos de párrafo para separar cada sección claramente
- Usa puntuación correcta: punto final en oraciones, comas donde corresponda, dos puntos antes de listas
- No uses emojis, iconos ni caracteres decorativos
- Usa listas markdown con guiones (-) o números para enumerar elementos
- No uses frases decorativas entre guiones
- Tono profesional pero cercano. Orientado al sector científico latinoamericano.
- Usa encabezados markdown (##) para separar secciones
`
    }

    case "enhance_profile": {
      const name = ctx.name as string
      const education = ctx.education as string
      const yearsOfExperience = ctx.yearsOfExperience as number
      const skills = (ctx.skills as string[]) ?? []
      const currentBio = ctx.currentBio as string
      const targetRole = ctx.targetRole as string

      return `
        Perfil actual del candidato:
        - Nombre: ${name}
        - Formación: ${education}
        - Experiencia: ${yearsOfExperience} años
        - Skills: ${skills.join(", ")}
        - Bio actual: "${currentBio}"
        - Tipo de rol buscado: ${targetRole}

        Reescribe el bio para que sea más atractivo a reclutadores del sector científico.
        Requisitos:
        - Entre 80-120 palabras
        - Lenguaje activo y profesional
        - Menciona especialización técnica relevante
        - Termina con lo que el candidato busca

        Devuelve solo el bio mejorado, sin explicaciones ni comillas.
      `
    }

    case "generate_cover_letter": {
      const companyName = ctx.companyName as string
      const jobTitle = ctx.jobTitle as string
      const jobDescription = ctx.jobDescription as string
      const requiredSkills = (ctx.requiredSkills as string[]) ?? []
      const candidateName = ctx.candidateName as string
      const education = ctx.education as string
      const yearsOfExperience = ctx.yearsOfExperience as number
      const specialization = ctx.specialization as string
      const skills = (ctx.skills as string[]) ?? []

      return `
        JOB OFFER:
        Empresa: ${companyName}
        Cargo: ${jobTitle}
        Descripción: ${jobDescription}
        Skills clave: ${requiredSkills.join(", ")}

        CANDIDATO:
        Nombre: ${candidateName}
        Formación: ${education}
        Experiencia: ${yearsOfExperience} años en ${specialization}
        Skills: ${skills.join(", ")}

        Conecta directamente las habilidades del candidato con las necesidades del cargo.
        Estructura: apertura impactante · 2 párrafos de cuerpo · cierre con call to action.
        Solo el texto de la carta. Sin "Estimado/a" ni título.
      `
    }

    case "generate_interview_questions": {
      const jobTitle = ctx.jobTitle as string
      const requiredSkills = (ctx.requiredSkills as string[]) ?? []
      const area = ctx.area as string
      const candidateName = ctx.candidateName as string
      const education = ctx.education as string
      const yearsOfExperience = ctx.yearsOfExperience as number
      const skills = (ctx.skills as string[]) ?? []
      const bio = ctx.bio as string

      return `
        ROL A CUBRIR:
        Título: ${jobTitle}
        Skills requeridos: ${requiredSkills.join(", ")}
        Área: ${area}

        CANDIDATO:
        Nombre: ${candidateName}
        Formación: ${education}
        Años de experiencia: ${yearsOfExperience}
        Skills declarados: ${skills.join(", ")}
        Bio: ${bio}

        Genera 10 preguntas de entrevista divididas en:
        - **Técnicas** (5): validar conocimiento y experiencia del área
        - **Situacionales** (3): evaluar resolución de problemas reales
        - **Culturales** (2): evaluar fit con equipo y sector científico

        Para cada pregunta indica entre paréntesis qué evalúas. Formato markdown.
      `
    }

    default:
      return ""
  }
}
