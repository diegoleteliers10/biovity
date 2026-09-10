import { ImageResponse } from "next/og"
import { getOgLogoSrc, OgTemplate } from "../og-template"

export async function GET() {
  const logoSrc = await getOgLogoSrc()

  return new ImageResponse(
    <OgTemplate
      logoSrc={logoSrc}
      titleA="Sobre Nosotros"
      titleB="Talento científico en Chile"
      subtitle="La plataforma dedicada a potenciar la biotecnología, bioquímica, química y ciencias de la salud."
      footer="biovity.cl/about"
    />,
    {
      width: 1200,
      height: 630,
    }
  )
}
