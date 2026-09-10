import { ImageResponse } from "next/og"
import { getOgLogoSrc, OgTemplate } from "../og-template"

export async function GET() {
  const logoSrc = await getOgLogoSrc()

  return new ImageResponse(
    <OgTemplate
      logoSrc={logoSrc}
      titleA="Encuentra tu próxima"
      titleB="oferta científica"
      subtitle="Empleos en biotecnología, bioquímica, química e ingeniería química en Chile."
      footer="biovity.cl/jobs"
    />,
    {
      width: 1200,
      height: 630,
    }
  )
}
