import type { Metadata } from "next"
import Link from "next/link"
import { LegalDocumentLayout } from "@/components/landing/legal/LegalDocumentLayout"
import { LandingLayout } from "@/components/layouts/LandingLayout"
import { BreadcrumbJsonLd, OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"

const sections = [
  { id: "que-son-cookies", title: "¿Qué son las Cookies?" },
  { id: "cookies-utilizadas", title: "Tabla de Cookies Utilizadas" },
  { id: "gestionar-cookies", title: "Cómo Gestionar las Cookies" },
  { id: "contacto", title: "Contacto" },
] as const

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
      <LegalDocumentLayout
        variant="cookies"
        title="Política de Cookies y Almacenamiento"
        lastUpdated={{ dateTime: "2026-08-20", label: "20 de Agosto de 2026" }}
        sections={sections}
      >
        <section id="que-son-cookies">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
            1. ¿Qué son las Cookies?
          </h2>
          <p>
            Las cookies son pequeños archivos de texto que los sitios web almacenan en tu navegador
            para recordar información de sesión, preferencias de usuario y garantizar el correcto
            funcionamiento de la plataforma.
          </p>
          <p>
            En Biovity aplicamos un principio de minimización:{" "}
            <strong>
              no usamos cookies de publicidad invasiva ni rastreadores para venta de datos
              personales
            </strong>
            .
          </p>
        </section>

        <section id="cookies-utilizadas">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
            2. Tabla de Cookies Utilizadas
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border bg-surface-container-lowest mt-4">
            <table className="w-full text-left text-xs sm:text-sm [word-break:break-word]">
              <thead className="bg-surface-container-low text-muted-foreground text-xs uppercase [&_th]:whitespace-nowrap">
                <tr>
                  <th scope="col" className="px-2 py-3 font-semibold sm:px-4">
                    Cookie
                  </th>
                  <th scope="col" className="px-2 py-3 font-semibold sm:px-4">
                    Proveedor
                  </th>
                  <th scope="col" className="px-2 py-3 font-semibold sm:px-4">
                    Finalidad
                  </th>
                  <th scope="col" className="px-2 py-3 font-semibold sm:px-4">
                    Duración
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="odd:bg-surface-container-lowest even:bg-surface-container-low">
                  <td className="px-2 py-3 sm:px-4">
                    <code className="break-all font-mono font-medium text-foreground">
                      better-auth.session_token
                    </code>
                  </td>
                  <td className="px-2 py-3 sm:px-4">Biovity (Propia)</td>
                  <td className="px-2 py-3 sm:px-4">Sesión autenticada de usuario</td>
                  <td className="px-2 py-3 sm:px-4">7 días</td>
                </tr>
                <tr className="odd:bg-surface-container-lowest even:bg-surface-container-low">
                  <td className="px-2 py-3 sm:px-4">
                    <code className="break-all font-mono font-medium text-foreground">
                      better-auth.csrf_token
                    </code>
                  </td>
                  <td className="px-2 py-3 sm:px-4">Biovity (Propia)</td>
                  <td className="px-2 py-3 sm:px-4">Protección contra ataques CSRF</td>
                  <td className="px-2 py-3 sm:px-4">Sesión</td>
                </tr>
                <tr className="odd:bg-surface-container-lowest even:bg-surface-container-low">
                  <td className="px-2 py-3 sm:px-4">
                    <code className="break-all font-mono font-medium text-foreground">
                      sidebar_state
                    </code>
                  </td>
                  <td className="px-2 py-3 sm:px-4">Biovity (Propia)</td>
                  <td className="px-2 py-3 sm:px-4">Preferencia visual de navegación</td>
                  <td className="px-2 py-3 sm:px-4">30 días</td>
                </tr>
                <tr className="odd:bg-surface-container-lowest even:bg-surface-container-low">
                  <td className="px-2 py-3 sm:px-4">
                    <code className="break-all font-mono font-medium text-foreground">
                      _vercel_analytics
                    </code>
                  </td>
                  <td className="px-2 py-3 sm:px-4">Vercel Inc.</td>
                  <td className="px-2 py-3 sm:px-4">Telemetría anónima de rendimiento</td>
                  <td className="px-2 py-3 sm:px-4">Sesión</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="gestionar-cookies">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
            3. Cómo Gestionar las Cookies
          </h2>
          <p>
            Puedes permitir, bloquear o eliminar las cookies en tu dispositivo configurando las
            opciones de tu navegador. Si bloqueas las cookies técnicas esenciales, algunas funciones
            autenticadas de la plataforma podrían verse limitadas.
          </p>
        </section>

        <section id="contacto">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-3">
            4. Contacto
          </h2>
          <p>
            Para cualquier consulta sobre nuestra política de cookies, puedes escribir a{" "}
            <a
              href="mailto:dleteliers@biovity.cl"
              className="text-secondary font-medium underline hover:text-secondary/80"
            >
              dleteliers@biovity.cl
            </a>{" "}
            o revisar nuestra{" "}
            <Link
              href="/privacy"
              className="text-secondary font-medium underline hover:text-secondary/80"
            >
              Política de Privacidad
            </Link>
            .
          </p>
        </section>

        <div className="rounded-lg bg-surface-container-low p-5 text-sm italic text-muted-foreground">
          <strong>Aviso legal:</strong> Documento informativo de tecnologías web conforme a la
          normativa chilena vigente.
        </div>
      </LegalDocumentLayout>
    </LandingLayout>
  )
}
