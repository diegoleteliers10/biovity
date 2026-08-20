import type { Metadata } from "next"
import Link from "next/link"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BreadcrumbJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"

export const metadata: Metadata = {
  title: "Política de Cookies",
  description:
    "Política de Cookies de Biovity. Conoce qué cookies y tecnologías de almacenamiento local utilizamos, sus finalidades y cómo gestionarlas.",
  openGraph: {
    title: "Política de Cookies | Biovity",
    description:
      "Información transparente sobre las cookies técnicas, de sesión y analíticas utilizadas en Biovity Chile.",
    url: "/cookies",
    images: [
      { url: "/og/home.png", width: 1200, height: 630, alt: "Biovity - Política de Cookies" },
    ],
  },
  alternates: {
    canonical: "/cookies",
  },
}

export default function CookiesPage() {
  return (
    <LandingLayout>
      <WebSiteJsonLd />
      <OrganizationJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Inicio", url: siteUrl },
          { name: "Política de Cookies", url: `${siteUrl}/cookies` },
        ]}
      />
      <main className="bg-white pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="border-b border-border/40 pb-8 mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              Transparencia y Tecnologías Web
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-2 tracking-tight">
              Política de Cookies y Almacenamiento Local
            </h1>
            <p className="text-sm text-muted-foreground mt-3">
              Última actualización: 20 de Agosto de 2026 · Plataforma Biovity (Chile)
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-zinc max-w-none space-y-8 text-foreground/90 leading-relaxed text-[15px]">
            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                1. ¿Qué son las Cookies y Tecnologías Similares?
              </h2>
              <p>
                Las cookies son pequeños archivos de texto que los sitios web almacenan en tu
                navegador o dispositivo cuando los visitas. Se utilizan ampliamente para permitir el
                funcionamiento eficiente de los sitios web, recordar tus preferencias de navegación,
                mantener tu sesión activa y proporcionar información estadística anónima sobre el
                uso de la plataforma.
              </p>
              <p>
                Además de las cookies tradicionales, Biovity puede utilizar tecnologías afines como
                el almacenamiento local (<code>localStorage</code> y <code>sessionStorage</code>)
                para optimizar la experiencia de usuario y el rendimiento de la aplicación web.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                2. ¿Qué Tipos de Cookies Utilizamos en Biovity?
              </h2>
              <p>
                En Biovity aplicamos un principio de minimización de datos.{" "}
                <strong>
                  No utilizamos cookies de publicidad invasiva de terceros ni rastreadores para
                  venta de datos personales
                </strong>
                . Las cookies que utilizamos se dividen en:
              </p>

              <div className="space-y-4 mt-4">
                <div className="p-4 rounded-xl border border-border/30 bg-surface-container-lowest">
                  <h3 className="font-semibold text-foreground text-base mb-1">
                    A. Cookies Técnicas y Estrictamente Necesarias (Esenciales):
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Son indispensables para que la plataforma funcione correctamente. Permiten la
                    autenticación segura, el inicio de sesión, la protección contra ataques
                    informáticos (como CSRF) y la navegación entre páginas autenticadas del
                    dashboard. Sin estas cookies, los servicios solicitados no pueden prestarse.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border/30 bg-surface-container-lowest">
                  <h3 className="font-semibold text-foreground text-base mb-1">
                    B. Cookies de Preferencias y Funcionalidad:
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Permiten recordar información que modifica el comportamiento o aspecto del
                    sitio, como el estado expandido/colapsado de la barra lateral (sidebar) o las
                    preferencias de filtros de búsqueda de empleo.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border/30 bg-surface-container-lowest">
                  <h3 className="font-semibold text-foreground text-base mb-1">
                    C. Cookies de Rendimiento y Analítica Anónima:
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Utilizamos herramientas de telemetría y rendimiento (como Vercel Analytics y
                    Speed Insights) para medir métricas técnicas de velocidad de carga (Core Web
                    Vitals) y patrones agregados de navegación de forma totalmente disociada y
                    anónima, con el fin de detectar errores y mejorar la estabilidad del servicio.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                3. Tabla Detallada de Cookies Utilizadas
              </h2>
              <div className="overflow-x-auto rounded-xl border border-border/20 bg-white mt-3">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container-low border-b border-border/20 text-muted-foreground text-xs uppercase">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Nombre de Cookie
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Proveedor
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Finalidad
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Duración
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10 text-muted-foreground text-xs sm:text-sm">
                    <tr>
                      <td className="px-4 py-3 font-mono font-medium text-foreground">
                        better-auth.session_token
                      </td>
                      <td className="px-4 py-3">Biovity (Propia)</td>
                      <td className="px-4 py-3">
                        Mantiene la sesión autenticada del usuario de forma segura.
                      </td>
                      <td className="px-4 py-3">7 días</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-medium text-foreground">
                        better-auth.csrf_token
                      </td>
                      <td className="px-4 py-3">Biovity (Propia)</td>
                      <td className="px-4 py-3">
                        Seguridad contra ataques Cross-Site Request Forgery (CSRF).
                      </td>
                      <td className="px-4 py-3">Sesión</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-medium text-foreground">
                        sidebar_state
                      </td>
                      <td className="px-4 py-3">Biovity (Propia)</td>
                      <td className="px-4 py-3">
                        Recuerda el estado visual de la barra lateral en el panel.
                      </td>
                      <td className="px-4 py-3">30 días</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-medium text-foreground">
                        _vercel_analytics
                      </td>
                      <td className="px-4 py-3">Vercel Inc.</td>
                      <td className="px-4 py-3">
                        Telemetría anónima y rendimiento de la infraestructura web.
                      </td>
                      <td className="px-4 py-3">Sesión</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                4. ¿Cómo Gestionar o Desactivar las Cookies?
              </h2>
              <p>
                Puedes permitir, bloquear o eliminar las cookies instaladas en tu dispositivo
                mediante la configuración de las opciones de tu navegador web. Si decides bloquear o
                deshabilitar las cookies esenciales, es posible que ciertas funciones de la
                Plataforma (como el inicio de sesión o la postulación a empleos) no funcionen de
                manera óptima.
              </p>
              <p className="mt-2">Instrucciones de configuración según el navegador:</p>
              <ul className="list-disc pl-6 space-y-1 mt-1 text-sm text-muted-foreground">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline hover:text-accent/80"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline hover:text-accent/80"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline hover:text-accent/80"
                  >
                    Apple Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline hover:text-accent/80"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3">
                5. Contacto y Consultas
              </h2>
              <p>
                Si tienes dudas sobre nuestra Política de Cookies o sobre el tratamiento de tus
                datos, puedes escribirnos a{" "}
                <a
                  href="mailto:contacto@biovity.cl"
                  className="text-accent underline font-semibold hover:text-accent/80"
                >
                  contacto@biovity.cl
                </a>{" "}
                o consultar nuestra{" "}
                <Link href="/privacidad" className="text-accent underline hover:text-accent/80">
                  Política de Privacidad
                </Link>
                .
              </p>
            </section>

            {/* Disclaimer Obligatorio */}
            <div className="border-t border-border/40 pt-6 mt-12 text-xs text-muted-foreground italic">
              <strong>Aviso legal:</strong> Este documento constituye un borrador informativo para
              transparentar el uso de tecnologías web bajo los estándares chilenos de protección al
              consumidor y de datos personales. No constituye asesoría legal individualizada.
            </div>
          </div>
        </div>
      </main>
    </LandingLayout>
  )
}
