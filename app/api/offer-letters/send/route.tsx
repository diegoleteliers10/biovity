import { googleFonts } from "@takumi-rs/helpers"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { Resend } from "resend"
import { render } from "takumi-pdf"
import { defaultOfferLetterData, OfferLetterDocument } from "@/components/pdf/offer-letter-document"
import type { OfferLetterData } from "@/lib/api/offer-letters"
import { auth } from "@/lib/auth"
import { fetchJsonWithSession } from "@/lib/result"
import { getSupabaseAdmin } from "@/lib/supabase"

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

// Fonts are fetched once per server instance and cached in module scope.
let fontsPromise: Promise<Awaited<ReturnType<typeof googleFonts>>> | null = null
function getFonts() {
  fontsPromise ??= googleFonts(["Inter"])
  return fontsPromise
}

type SendBody = {
  applicationId?: string
  title?: string
  letterData?: Partial<OfferLetterData>
}

export async function POST(request: Request) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  const organizationId = session?.user?.organizationId
  if (!session?.user?.id || !organizationId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  let body: SendBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }
  const applicationId = body.applicationId
  if (!applicationId) {
    return NextResponse.json({ error: "applicationId requerido" }, { status: 400 })
  }
  const letterData = defaultOfferLetterData(body.letterData ?? {})
  if (!letterData.candidateName || !letterData.jobTitle) {
    return NextResponse.json(
      { error: "letterData requiere candidateName y jobTitle" },
      { status: 400 }
    )
  }

  const supabase = getSupabaseAdmin()

  // 1. Validate the application belongs to this organization and pull the
  // candidate's contact info for the email.
  const { data: application, error: appError } = await supabase
    .from("application")
    .select("id, candidateId, jobId, job:jobId(organizationId, title)")
    .eq("id", applicationId)
    .single()
  if (appError || !application) {
    return NextResponse.json({ error: "Postulación no encontrada" }, { status: 404 })
  }
  const job = application.job as unknown as { organizationId: string; title: string } | null
  if (job?.organizationId !== organizationId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { data: candidate } = await supabase
    .from("user")
    .select("email, name")
    .eq("id", application.candidateId)
    .single()
  if (!candidate?.email) {
    return NextResponse.json({ error: "Candidato sin email" }, { status: 400 })
  }

  // 2. Render the PDF server-side.
  let pdfBytes: Uint8Array
  try {
    pdfBytes = await render(<OfferLetterDocument data={letterData} />, {
      size: "a4",
      fonts: await getFonts(),
    })
  } catch (error) {
    console.error("[offer-letters/send] render failed:", error)
    return NextResponse.json({ error: "No se pudo generar el PDF" }, { status: 500 })
  }

  // 3. Upload to storage (private bucket).
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "biovity_bucket"
  const pdfPath = `offer-letters/${applicationId}/${Date.now()}.pdf`
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(pdfPath, Buffer.from(pdfBytes), { contentType: "application/pdf", upsert: false })
  if (uploadError) {
    console.error("[offer-letters/send] upload failed:", uploadError)
    return NextResponse.json({ error: "No se pudo guardar el PDF" }, { status: 500 })
  }

  // 4. Create the offer letter + chat message on the backend. The backend
  // inserts the chat message (type "offer") from the recruiter, which also
  // produces the candidate's in-app message notification.
  const title = body.title?.trim() || `Carta de oferta - ${job?.title ?? letterData.jobTitle}`
  const createResult = await fetchJsonWithSession<unknown>(
    `${API_BASE}/api/v1/offer-letters`,
    requestHeaders,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId,
        title,
        letterData,
        pdfPath,
      }),
      cache: "no-store",
    }
  )
  if (createResult.isErr()) {
    const status = createResult.error._tag === "ApiError" ? createResult.error.status : 502
    console.error("[offer-letters/send] backend create failed:", createResult.error)
    return NextResponse.json({ error: "No se pudo registrar la oferta" }, { status })
  }
  const offerLetter = unwrapData<{ id: string; chatId: string | null }>(createResult.value)

  // 5. Email the candidate with the PDF attached. Best-effort: the offer is
  // already recorded and visible in chat.
  let emailed = false
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      const resend = new Resend(apiKey)
      const fromEmail = process.env.EMAIL_FROM || "Biovity <no-reply@biovity.cl>"
      await resend.emails.send({
        from: fromEmail,
        to: candidate.email,
        subject: `${title} | Biovity`,
        html: offerEmailHtml({
          candidateName: letterData.candidateName,
          companyName: letterData.companyName,
          jobTitle: letterData.jobTitle,
        }),
        attachments: [
          {
            filename: `Carta de oferta - ${letterData.jobTitle}.pdf`,
            content: Buffer.from(pdfBytes).toString("base64"),
          },
        ],
      })
      emailed = true
    }
  } catch (error) {
    console.error("[offer-letters/send] email failed:", error)
  }

  return NextResponse.json({
    offerLetterId: offerLetter.id,
    chatId: offerLetter.chatId,
    emailed,
  })
}

function unwrapData<T>(value: unknown): T {
  if (value && typeof value === "object" && "data" in value) {
    return (value as { data: T }).data
  }
  return value as T
}

function offerEmailHtml(input: { candidateName: string; companyName: string; jobTitle: string }) {
  const { candidateName, companyName, jobTitle } = input
  return `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #1c2726;">
      <h2 style="color: #0d3d3d;">Tienes una nueva oferta</h2>
      <p>Hola ${candidateName},</p>
      <p><strong>${companyName}</strong> te ha enviado una carta de oferta para el cargo
      <strong>${jobTitle}</strong>. La encuentras adjunta en este correo y también en el chat
      de tu dashboard en Biovity, donde puedes aceptarla o rechazarla.</p>
      <p style="color: #5b6b69; font-size: 13px;">Equipo Biovity</p>
    </div>
  `
}
