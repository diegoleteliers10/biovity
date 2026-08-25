import { Result } from "better-result"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CertificateDownload } from "@/components/certificate/CertificatePDF"
import { auth } from "@/lib/auth"
import { getCertificate } from "@/lib/db/capsules"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CertificatePage({ params }: Props) {
  const { slug } = await params

  const session = await auth.api.getSession({ headers: new Headers() })
  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Inicia sesión para ver tu certificado
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Necesitas estar autenticado para acceder a tu certificado.
          </p>
          <Link
            href="/login/professional"
            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </main>
    )
  }

  const result = await getCertificate(session.user.id, slug)
  if (Result.isError(result) || !result.value) notFound()

  const cert = result.value

  return (
    <main className="min-h-screen flex items-center justify-center py-16">
      <div className="max-w-lg mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Tu certificado</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">{cert.capsule_title}</p>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Emitido el{" "}
          {new Date(cert.issued_at).toLocaleDateString("es-CL", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="mt-8">
          <CertificateDownload
            userName={session.user.name ?? "Profesional Biovity"}
            capsuleTitle={cert.capsule_title}
            issuedAt={cert.issued_at}
            certificateId={cert.id}
          />
        </div>

        <div className="mt-6">
          <Link
            href={`/aprende/${cert.capsule_slug}`}
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Volver a la cápsula
          </Link>
        </div>
      </div>
    </main>
  )
}
