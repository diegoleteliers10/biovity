import type { Metadata } from "next"
import Link from "next/link"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BreadcrumbJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"

export const metadata: Metadata = {
  title: "Política de Privacidad y Protección de Datos",
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
      <main className="bg-white pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="border-b border-border/40 pb-8 mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Cumplimiento Ley N° 21.719 y Ley N° 19.628 (Chile)
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-2 tracking-tight">
              Política de Privacidad y Protección de Datos
            </h1>
            <p className="text-sm text-muted-foreground mt-3">
              Última actualización: 20 de Agosto de 2026 · Ámbito de aplicación: República de Chile
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-zinc max-w-none space-y-8 text-foreground/90 leading-relaxed text-[15px]">
            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                1. Compromiso y Responsable del Tratamiento
              </h2>
              <p>
                En <strong>Biovity</strong> (&ldquo;Biovity&rdquo; o la &ldquo;Plataforma&rdquo;),
                la protección de la privacidad y la seguridad de los datos personales de nuestros
                usuarios es una prioridad fundamental.
              </p>
              <p>
                El presente documento establece los términos bajo los cuales tratamos los datos
                personales recabados a través de nuestro sitio web <code>biovity.cl</code> y sus
                servicios, en estricto cumplimiento de la legislación chilena vigente, en especial
                la <strong>Ley N° 19.628</strong> sobre Protección de la Vida Privada, sus
                modificaciones y la <strong>Ley N° 21.719</strong> sobre Protección de Datos
                Personales.
              </p>
              <div className="rounded-xl border border-border/40 bg-surface-container-low p-4 mt-3">
                <p className="font-semibold text-foreground">
                  Responsable del Tratamiento de Datos:
                </p>
                <p className="text-sm text-muted-foreground mt-1">Biovity Chile</p>
                <p className="text-sm text-muted-foreground">
                  Canal de Privacidad y Derechos ARCO:{" "}
                  <a
                    href="mailto:contacto@biovity.cl"
                    className="text-accent underline hover:text-accent/80"
                  >
                    contacto@biovity.cl
                  </a>
                </p>
                <p className="text-sm text-muted-foreground">
                  Domicilio: Santiago, Región Metropolitana, Chile
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                2. Datos Personales que Recopilamos
              </h2>
              <p>
                Dependiendo de tu rol en la Plataforma, recopilamos los siguientes tipos de datos:
              </p>
              <div className="space-y-4 mt-3">
                <div className="p-4 rounded-xl border border-border/30 bg-surface-container-lowest">
                  <h3 className="font-semibold text-foreground text-base mb-2">
                    A. Candidatos y Profesionales en Ciencias:
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>
                      <strong>Datos de Identificación y Contacto:</strong> Nombre completo, correo
                      electrónico, número de teléfono, ciudad, región y país de residencia.
                    </li>
                    <li>
                      <strong>Perfil Profesional y Académico:</strong> Título profesional, área
                      científica (biotecnología, bioquímica, química, farmacia, etc.), años de
                      experiencia, nivel educativo, habilidades técnicas, idiomas y certificaciones.
                    </li>
                    <li>
                      <strong>Currículum Vitae y Documentos:</strong> Archivos de CV en formato PDF
                      o Word cargados por el usuario, extractos profesionales y enlaces a perfiles
                      profesionales externos (ej. LinkedIn, ResearchGate).
                    </li>
                    <li>
                      <strong>Postulaciones e Interacciones:</strong> Registro de ofertas laborales
                      a las que postula, estado en el proceso de selección y mensajes intercambiados
                      con reclutadores a través de la plataforma.
                    </li>
                    <li>
                      <strong>Datos Salariales Voluntarios:</strong> En caso de participar en la
                      encuesta salarial, se procesan datos salariales de forma anonimizada y
                      agregada para generar estadísticas públicas de mercado.
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-border/30 bg-surface-container-lowest">
                  <h3 className="font-semibold text-foreground text-base mb-2">
                    B. Empresas y Reclutadores:
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>
                      Razón social o nombre de fantasía, RUT de la empresa (cuando aplique), sitio
                      web, logotipo y descripción de la organización.
                    </li>
                    <li>
                      Datos de los usuarios administradores y reclutadores (nombre, correo
                      corporativo, cargo).
                    </li>
                    <li>
                      Ofertas de trabajo publicadas, criterios de búsqueda y notas del proceso de
                      selección en el sistema ATS.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                3. Finalidades y Bases de Licitud del Tratamiento
              </h2>
              <p>
                Tratamos tus datos personales exclusivamente para los siguientes fines legítimos:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>Intermediación Laboral:</strong> Facilitar la conexión entre candidatos y
                  empresas reclutadoras, permitiendo que las organizaciones revisen los perfiles y
                  CVs de quienes postulan voluntariamente a sus vacantes. (
                  <em>Base legal: Ejecución de la relación de servicio / consentimiento</em>).
                </li>
                <li>
                  <strong>Matching Inteligente y Recomendaciones:</strong> Analizar las competencias
                  y requisitos mediante modelos de IA para sugerir vacantes relevantes a los
                  profesionales y candidatos idóneos a las empresas. (
                  <em>Base legal: Ejecución del servicio</em>).
                </li>
                <li>
                  <strong>Gestión de Cuentas y Autenticación:</strong> Crear y administrar las
                  cuentas de usuario, verificar identidades y garantizar la seguridad mediante
                  Better Auth. (<em>Base legal: Ejecución contractual</em>).
                </li>
                <li>
                  <strong>Comunicaciones y Notificaciones:</strong> Enviar alertas de nuevas ofertas
                  de trabajo según tus preferencias, actualizaciones de tus postulaciones y avisos
                  operativos esenciales. (<em>Base legal: Consentimiento e interés legítimo</em>).
                </li>
                <li>
                  <strong>Cumplimiento Legal y Prevención de Fraudes:</strong> Cumplir con
                  requerimientos de autoridades competentes y prevenir delitos económicos conforme a
                  la Ley N° 21.595. (<em>Base legal: Obligación legal</em>).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                4. Comunicación y Transferencia de Datos
              </h2>
              <p>
                Biovity <strong>no vende, arrienda ni comercializa</strong> los datos personales de
                sus usuarios a terceros.
              </p>
              <p>Tus datos únicamente se comunican a:</p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>Empresas Reclutadoras:</strong> Cuando te postulas a una oferta laboral,
                  la empresa que publicó dicha oferta accede a tu perfil y currículum vitae para
                  evaluar tu postulación.
                </li>
                <li>
                  <strong>
                    Proveedores Tecnológicos e Infraestructura (Encargados del Tratamiento):
                  </strong>{" "}
                  Proveedores de alojamiento en la nube, bases de datos (Supabase / PostgreSQL) y
                  analítica (Vercel), los cuales operan bajo estrictas cláusulas contractuales de
                  confidencialidad y estándares internacionales de seguridad (cifrado en tránsito y
                  en reposo).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                5. Tus Derechos ARCO y Portabilidad
              </h2>
              <p>
                Conforme a la normativa chilena (Ley N° 19.628 y Ley N° 21.719), como titular de los
                datos personales tienes derecho a:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>Acceso:</strong> Solicitar información sobre qué datos personales tuyos
                  mantenemos y los fines de su tratamiento.
                </li>
                <li>
                  <strong>Rectificación:</strong> Corregir o actualizar información inexacta o
                  incompleta directamente desde tu panel de usuario o por correo.
                </li>
                <li>
                  <strong>Cancelación / Supresión:</strong> Solicitar la eliminación de tus datos
                  personales cuando hayan dejado de ser necesarios para los fines que justificaron
                  su recopilación o cuando revoques tu consentimiento.
                </li>
                <li>
                  <strong>Oposición:</strong> Oponerte al tratamiento de tus datos para finalidades
                  específicas (por ejemplo, comunicaciones comerciales).
                </li>
                <li>
                  <strong>Portabilidad:</strong> Solicitar una copia estructurada de tus datos en
                  formato digital interoperable.
                </li>
              </ul>
              <p className="mt-3">
                Para ejercer cualquiera de estos derechos, puedes enviar una solicitud a{" "}
                <a
                  href="mailto:contacto@biovity.cl"
                  className="text-accent underline font-semibold hover:text-accent/80"
                >
                  contacto@biovity.cl
                </a>{" "}
                indicando tu nombre completo, correo asociado a tu cuenta y el derecho que deseas
                ejercer. Responderemos a tu requerimiento en los plazos legales establecidos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                6. Plazos de Retención y Conservación
              </h2>
              <p>
                Conservamos tus datos personales mientras mantengas activa tu cuenta en Biovity. Si
                decides eliminar tu cuenta, tus datos personales serán cancelados y eliminados de
                forma segura, salvo aquellos registros que debamos conservar durante los plazos
                legalmente exigidos por la legislación laboral, tributaria o comercial chilena.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                7. Medidas de Seguridad de la Información
              </h2>
              <p>
                Biovity implementa medidas técnicas y organizativas adecuadas para proteger los
                datos personales contra accesos no autorizados, pérdida, destrucción o alteración
                ilícita. Entre ellas se incluyen:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  Cifrado de todas las comunicaciones mediante protocolos seguros HTTPS / TLS.
                </li>
                <li>
                  Almacenamiento de contraseñas mediante algoritmos seguros de hashing
                  unidireccional.
                </li>
                <li>
                  Aislamiento por roles y control estricto de accesos a bases de datos y
                  repositorios de CVs.
                </li>
                <li>Monitoreo continuo de incidentes de seguridad y respaldos periódicos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                8. Modificaciones a la Política de Privacidad
              </h2>
              <p>
                Biovity se reserva el derecho de actualizar la presente Política de Privacidad para
                reflejar cambios legales o mejoras en nuestros servicios. Notificaremos a los
                usuarios sobre cambios sustanciales a través de la plataforma o mediante correo
                electrónico antes de que entren en vigor.
              </p>
            </section>

            {/* Disclaimer Obligatorio */}
            <div className="border-t border-border/40 pt-6 mt-12 text-xs text-muted-foreground italic">
              <strong>Aviso legal:</strong> Este documento constituye un borrador normativo conforme
              al marco de protección de datos personales de la República de Chile (Ley N° 19.628 y
              Ley N° 21.719). No constituye asesoría legal individualizada.
            </div>
          </div>
        </div>
      </main>
    </LandingLayout>
  )
}
