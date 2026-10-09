import { Result as R, type Result } from "better-result"
import type { ApiError, NetworkError } from "@/lib/errors"
import { fetchJson } from "@/lib/result"

const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")
    : (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001")

export type OfferLetterStatus = "sent" | "accepted" | "rejected"

export type OfferLetterData = {
  companyName: string
  candidateName: string
  jobTitle: string
  logoUrl?: string
  letterRef?: string
  issueDate?: string
  greeting?: string
  intro?: string
  positionSummary?: string
  compensation?: string
  compensationDetail?: string
  benefits?: string[]
  startDate?: string
  workMode?: string
  contractType?: string
  workSchedule?: string
  probationPeriod?: string
  noticePeriod?: string
  vacationDays?: string
  bonusDetails?: string
  offerValidUntil?: string
  conditions?: string
  closing?: string
  acceptanceNote?: string
  signerName?: string
  signerRole?: string
  companyAddress?: string
  hrContactName?: string
  hrContactEmail?: string
  hrContactPhone?: string
}

export type OfferLetter = {
  id: string
  applicationId: string
  jobId: string
  organizationId: string
  candidateId: string
  status: OfferLetterStatus
  title?: string | null
  letterData: OfferLetterData
  chatId?: string | null
  messageId?: string | null
  sentAt: string
  respondedAt?: string | null
  createdAt: string
}

export async function getOfferLettersByApplication(
  applicationId: string
): Promise<Result<OfferLetter[], ApiError | NetworkError>> {
  const result = await fetchJson<{ data?: OfferLetter[] } | OfferLetter[]>(
    `${API_BASE}/api/v1/offer-letters/application/${applicationId}`
  )
  if (result.isErr()) return R.err(result.error)
  const value = result.value
  return R.ok(Array.isArray(value) ? value : (value?.data ?? []))
}

export async function getOfferLetter(
  id: string
): Promise<Result<OfferLetter, ApiError | NetworkError>> {
  const result = await fetchJson<{ data?: OfferLetter } | OfferLetter>(
    `${API_BASE}/api/v1/offer-letters/${id}`
  )
  if (result.isErr()) return R.err(result.error)
  const value = result.value
  const offer =
    value && typeof value === "object" && "data" in value
      ? (value as { data: OfferLetter }).data
      : (value as OfferLetter)
  return R.ok(offer)
}

export async function respondToOfferLetter(
  id: string,
  response: "accepted" | "rejected"
): Promise<Result<OfferLetter, ApiError | NetworkError>> {
  return fetchJson<{ data?: OfferLetter } | OfferLetter>(
    `${API_BASE}/api/v1/offer-letters/${id}/respond`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response }),
    }
  ).then((result) => {
    if (result.isErr()) return R.err(result.error)
    const value = result.value
    const offer =
      value && typeof value === "object" && "data" in value
        ? (value as { data: OfferLetter }).data
        : (value as OfferLetter)
    return R.ok(offer)
  })
}

/** Renders the PDF preview/send bytes via the authenticated Next.js route. */
export async function renderOfferLetterPdf(
  letterData: OfferLetterData
): Promise<Result<Blob, string>> {
  try {
    const res = await fetch("/api/offer-letters/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ letterData }),
    })
    if (!res.ok) {
      const json = (await res.json().catch(() => null)) as { error?: string } | null
      return R.err(json?.error ?? "No se pudo generar el PDF")
    }
    return R.ok(await res.blob())
  } catch (err) {
    return R.err(err instanceof Error ? err.message : "Network error")
  }
}

export type SendOfferLetterResult = {
  offerLetterId: string
  chatId: string | null
  emailed: boolean
}

export async function sendOfferLetter(input: {
  applicationId: string
  title?: string
  letterData: OfferLetterData
}): Promise<Result<SendOfferLetterResult, string>> {
  try {
    const res = await fetch("/api/offer-letters/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
    const json = (await res.json().catch(() => null)) as
      | (SendOfferLetterResult & { error?: string })
      | { error: string }
      | null
    if (!res.ok) {
      return R.err((json as { error?: string })?.error ?? "No se pudo enviar la oferta")
    }
    return R.ok(json as SendOfferLetterResult)
  } catch (err) {
    return R.err(err instanceof Error ? err.message : "Network error")
  }
}

export function offerLetterPdfUrl(offerLetterId: string): string {
  return `/api/offer-letters/${offerLetterId}/pdf`
}
