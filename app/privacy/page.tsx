import type { Metadata } from "next"
import { LegalDocumentLayout } from "@/components/landing/legal/LegalDocumentLayout"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BreadcrumbJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"

const sections = [
  { id: "responsable-tratamiento", title: "Compromiso y Responsable del Tratamiento" },
  { id: "datos-personales", title: "Datos Personales que Recopilamos" },
  { id: "finalidades", title: "Finalidades del Tratamiento" },
  { id: "derechos-arco", title: "Tus Derechos ARCO" },
] as const

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de Privacidad y Protección de Datos Personales de Biovity conforme a la Ley N° 19.628 y Ley N° 21.719 en Chile. Conoce el tratamiento de tus datos y tus derechos ARCO.",
  openGraph: {
    title: "Política de Privacidad y Protección de Datos | Biovity",
    description:
      "Información transparente sobre el tratamiento de datos personales, finalidades, medidas de seguridad y ejercicio de derechos ARCO en Biovity Chile.",
    url: "/privacy",
    images: [
      { url: "/og/home.png", width: 1200, height: 630, alt: "Biovity - Política de Privacidad" },
    ],
  },
  alternates: {
    canonical: "/privacy",
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
          { name: "Política de Privacidad", url: `${siteUrl}/privacy` },
        ]}
      />
      <LegalDocumentLayout
        variant="privacy"
        title="Política de Privacidad y Protección de Datos"
        lastUpdated={{ dateTime: "2026-08-20", label: "20 de Agosto de 2026" }}
        sections={sections}
      >
        <section id="responsable-tratamiento">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
            1. Compromiso y Responsable del Tratamiento
          </h2>
          <p>
            En <strong>Biovity</strong> (&ldquo;Biovity&rdquo; o la &ldquo;Plataforma&rdquo;), la
            protección de la privacidad y la seguridad de los datos personales de nuestros usuarios
            es un pilar fundamental.
          </p>
          <p>
            Tratamos los datos personales recabados a través de nuestro sitio web{" "}
            <code>biovity.cl</code> y sus servicios en estricto cumplimiento de la legislación
            chilena vigente, en especial la <strong>Ley N° 19.628</strong> y la{" "}
            <strong>Ley N° 21.719</strong> sobre Protección de Datos Personales.
          </p>
          <div className="rounded-xl border border-border bg-surface-container-low p-4 mt-3">
            <p className="font-semibold text-foreground">Responsable del Tratamiento de Datos:</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Biovity Chile</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Canal de Privacidad y Derechos ARCO:{" "}
              <a
                href="mailto:dleteliers@biovity.cl"
                className="text-secondary font-medium underline hover:text-secondary/80"
              >
                dleteliers@biovity.cl
              </a>
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Domicilio: Santiago, Región Metropolitana, Chile
            </p>
          </div>
        </section>

        <section id="datos-personales">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
            2. Datos Personales que Recopilamos
          </h2>
          <p>Dependiendo de tu rol en la Plataforma, recopilamos los siguientes tipos de datos:</p>
          <div className="space-y-4 mt-3">
            <div className="p-5 rounded-xl border border-border bg-surface-container-low">
              <h3 className="font-semibold text-foreground text-base mb-2">
                A. Candidatos y Profesionales en Ciencias:
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
                <li>
                  <strong>Datos de Identificación:</strong> Nombre completo, correo electrónico,
                  número telefónico y ciudad/región.
                </li>
                <li>
                  <strong>Perfil Técnico y Académico:</strong> Título profesional, área científica,
                  años de experiencia, habilidades técnicas y postgrados.
                </li>
                <li>
                  <strong>Currículum Vitae:</strong> Archivos cargados por el usuario para ser
                  evaluados en postulaciones activas.
                </li>
                <li>
                  <strong>Datos Salariales Voluntarios:</strong> En encuestas salariales, los datos
                  se procesan de forma estrictamente disociada y anónima.
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-border bg-surface-container-low">
              <h3 className="font-semibold text-foreground text-base mb-2">
                B. Empresas y Reclutadores:
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
                <li>
                  Razón social, RUT de la empresa (cuando aplique), sitio web y datos de usuarios
                  administradores.
                </li>
                <li>
                  Ofertas de trabajo publicadas y gestión de candidatos dentro del módulo ATS.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="finalidades">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
            3. Finalidades del Tratamiento
          </h2>
          <p>Tratamos tus datos exclusivamente para los siguientes fines legítimos:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Intermediación Laboral:</strong> Conectar postulantes con vacantes técnicas
              afines en laboratorios y empresas.
            </li>
            <li>
              <strong>Gestión de Cuentas:</strong> Proveer autenticación segura y acceso al panel de
              usuario.
            </li>
            <li>
              <strong>Comunicaciones Relevantes:</strong> Notificar el estado de tus postulaciones y
              alertas de empleo configuradas.
            </li>
            <li>
              <strong>Cumplimiento Normativo:</strong> Cumplir con la legislación chilena aplicable.
            </li>
          </ul>
        </section>

        <section id="derechos-arco">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
            4. Tus Derechos ARCO
          </h2>
          <p>
            Conforme a la normativa chilena (Ley N° 19.628 y Ley N° 21.719), tienes derecho de{" "}
            <strong>Acceso, Rectificación, Cancelación, Oposición y Portabilidad</strong> de tus
            datos personales.
          </p>
          <p className="mt-3">
            Para ejercer cualquiera de estos derechos, envía un correo a{" "}
            <a
              href="mailto:dleteliers@biovity.cl"
              className="text-secondary font-medium underline hover:text-secondary/80"
            >
              dleteliers@biovity.cl
            </a>{" "}
            indicando tu solicitud.
          </p>
        </section>

        <div className="rounded-lg bg-surface-container-low p-5 text-sm italic text-muted-foreground">
          <strong>Aviso legal:</strong> Política informativa de privacidad redactada conforme a los
          estándares de la legislación chilena vigente.
        </div>
      </LegalDocumentLayout>
    </LandingLayout>
  )
}
