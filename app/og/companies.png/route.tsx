import { ImageResponse } from "next/og"
import { getOgLogoSrc, OgTemplate } from "../og-template"

export async function GET() {
  const logoSrc = await getOgLogoSrc()

  return new ImageResponse(
    <OgTemplate
      logoSrc={logoSrc}
      titleA="Conecta con el nuevo"
      titleB="talento científico de Chile"
      subtitle="ATS especializado para reclutar profesionales en biotecnología, bioquímica, química e ingeniería química"
      footer="biovity.cl/companies"
      stats={[
        { value: "+500", label: "profesionales" },
        { value: "+50", label: "especialidades" },
        { value: "100%", label: "enfocado en ciencias" },
      ]}
    />,
    {
      width: 1200,
      height: 630,
    }
  )
}
