import { Result as R } from "better-result"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"
import type { OfferLetterData } from "@/lib/api/offer-letters"
import { auth } from "@/lib/auth"
import { enqueueEmail } from "@/lib/email-outbox"
import { renderOfferLetterToPdf } from "@/lib/offer-letter-pdf"
import { fetchJsonWithSession } from "@/lib/result"
import { getSupabaseAdmin } from "@/lib/supabase"

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
const ResendSchema = z.object({ expiresOn: z.string().date() })

type OfferLetterRecord = {
  id: string
  applicationId: string
  organizationId: string
  candidateId: string
  title: string | null
  pdfPath: string | null
  letterData: OfferLetterData
}

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }
    return entities[character]
  })

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session?.user?.id || !session.user.organizationId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const bodyResult = await R.tryPromise(() => request.json())
  if (bodyResult.isErr()) return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 })
  const parsed = ResendSchema.safeParse(bodyResult.value)
  if (!parsed.success) return NextResponse.json({ error: "Fecha inválida" }, { status: 400 })

  const { id } = await context.params
  const offerResult = await fetchJsonWithSession<OfferLetterRecord>(
    `${API_BASE}/api/v1/offer-letters/${id}`,
    requestHeaders,
    { cache: "no-store" }
  )
  if (offerResult.isErr()) {
    const status = offerResult.error._tag === "ApiError" ? offerResult.error.status : 502
    return NextResponse.json({ error: "No se pudo cargar la oferta" }, { status })
  }
  const offer = offerResult.value
  const letterData = { ...offer.letterData, offerValidUntil: parsed.data.expiresOn }
  const pdfResult = await R.tryPromise(() => renderOfferLetterToPdf(letterData))
  if (pdfResult.isErr()) {
    return NextResponse.json({ error: "No se pudo generar el PDF" }, { status: 500 })
  }

  const supabase = getSupabaseAdmin()
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "biovity_bucket"
  const pdfPath = `offer-letters/${offer.applicationId}/${crypto.randomUUID()}.pdf`
  const uploadResult = await supabase.storage
    .from(bucket)
    .upload(pdfPath, Buffer.from(pdfResult.value), {
      contentType: "application/pdf",
      upsert: false,
    })
  if (uploadResult.error) {
    return NextResponse.json({ error: "No se pudo guardar el PDF" }, { status: 500 })
  }

  const resent = await fetchJsonWithSession<unknown>(
    `${API_BASE}/api/v1/offer-letters/${id}/resend`,
    requestHeaders,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...parsed.data, pdfPath }),
      cache: "no-store",
    }
  )
  if (resent.isErr()) {
    const status = resent.error._tag === "ApiError" ? resent.error.status : 502
    if (resent.error._tag === "ApiError" && status < 500) {
      await supabase.storage.from(bucket).remove([pdfPath])
    }
    return NextResponse.json({ error: "No se pudo reenviar la oferta" }, { status })
  }

  const candidateResult = await supabase
    .from("user")
    .select("email")
    .eq("id", offer.candidateId)
    .single()
  const candidateEmail = candidateResult.data?.email
  if (!candidateEmail) {
    return NextResponse.json({ emailQueued: false, chatNotified: true })
  }

  const emailResult = await R.tryPromise(() =>
    enqueueEmail({
      type: "offer_letter",
      recipientUserId: offer.candidateId,
      to: candidateEmail,
      subject: `${offer.title ?? "Carta de oferta"} | Biovity`,
      html: `<p>Hola ${escapeHtml(letterData.candidateName)}, la empresa reenvió tu carta de oferta. Revísala en el chat de Biovity.</p>`,
      attachments: [
        {
          filename: `Carta de oferta - ${offer.letterData.jobTitle ?? "oferta"}.pdf`,
          content: Buffer.from(pdfResult.value).toString("base64"),
        },
      ],
    })
  )
  return NextResponse.json({
    emailQueued: emailResult.isOk() && emailResult.value,
    chatNotified: true,
  })
}
