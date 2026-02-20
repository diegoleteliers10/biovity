import { NextResponse } from "next/server"
import sharp from "sharp"
import generateOgImage from "@/app/opengraph-image"

/**
 * Serves OG image as JPEG for WhatsApp (max 600KB).
 * Facebook, Twitter, and WhatsApp all support JPEG.
 */
export async function GET() {
  try {
    const pngResponse = await generateOgImage()
    const pngBuffer = Buffer.from(await pngResponse.arrayBuffer())

    const jpegBuffer = await sharp(pngBuffer).jpeg({ quality: 80, mozjpeg: true }).toBuffer()

    return new NextResponse(new Uint8Array(jpegBuffer), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (err) {
    console.error("[api/og] Error:", err)
    return new NextResponse("Failed to generate image", { status: 500 })
  }
}
