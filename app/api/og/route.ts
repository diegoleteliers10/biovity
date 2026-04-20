import { Result as R, type Result } from "better-result"
import { NextResponse } from "next/server"
import sharp from "sharp"
import generateOgImage from "@/app/opengraph-image"

async function generateOgBuffer(): Promise<Result<Buffer, Error>> {
  return R.tryPromise({
    try: async () => {
      const pngResponse = await generateOgImage()
      const pngBuffer = Buffer.from(await pngResponse.arrayBuffer())
      const jpegBuffer = await sharp(pngBuffer).jpeg({ quality: 80, mozjpeg: true }).toBuffer()
      return jpegBuffer
    },
    catch: (e) => (e instanceof Error ? e : new Error(String(e))),
  })
}

export async function GET() {
  const bufferResult = await generateOgBuffer()

  if (bufferResult.isErr()) {
    console.error("[api/og] Error:", bufferResult.error)
    return new NextResponse("Failed to generate image", { status: 500 })
  }

  return new NextResponse(new Uint8Array(bufferResult.value), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
