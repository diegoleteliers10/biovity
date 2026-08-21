import type { Metadata } from "next"
import Link from "next/link"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BreadcrumbJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"

export const metadata: Metadata = {
  title: "Política de Privacidad y Protección de Datos | Biovity Chile",
  description:
    "Política de Privacidad y Protección de Datos Personales de Biovity conforme a la Ley N° 19.628 y Ley N° 21.719 en Chile. Conoce el tratamiento de tus datos y tus derechos ARCO.",
  openGraph: {
    title: "Política de Privacidad y Protección de Datos | Biovity",
    description:
      "Información transparente sobre el tratamiento de datos personales, finalidades, medidas de seguridad y ejercicio de derechos ARCO en Biovity Chile.",
    url: "/privacidad",
    images: [
      { url: "/og/home.png", width: 1200, height: 630, alt: "Biovity - Política de Privacidad" },
    ],
  },
  alternates: {
    canonical: "/privacidad",
  },
}

export default function PrivacidadPage() {
  return (
    <LandingLayout>
      <WebSiteJsonLd />
      <OrganizationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: siteUrl },
          { name: "Política de Privacidad", url: `${siteUrl}/privacidad` },
        ]}
      />
      <main className="bg-surface-container-low min-h-screen pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
              Cumplimiento Ley N° 21.719 y Ley N° 19.628 • Chile
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight text-balance">
              Política de Privacidad y Protección de Datos
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3 font-mono">
              Última actualización: 20 de Agosto de 2026
            </p>
          </div>

          {/* Editorial Sheet */}
          <div className="bg-surface-container-lowest rounded-xl border border-border p-6 sm:p-10 md:p-12 prose prose-zinc max-w-none space-y-8 text-foreground/90 leading-relaxed text-[15px]">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                1. Compromiso y Responsable del Tratamiento
              </h2>
              <p>
                En <strong>Biovity</strong> (&ldquo;Biovity&rdquo; o la &ldquo;Plataforma&rdquo;),
                la protección de la privacidad y la seguridad de los datos personales de nuestros
                usuarios es un pilar fundamental.
              </p>
              <p>
                Tratamos los datos personales recabados a través de nuestro sitio web <code>biovity.cl</code> y sus
                servicios en estricto cumplimiento de la legislación chilena vigente, en especial
                la <strong>Ley N° 19.628</strong> y la <strong>Ley N° 21.719</strong> sobre Protección de Datos
                Personales.
              </p>
              <div className="rounded-xl border border-border bg-surface-container-low p-4 mt-3">
                <p className="font-semibold text-foreground">
                  Responsable del Tratamiento de Datos:
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Biovity Chile</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Canal de Privacidad y Derechos ARCO:{" "}
                  <a
                    href="mailto:contacto@biovity.cl"
                    className="text-secondary font-medium underline hover:text-secondary/80"
                  >
                    contacto@biovity.cl
                  </a>
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Domicilio: Santiago, Región Metropolitana, Chile
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                2. Datos Personales que Recopilamos
              </h2>
              <p>
                Dependiendo de tu rol en la Plataforma, recopilamos los siguientes tipos de datos:
              </p>
              <div className="space-y-4 mt-3">
                <div className="p-5 rounded-xl border border-border bg-surface-container-low">
                  <h3 className="font-semibold text-foreground text-base mb-2">
                    A. Candidatos y Profesionales en Ciencias:
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
                    <li>
                      <strong>Datos de Identificación:</strong> Nombre completo, correo electrónico, número telefónico y ciudad/región.
                    </li>
                    <li>
                      <strong>Perfil Técnico y Académico:</strong> Título profesional, área científica, años de experiencia, habilidades técnicas y postgrados.
                    </li>
                    <li>
                      <strong>Currículum Vitae:</strong> Archivos cargados por el usuario para ser evaluados en postulaciones activas.
                    </li>
                    <li>
                      <strong>Datos Salariales Voluntarios:</strong> En encuestas salariales, los datos se procesan de forma estrictamente disociada y anónima.
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl border border-border bg-surface-container-low">
                  <h3 className="font-semibold text-foreground text-base mb-2">
                    B. Empresas y Reclutadores:
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
                    <li>
                      Razón social, RUT de la empresa (cuando aplique), sitio web y datos de usuarios administradores.
                    </li>
                    <li>
                      Ofertas de trabajo publicadas y gestión de candidatos dentro del módulo ATS.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                3. Finalidades del Tratamiento
              </h2>
              <p>
                Tratamos tus datos exclusivamente para los siguientes fines legítimos:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>Intermediación Laboral:</strong> Conectar postulantes con vacantes técnicas afines en laboratorios y empresas.
                </li>
                <li>
                  <strong>Gestión de Cuentas:</strong> Proveer autenticación segura y acceso al panel de usuario.
                </li>
                <li>
                  <strong>Comunicaciones Relevantes:</strong> Notificar el estado de tus postulaciones y alertas de empleo configuradas.
                </li>
                <li>
                  <strong>Cumplimiento Normativo:</strong> Cumplir con la legislación chilena aplicable.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                4. Tus Derechos ARCO
              </h2>
              <p>
                Conforme a la normativa chilena (Ley N° 19.628 y Ley N° 21.719), tienes derecho de <strong>Acceso, Rectificación, Cancelación, Oposición y Portabilidad</strong> de tus datos personales.
              </p>
              <p className="mt-3">
                Para ejercer cualquiera de estos derechos, envía un correo a{" "}
                <a
                  href="mailto:contacto@biovity.cl"
                  className="text-secondary font-medium underline hover:text-secondary/80"
                >
                  contacto@biovity.cl
                </a>{" "}
                indicando tu solicitud.
              </p>
            </section>

            <div className="border-t border-border pt-6 mt-10 text-xs text-muted-foreground italic">
              <strong>Aviso legal:</strong> Política informativa de privacidad redactada conforme a los estándares de la legislación chilena vigente.
            </div>
          </div>
        </div>
      </main>
    </LandingLayout>
  )
}
