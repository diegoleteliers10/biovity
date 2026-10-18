import type { Metadata } from "next"
import Link from "next/link"
import { LegalDocumentLayout } from "@/components/landing/legal/LegalDocumentLayout"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BreadcrumbJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"

const sections = [
  { id: "responsable-aceptacion", title: "Identificación del Responsable y Aceptación" },
  { id: "servicios", title: "Descripción de los Servicios" },
  { id: "registro-seguridad", title: "Registro, Cuentas de Usuario y Seguridad" },
  { id: "uso-aceptable", title: "Reglas de Conducta y Uso Aceptable" },
  { id: "planes-pagos", title: "Planes, Pagos y Facturación para Empresas" },
  { id: "propiedad-intelectual", title: "Propiedad Intelectual" },
  { id: "legislacion-jurisdiccion", title: "Legislación Aplicable y Jurisdicción" },
  { id: "contacto-oficial", title: "Canal de Contacto Oficial" },
] as const

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso",
  description:
    "Términos y condiciones de uso de la plataforma Biovity en Chile. Conoce las normas de uso para profesionales, estudiantes y empresas reclutadoras.",
  openGraph: {
    title: "Términos y Condiciones de Uso | Biovity",
    description:
      "Condiciones generales de acceso y uso de los servicios de intermediación laboral y software ATS de Biovity en Chile.",
    url: "/terms",
    images: [
      { url: "/og/home.png", width: 1200, height: 630, alt: "Biovity - Términos de Servicio" },
    ],
  },
  alternates: {
    canonical: "/terms",
  },
}

export default function TerminosPage() {
  return (
    <LandingLayout>
      <WebSiteJsonLd />
      <OrganizationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: siteUrl },
          { name: "Términos de Servicio", url: `${siteUrl}/terms` },
        ]}
      />
      <LegalDocumentLayout
        variant="terms"
        title="Términos y Condiciones de Servicio"
        lastUpdated={{ dateTime: "2026-08-20", label: "20 de Agosto de 2026" }}
        sections={sections}
      >
        <section id="responsable-aceptacion">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
            1. Identificación del Responsable y Aceptación
          </h2>
          <p>
            Los presentes Términos y Condiciones regulan el acceso y uso de la plataforma digital{" "}
            <strong>Biovity</strong> (en adelante, la &ldquo;Plataforma&rdquo; o
            &ldquo;Biovity&rdquo;), accesible a través del dominio <code>biovity.cl</code> y sus
            servicios asociados.
          </p>
          <p>
            Biovity es una plataforma tecnológica chilena orientada a la conexión laboral,
            intermediación de talento científico y provisión de herramientas de gestión de
            candidatos (ATS) en las áreas de biotecnología, bioquímica, química, ingeniería química,
            farmacia y ciencias afines.
          </p>
          <p>
            El acceso, navegación y uso de la Plataforma confiere la condición de Usuario (ya sea
            como Candidato/Profesional o como Empresa/Organización) e implica la aceptación plena e
            incondicional de estos Términos, así como de nuestra{" "}
            <Link
              href="/privacy"
              className="text-secondary font-medium underline underline-offset-4 hover:text-secondary/80"
            >
              Política de Privacidad
            </Link>{" "}
            y{" "}
            <Link
              href="/cookies"
              className="text-secondary font-medium underline underline-offset-4 hover:text-secondary/80"
            >
              Política de Cookies
            </Link>
            .
          </p>
        </section>

        <section id="servicios">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
            2. Descripción de los Servicios
          </h2>
          <p>Biovity proporciona los siguientes servicios principales:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Para Profesionales y Candidatos:</strong> Creación de perfil profesional
              científico, carga de currículum vitae (CV), búsqueda y postulación a ofertas de
              empleo, visualización de rangos salariales referenciales, recepción de alertas de
              empleo y herramientas de emparejamiento con ofertas afines.
            </li>
            <li>
              <strong>Para Empresas y Reclutadores:</strong> Publicación y gestión de ofertas
              laborales, acceso a perfiles de candidatos postulantes, sistema de seguimiento de
              postulaciones (ATS), comunicación directa con candidatos y herramientas de filtrado
              técnico.
            </li>
          </ul>
        </section>

        <section id="registro-seguridad">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
            3. Registro, Cuentas de Usuario y Seguridad
          </h2>
          <p>
            Para acceder a determinadas funciones, el Usuario debe registrarse proporcionando datos
            fidedignos, actualizados y completos.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Custodia de Credenciales:</strong> El Usuario es responsable de mantener la
              confidencialidad de sus credenciales y de las actividades realizadas bajo su cuenta.
            </li>
            <li>
              <strong>Veracidad de la Información:</strong> Los profesionales garantizan que los
              antecedentes académicos, técnicos y laborales suministrados son verídicos.
            </li>
            <li>
              <strong>Cuentas de Organización:</strong> Las empresas declaran contar con facultades
              legales suficientes para representar a la entidad correspondiente.
            </li>
          </ul>
        </section>

        <section id="uso-aceptable">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
            4. Reglas de Conducta y Uso Aceptable
          </h2>
          <p>Queda estrictamente prohibido:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              Publicar ofertas de empleo que infrinjan el principio de no discriminación consagrado
              en el artículo 2 del Código del Trabajo de Chile.
            </li>
            <li>
              Publicar información engañosa o que induzca a error respecto a cargos, requisitos,
              salarios o condiciones laborales.
            </li>
            <li>
              Utilizar datos personales de postulantes para fines de publicidad no solicitada o
              ajenos al proceso de selección específico.
            </li>
            <li>
              Realizar ingeniería inversa, scraping masivo no autorizado o vulneración de las
              medidas de seguridad del sistema.
            </li>
          </ul>
        </section>

        <section id="planes-pagos">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
            5. Planes, Pagos y Facturación para Empresas
          </h2>
          <p>
            El uso de la Plataforma es 100% gratuito para candidatos y profesionales en búsqueda de
            empleo.
          </p>
          <p>
            Las organizaciones pueden acceder a planes según las tarifas vigentes en la sección{" "}
            <Link
              href="/plans"
              className="text-secondary font-medium underline underline-offset-4 hover:text-secondary/80"
            >
              Planes y Precios
            </Link>
            . Los cobros se expresan en pesos chilenos (CLP) más impuestos legales correspondientes.
          </p>
        </section>

        <section id="propiedad-intelectual">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
            6. Propiedad Intelectual
          </h2>
          <p>
            Todos los derechos de propiedad intelectual sobre la plataforma, marcas, interfaces,
            código fuente y algoritmos de Biovity corresponden exclusivamente a Biovity o sus
            licenciantes.
          </p>
        </section>

        <section id="legislacion-jurisdiccion">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
            7. Legislación Aplicable y Jurisdicción
          </h2>
          <p>
            Los presentes Términos se rigen e interpretan conforme a las leyes de la República de
            Chile. Para todos los efectos legales, las partes se someten a la competencia de los
            Tribunales Ordinarios de Justicia de la comuna de Santiago de Chile.
          </p>
        </section>

        <section id="contacto-oficial">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
            8. Canal de Contacto Oficial
          </h2>
          <p>Para consultas o notificaciones sobre estos Términos:</p>
          <div className="rounded-xl border border-border bg-surface-container-low p-4 mt-3">
            <p className="font-semibold text-foreground">Biovity Chile</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Correo electrónico:{" "}
              <a
                href="mailto:dleteliers@biovity.cl"
                className="text-secondary font-medium underline hover:text-secondary/80"
              >
                dleteliers@biovity.cl
              </a>
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Santiago, Chile</p>
          </div>
        </section>

        <div className="rounded-lg bg-surface-container-low p-5 text-sm italic text-muted-foreground">
          <strong>Aviso legal:</strong> Documento normativo e informativo regulatorio bajo el marco
          del derecho chileno.
        </div>
      </LegalDocumentLayout>
    </LandingLayout>
  )
}
