import { googleFonts } from "@takumi-rs/helpers"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { render } from "takumi-pdf"
import { defaultOfferLetterData, OfferLetterDocument } from "@/components/pdf/offer-letter-document"
import type { OfferLetterData } from "@/lib/api/offer-letters"
import { auth } from "@/lib/auth"

// Reuse the font fetch across renders: Google Fonts fetch per request would
// add hundreds of ms to every preview.
let fontsPromise: Promise<Awaited<ReturnType<typeof googleFonts>>> | null = null
function getFonts() {
  fontsPromise ??= googleFonts(["Inter"])
  return fontsPromise
}

export async function POST(request: Request) {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  let body: { letterData?: Partial<OfferLetterData> }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }
  const letterData = defaultOfferLetterData(body.letterData ?? {})
  if (!letterData.companyName || !letterData.candidateName || !letterData.jobTitle) {
    return NextResponse.json(
      { error: "Faltan companyName, candidateName o jobTitle" },
      { status: 400 }
    )
  }

  try {
    const pdf = await render(<OfferLetterDocument data={letterData} />, {
      size: "a4",
      fonts: await getFonts(),
    })
    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="carta-oferta.pdf"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("[offer-letters/pdf] render failed:", error)
    return NextResponse.json({ error: "No se pudo generar el PDF" }, { status: 500 })
  }
}
