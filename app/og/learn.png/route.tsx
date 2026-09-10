import { ImageResponse } from "next/og"
import { getOgLogoSrc, OgTemplate } from "../og-template"

export async function GET() {
  const logoSrc = await getOgLogoSrc()

  return new ImageResponse(
    <OgTemplate
      logoSrc={logoSrc}
      titleA="Aprende y crece"
      titleB="en biociencias"
      subtitle="Guías, carreras y recursos para profesionales científicos en Chile."
      footer="biovity.cl/learn"
    />,
    {
      width: 1200,
      height: 630,
    }
  )
}
