import { convertToModelMessages, smoothStream, stepCountIs, type UIMessage } from "ai"
import { headers } from "next/headers"
import type { NextRequest } from "next/server"
import { model, streamText } from "@/lib/ai/provider"
import { externalTools } from "@/lib/ai/tools/external"
import { organizationTools } from "@/lib/ai/tools/organization"
import { auth } from "@/lib/auth"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const {
    messages,
    jobOfferId,
    organizationId,
    recruiterUserId,
  }: {
    messages: UIMessage[]
    jobOfferId?: string
    organizationId?: string
    recruiterUserId?: string
  } = await req.json()

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return Response.json({ error: "No autenticado" }, { status: 401 })
  }

  const sessionUser = session.user as typeof session.user & {
    organizationId?: string
    type?: string
  }
  const resolvedOrganizationId = organizationId ?? sessionUser.organizationId
  const resolvedRecruiterUserId = recruiterUserId ?? session.user.id

  const allTools = {
    ...organizationTools,
    ...externalTools,
  }

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(6),
    experimental_transform: smoothStream({
      delayInMs: 20,
      chunking: "word",
    }),
    tools: allTools,
    system: `Eres un asistente de reclutamiento inteligente para Biovity, una plataforma de empleos científicos en Latinoamérica.
    
Eres un asesor experto que ayuda a organizaciones a gestionar sus ofertas de trabajo y candidatos.
    
Tus capacidades:
1. Consultar y analizar candidatos postulados
2. Gestionar el kanban de candidatos (mover entre etapas)
3. Buscar candidatos por skills en toda la base de datos
4. Enviar mensajes a candidatos
5. Proporcionar estadísticas y métricas
6. Ver detalles de job offers y sus postulaciones
7. Crear y editar ofertas de trabajo
8. Agendar y gestionar eventos (entrevillas)
9. Gestionar suscripciones y planes

Patrón de confirmación:
Cuando un usuario pida hacer una acción destructiva o importante (crear, actualizar, cerrar, enviar mensajes), el agente debe:
1. Resumir la acción que se va a realizar
2. Preguntar confirmación
3. Ejecutar SOLO si el usuario confirma explícitamente (responde "sí", "confirmar", "si", etc.)

Contexto actual:
- Usuario autenticado: ${session.user.email}
- User ID: ${session.user.id}
- Recruiter User ID activo: ${resolvedRecruiterUserId}
- Organization ID activa: ${resolvedOrganizationId ?? "no proporcionada"}
- Job Offer ID activo: ${jobOfferId ?? "no proporcionado"}

Cuando el usuario mencione "esta oferta" o "del job actual" y haya un jobOfferId activo, úsalo.
Si no hay jobOfferId y el usuario pide algo de una oferta específica, pregunta cuál.

Siempre sé proactivo y sugiere siguientes pasos lógicos después de completar acciones.

Idioma: Responde siempre en español, salvo que el usuario pida lo contrario.`,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    sendReasoning: true,
  })
}
