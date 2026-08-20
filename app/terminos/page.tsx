import type { Metadata } from "next"
import Link from "next/link"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BreadcrumbJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso",
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
      <main className="bg-white pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="border-b border-border/40 pb-8 mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Marco Legal y Regulatorio (Chile)
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-2 tracking-tight">
              Términos y Condiciones de Servicio
            </h1>
            <p className="text-sm text-muted-foreground mt-3">
              Última actualización: 20 de Agosto de 2026 · Conforme a la legislación de la República
              de Chile
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-zinc max-w-none space-y-8 text-foreground/90 leading-relaxed text-[15px]">
            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
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
                química, farmacia y ciencias de la salud.
              </p>
              <p>
                El acceso, navegación y uso de la Plataforma confiere la condición de Usuario (ya
                sea como Candidato/Profesional o como Empresa/Organización) e implica la aceptación
                plena e incondicional de estos Términos, así como de nuestra{" "}
                <Link
                  href="/privacidad"
                  className="text-accent underline underline-offset-4 hover:text-accent/80"
                >
                  Política de Privacidad
                </Link>{" "}
                y{" "}
                <Link
                  href="/cookies"
                  className="text-accent underline underline-offset-4 hover:text-accent/80"
                >
                  Política de Cookies
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                2. Descripción de los Servicios
              </h2>
              <p>Biovity proporciona los siguientes servicios principales:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>Para Profesionales y Candidatos:</strong> Creación de perfil profesional
                  científico, carga de currículum vitae (CV), búsqueda y postulación a ofertas de
                  empleo, visualización de rangos salariales referenciales, recepción de alertas de
                  empleo y herramientas de IA para el emparejamiento con ofertas pertinentes.
                </li>
                <li>
                  <strong>Para Empresas y Reclutadores:</strong> Publicación y gestión de ofertas
                  laborales, acceso a perfiles de candidatos postulantes, sistema de seguimiento de
                  postulaciones (ATS), comunicación directa con candidatos y herramientas de
                  filtrado y analítica de selección.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                3. Registro, Cuentas de Usuario y Seguridad
              </h2>
              <p>
                Para acceder a determinadas funciones, el Usuario debe registrarse proporcionando
                datos fidedignos, actualizados y completos.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>Custodia de Credenciales:</strong> El Usuario es responsable de mantener
                  la confidencialidad de su contraseña y de todas las actividades realizadas bajo su
                  cuenta.
                </li>
                <li>
                  <strong>Veracidad de la Información:</strong> Los profesionales garantizan que la
                  información académica, técnica y laboral suministrada es verídica y comprobable.
                </li>
                <li>
                  <strong>Cuentas de Organización:</strong> Las empresas declaran contar con
                  personería y facultades suficientes para representar a la entidad legal
                  correspondiente.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                4. Reglas de Conducta y Uso Aceptable
              </h2>
              <p>Queda estrictamente prohibido:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  Publicar ofertas de empleo que infrinjan el principio de no discriminación
                  consagrado en el artículo 2 del Código del Trabajo de Chile.
                </li>
                <li>
                  Publicar información falsa, engañosa o que induzca a error respecto a cargos,
                  requisitos, salarios o condiciones laborales.
                </li>
                <li>
                  Utilizar datos personales de candidatos obtenidos en la plataforma para fines
                  comerciales, spam o actividades distintas al reclutamiento directo para la vacante
                  correspondiente.
                </li>
                <li>
                  Realizar ingeniería inversa, scraping masivo no autorizado, vulneración de medidas
                  de seguridad o saturación intencionada de la infraestructura tecnológica.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                5. Planes, Pagos y Facturación para Empresas
              </h2>
              <p>
                El uso de la Plataforma es 100% gratuito para candidatos y profesionales en búsqueda
                de empleo.
              </p>
              <p>
                Las organizaciones y empresas pueden acceder a planes de suscripción pagados según
                las tarifas vigentes en la sección{" "}
                <Link
                  href="/planes"
                  className="text-accent underline underline-offset-4 hover:text-accent/80"
                >
                  Planes y Precios
                </Link>
                . Los cobros se realizan en pesos chilenos (CLP) o dólares estadounidenses (USD)
                mediante pasarelas de pago seguras y autorizadas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                6. Propiedad Intelectual
              </h2>
              <p>
                Todos los derechos de propiedad intelectual e industrial sobre el software, diseño,
                código fuente, marcas, logotipos, textos, algoritmos y bases de datos de Biovity
                corresponden exclusivamente a Biovity o a sus respectivos licenciantes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                7. Limitación de Responsabilidad
              </h2>
              <p>Biovity actúa como una plataforma de intermediación tecnológica y no garantiza:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>La contratación efectiva de un candidato por parte de una empresa.</li>
                <li>La idoneidad, desempeño laboral o conducta de los candidatos postulantes.</li>
                <li>
                  La continuidad ininterrumpida del servicio ante fallas técnicas externas o fuerza
                  mayor.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                8. Legislación Aplicable y Jurisdicción
              </h2>
              <p>
                Los presentes Términos se rigen e interpretan conforme a las leyes de la República
                de Chile (incluyendo la Ley N° 19.496 sobre Protección de los Derechos de los
                Consumidores y la Ley N° 19.628 / Ley N° 21.719 sobre Protección de Datos
                Personales). Para todos los efectos legales, las partes se someten a la competencia
                de los Tribunales Ordinarios de Justicia de la comuna y ciudad de Santiago de Chile.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                9. Canal de Contacto
              </h2>
              <p>
                Para consultas, solicitudes o notificaciones relacionadas con estos Términos, el
                Usuario puede contactar a nuestro equipo en:
              </p>
              <div className="rounded-xl border border-border/40 bg-surface-container-low p-4 mt-3">
                <p className="font-semibold text-foreground">Biovity Chile</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Correo electrónico:{" "}
                  <a
                    href="mailto:contacto@biovity.cl"
                    className="text-accent underline hover:text-accent/80"
                  >
                    contacto@biovity.cl
                  </a>
                </p>
                <p className="text-sm text-muted-foreground">Ubicación: Santiago, Chile</p>
              </div>
            </section>

            {/* Disclaimer Obligatorio */}
            <div className="border-t border-border/40 pt-6 mt-12 text-xs text-muted-foreground italic">
              <strong>Aviso legal:</strong> El presente documento constituye un borrador normativo
              informativo elaborado para regular las relaciones contractuales bajo el derecho
              chileno. No sustituye la asesoría legal especializada ante controversias específicas.
            </div>
          </div>
        </div>
      </main>
    </LandingLayout>
  )
}
