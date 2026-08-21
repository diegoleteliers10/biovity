import type { Metadata } from "next"
import Link from "next/link"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BreadcrumbJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"

export const metadata: Metadata = {
  title: "Política de Cookies | Biovity Chile",
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
      <main className="bg-surface-container-low min-h-screen pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-secondary mb-3 block">
              Tecnologías Web & Transparencia
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight text-balance">
              Política de Cookies y Almacenamiento
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3 font-mono">
              Última actualización: 20 de Agosto de 2026
            </p>
          </div>

          {/* Editorial Sheet */}
          <div className="bg-surface-container-lowest rounded-xl border border-border p-6 sm:p-10 md:p-12 prose prose-zinc max-w-none space-y-8 text-foreground/90 leading-relaxed text-[15px]">
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                1. ¿Qué son las Cookies?
              </h2>
              <p>
                Las cookies son pequeños archivos de texto que los sitios web almacenan en tu
                navegador para recordar información de sesión, preferencias de usuario y garantizar
                el correcto funcionamiento de la plataforma.
              </p>
              <p>
                En Biovity aplicamos un principio de minimización: <strong>no usamos cookies de publicidad invasiva ni rastreadores para venta de datos personales</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                2. Tabla de Cookies Utilizadas
              </h2>
              <div className="overflow-x-auto rounded-xl border border-border bg-surface-container-lowest mt-4">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-surface-container-low border-b border-border text-muted-foreground font-mono text-[11px] uppercase">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Cookie</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Proveedor</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Finalidad</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Duración</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-muted-foreground">
                    <tr>
                      <td className="px-4 py-3 font-mono font-medium text-foreground">better-auth.session_token</td>
                      <td className="px-4 py-3">Biovity (Propia)</td>
                      <td className="px-4 py-3">Sesión autenticada de usuario</td>
                      <td className="px-4 py-3 font-mono">7 días</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-medium text-foreground">better-auth.csrf_token</td>
                      <td className="px-4 py-3">Biovity (Propia)</td>
                      <td className="px-4 py-3">Protección contra ataques CSRF</td>
                      <td className="px-4 py-3 font-mono">Sesión</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-medium text-foreground">sidebar_state</td>
                      <td className="px-4 py-3">Biovity (Propia)</td>
                      <td className="px-4 py-3">Preferencia visual de navegación</td>
                      <td className="px-4 py-3 font-mono">30 días</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-medium text-foreground">_vercel_analytics</td>
                      <td className="px-4 py-3">Vercel Inc.</td>
                      <td className="px-4 py-3">Telemetría anónima de rendimiento</td>
                      <td className="px-4 py-3 font-mono">Sesión</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                3. Cómo Gestionar las Cookies
              </h2>
              <p>
                Puedes permitir, bloquear o eliminar las cookies en tu dispositivo configurando las opciones de tu navegador. Si bloqueas las cookies técnicas esenciales, algunas funciones autenticadas de la plataforma podrían verse limitadas.
              </p>
            </section>

            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
                4. Contacto
              </h2>
              <p>
                Para cualquier consulta sobre nuestra política de cookies, puedes escribir a{" "}
                <a
                  href="mailto:contacto@biovity.cl"
                  className="text-secondary font-medium underline hover:text-secondary/80"
                >
                  contacto@biovity.cl
                </a>{" "}
                o revisar nuestra{" "}
                <Link href="/privacidad" className="text-secondary font-medium underline hover:text-secondary/80">
                  Política de Privacidad
                </Link>
                .
              </p>
            </section>

            <div className="border-t border-border pt-6 mt-10 text-xs text-muted-foreground italic">
              <strong>Aviso legal:</strong> Documento informativo de tecnologías web conforme a la normativa chilena vigente.
            </div>
          </div>
        </div>
      </main>
    </LandingLayout>
  )
}
