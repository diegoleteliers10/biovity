import { googleFonts } from "@takumi-rs/helpers"
import { render } from "takumi-pdf"
import { defaultOfferLetterData, OfferLetterDocument } from "@/components/pdf/offer-letter-document"
import type { OfferLetterData } from "@/lib/api/offer-letters"

// Google Fonts fetch once per server instance: doing it per render adds
// hundreds of ms to every preview.
let fontsPromise: Promise<Awaited<ReturnType<typeof googleFonts>>> | null = null
function getFonts() {
  fontsPromise ??= googleFonts(["Inter"])
  return fontsPromise
}

type RenderedImage = { src: string; data: Uint8Array }

const imageCache = new Map<string, RenderedImage>()

/**
 * takumi-pdf never fetches image URLs: the bytes must be passed in. Logos are
 * cached per URL so repeated previews do not re-download the same file.
 */
async function resolveImages(logoUrl?: string): Promise<RenderedImage[]> {
  if (!logoUrl) return []
  const cached = imageCache.get(logoUrl)
  if (cached) return [cached]
  try {
    const response = await fetch(logoUrl)
    if (!response.ok) {
      console.warn(`[offer-letter-pdf] logo request failed: ${response.status}`)
      return []
    }
    const entry = {
      src: logoUrl,
      data: new Uint8Array(await response.arrayBuffer()),
    }
    imageCache.set(logoUrl, entry)
    return [entry]
  } catch (error) {
    console.warn("[offer-letter-pdf] logo could not be loaded:", error)
    return []
  }
}

/** Renders the offer letter to PDF bytes. Server-only. */
export async function renderOfferLetterToPdf(
  rawData: Partial<OfferLetterData>
): Promise<Uint8Array> {
  const data = defaultOfferLetterData(rawData)
  const images = await resolveImages(data.logoUrl)
  return render(<OfferLetterDocument data={data} />, {
    size: "a4",
    fonts: await getFonts(),
    ...(images.length > 0 ? { images } : {}),
  })
}
