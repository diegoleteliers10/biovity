import { ImageResponse } from "next/og"
import { getOgLogoSrc, OgTemplate } from "../og-template"

export async function GET() {
  const logoSrc = await getOgLogoSrc()

  return new ImageResponse(
    <OgTemplate
      logoSrc={logoSrc}
      titleA="Donde el talento y la"
      titleB="ciencia se encuentran"
      subtitle="Portal de empleo especializado en biotecnología, bioquímica, química e ingeniería química"
      footer="biovity.cl"
    />,
    {
      width: 1200,
      height: 630,
    }
  )
}
