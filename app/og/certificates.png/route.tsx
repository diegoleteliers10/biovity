import { ImageResponse } from "next/og"
import { getOgLogoSrc, OgTemplate } from "../og-template"

export async function GET() {
  const logoSrc = await getOgLogoSrc()

  return new ImageResponse(
    <OgTemplate
      logoSrc={logoSrc}
      titleA="Certifica tus"
      titleB="habilidades científicas"
      subtitle="Cursos y certificados para destacar en biociencias."
      footer="biovity.cl/certificates"
    />,
    {
      width: 1200,
      height: 630,
    }
  )
}
