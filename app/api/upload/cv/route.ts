import { Result as R } from "better-result"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { getResumeByUserId } from "@/lib/api/resumes"
import { fetchJsonWithSession } from "@/lib/result"
import { auth } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase"

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
const BUCKET = process.env.SUPABASE_CV_BUCKET ?? "biovity_cv"
const MAX_FILE_SIZE = 10 * 1024 * 1024

type Reservation = {
  reservationId: string
  path: string
  version: number
}

function parseReservation(value: unknown, userId: string): Reservation | null {
  if (
    !value ||
    typeof value !== "object" ||
    !("reservationId" in value) ||
    !("path" in value) ||
    !("version" in value)
  ) return null
  const reservationId = value.reservationId
  const path = value.path
  const version = value.version
  if (
    typeof reservationId !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(reservationId) ||
    typeof path !== "string" ||
    path !== `cv/${userId}/${reservationId}.pdf` ||
    typeof version !== "number" ||
    !Number.isSafeInteger(version)
  ) {
    return null
  }
  return { reservationId, path, version }
}

export async function POST(request: Request) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file")
  const resumeId = formData.get("resumeId")
  if (!(file instanceof File) || typeof resumeId !== "string" || !resumeId) {
    return NextResponse.json({ error: "Currículum y archivo requeridos" }, { status: 400 })
  }
  if (
    !file.name.toLowerCase().endsWith(".pdf") ||
    file.size === 0 ||
    file.size > MAX_FILE_SIZE ||
    (file.type && file.type !== "application/pdf")
  ) {
    return NextResponse.json({ error: "Sube un archivo PDF de hasta 10 MiB" }, { status: 400 })
  }

  const filePrefix = new Uint8Array(await file.slice(0, 5).arrayBuffer())
  if (new TextDecoder().decode(filePrefix) !== "%PDF-") {
    return NextResponse.json({ error: "El archivo no contiene un PDF válido" }, { status: 400 })
  }

  const resumeResult = await getResumeByUserId(session.user.id, requestHeaders)
  if (resumeResult.isErr()) {
    const status = resumeResult.error._tag === "ApiError" ? resumeResult.error.status : 502
    return NextResponse.json({ error: "No se pudo cargar el perfil" }, { status })
  }
  const resume = resumeResult.value
  if (!resume || resume.id !== resumeId) {
    return NextResponse.json({ error: "Currículum no encontrado" }, { status: 404 })
  }

  const reservationResult = await fetchJsonWithSession<unknown>(
    `${API_BASE}/api/v1/resumes/${resumeId}/cv-upload-reservations`,
    requestHeaders,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expectedVersion: resume.cvVersion ?? 0 }),
    }
  )
  if (reservationResult.isErr()) {
    const status = reservationResult.error._tag === "ApiError" ? reservationResult.error.status : 502
    return NextResponse.json({ error: "No se pudo reservar la carga del CV" }, { status })
  }
  const reservation = parseReservation(reservationResult.value, session.user.id)
  if (!reservation) {
    return NextResponse.json({ error: "La reserva del CV no es válida" }, { status: 502 })
  }

  const admin = R.try(() => getSupabaseAdmin())
  if (admin.isErr()) {
    return NextResponse.json({ error: "Supabase no está configurado" }, { status: 503 })
  }
  const uploaded = await R.tryPromise({
    try: () =>
      admin.value.storage.from(BUCKET).upload(reservation.path, file, {
        contentType: "application/pdf",
        upsert: false,
      }),
    catch: (cause) => cause,
  })
  if (uploaded.isErr() || uploaded.value.error) {
    return NextResponse.json({ error: "No se pudo guardar el CV" }, { status: 502 })
  }

  const finalized = await fetchJsonWithSession<unknown>(
    `${API_BASE}/api/v1/resumes/${resumeId}/cv-upload-reservations/${reservation.reservationId}/finalize`,
    requestHeaders,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: new URL(
          `/api/cv/signed-url?path=${encodeURIComponent(reservation.path)}`,
          process.env.NEXT_PUBLIC_APP_URL ?? "https://biovity.cl"
        ).toString(),
        originalName: file.name.slice(0, 255),
        mimeType: "application/pdf",
        size: file.size,
      }),
    }
  )
  if (finalized.isErr()) {
    const status = finalized.error._tag === "ApiError" ? finalized.error.status : 502
    return NextResponse.json({ error: "No se pudo guardar el CV en el perfil" }, { status })
  }

  return NextResponse.json(finalized.value)
}
