"use client"

import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type AppErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AppError({ error, reset }: AppErrorProps) {
  const supportCode = error.digest ?? "sin-codigo"

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-8">
      <section className="w-full max-w-2xl rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-5 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="size-5" aria-hidden />
        </div>

        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Ocurrio un error inesperado
        </h1>
        <p className="mt-2 text-pretty text-sm text-muted-foreground sm:text-base">
          No pudimos completar esta accion. Puedes intentarlo nuevamente o volver al inicio del
          sitio.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset} className="h-11 min-w-10 active:scale-[0.96] transition-transform">
            <RefreshCw className="mr-2 size-4" aria-hidden />
            Reintentar
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 min-w-10 active:scale-[0.96] transition-transform"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" aria-hidden />
              Volver al inicio
            </Link>
          </Button>
        </div>

        <div className="mt-6 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground tabular-nums">
          Codigo de soporte: {supportCode}
        </div>
      </section>
    </main>
  )
}
