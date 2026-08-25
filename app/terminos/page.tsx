import type { Metadata } from "next"
import Link from "next/link"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BreadcrumbJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso | Biovity Chile",
  description:
    "Términos y condiciones de uso de la plataforma Biovity en Chile. Conoce las normas de uso para profesionales, estudiantes y empresas reclutadoras.",
  openGraph: {
    title: "Términos y Condiciones de Uso | Biovity",
    description:
      "Condiciones generales de acceso y uso de los servicios de intermediación laboral y software ATS de Biovity en Chile.",
    url: "/terminos",
    images: [
      { url: "/og/home.png", width: 1200, height: 630, alt: "Biovity - Términos de Servicio" },
    ],
  },
  alternates: {
    canonical: "/terminos",
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
          { name: "Términos de Servicio", url: `${siteUrl}/terminos` },
        ]}
      />
      <main className="bg-surface-container-low min-h-screen pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
              Marco Regulatorio • República de Chile
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight text-balance">
              Términos y Condiciones de Servicio
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3 font-mono">
              Última actualización: 20 de Agosto de 2026
            </p>
          </div>

          {/* Editorial Sheet */}
          <div className="bg-surface-container-lowest rounded-xl border border-border p-6 sm:p-10 md:p-12 prose prose-zinc max-w-none space-y-8 text-foreground/90 leading-relaxed text-[15px]">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                1. Identificación del Responsable y Aceptación
              </h2>
              <p>
                Los presentes Términos y Condiciones regulan el acceso y uso de la plataforma
                digital <strong>Biovity</strong> (en adelante, la &ldquo;Plataforma&rdquo; o
                &ldquo;Biovity&rdquo;), accesible a través del dominio <code>biovity.cl</code> y sus
                servicios asociados.
              </p>
              <p>
                Biovity es una plataforma tecnológica chilena orientada a la conexión laboral,
                intermediación de talento científico y provisión de herramientas de gestión de
                candidatos (ATS) en las áreas de biotecnología, bioquímica, química, ingeniería
                química, farmacia y ciencias afines.
              </p>
              <p>
                El acceso, navegación y uso de la Plataforma confiere la condición de Usuario (ya
                sea como Candidato/Profesional o como Empresa/Organización) e implica la aceptación
                plena e incondicional de estos Términos, así como de nuestra{" "}
                <Link
                  href="/privacidad"
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

            <section>
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
                  postulaciones (ATS), comunicación directa con candidatos y herramientas de
                  filtrado técnico.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                3. Registro, Cuentas de Usuario y Seguridad
              </h2>
              <p>
                Para acceder a determinadas funciones, el Usuario debe registrarse proporcionando
                datos fidedignos, actualizados y completos.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>Custodia de Credenciales:</strong> El Usuario es responsable de mantener
                  la confidencialidad de sus credenciales y de las actividades realizadas bajo su
                  cuenta.
                </li>
                <li>
                  <strong>Veracidad de la Información:</strong> Los profesionales garantizan que los
                  antecedentes académicos, técnicos y laborales suministrados son verídicos.
                </li>
                <li>
                  <strong>Cuentas de Organización:</strong> Las empresas declaran contar con
                  facultades legales suficientes para representar a la entidad correspondiente.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                4. Reglas de Conducta y Uso Aceptable
              </h2>
              <p>Queda estrictamente prohibido:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  Publicar ofertas de empleo que infrinjan el principio de no discriminación
                  consagrado en el artículo 2 del Código del Trabajo de Chile.
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

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                5. Planes, Pagos y Facturación para Empresas
              </h2>
              <p>
                El uso de la Plataforma es 100% gratuito para candidatos y profesionales en búsqueda
                de empleo.
              </p>
              <p>
                Las organizaciones pueden acceder a planes según las tarifas vigentes en la sección{" "}
                <Link
                  href="/planes"
                  className="text-secondary font-medium underline underline-offset-4 hover:text-secondary/80"
                >
                  Planes y Precios
                </Link>
                . Los cobros se expresan en pesos chilenos (CLP) más impuestos legales
                correspondientes.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                6. Propiedad Intelectual
              </h2>
              <p>
                Todos los derechos de propiedad intelectual sobre la plataforma, marcas, interfaces,
                código fuente y algoritmos de Biovity corresponden exclusivamente a Biovity o sus
                licenciantes.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                7. Legislación Aplicable y Jurisdicción
              </h2>
              <p>
                Los presentes Términos se rigen e interpretan conforme a las leyes de la República
                de Chile. Para todos los efectos legales, las partes se someten a la competencia de
                los Tribunales Ordinarios de Justicia de la comuna de Santiago de Chile.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                8. Canal de Contacto Oficial
              </h2>
              <p>Para consultas o notificaciones sobre estos Términos:</p>
              <div className="rounded-xl border border-border bg-surface-container-low p-4 mt-3">
                <p className="font-semibold text-foreground">Biovity Chile</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Correo electrónico:{" "}
                  <a
                    href="mailto:contacto@biovity.cl"
                    className="text-secondary font-medium underline hover:text-secondary/80"
                  >
                    contacto@biovity.cl
                  </a>
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Santiago, Chile</p>
              </div>
            </section>

            <div className="border-t border-border pt-6 mt-10 text-xs text-muted-foreground italic">
              <strong>Aviso legal:</strong> Documento normativo e informativo regulatorio bajo el
              marco del derecho chileno.
            </div>
          </div>
        </div>
      </main>
    </LandingLayout>
  )
}
