"use client"

import {
  ArrowRight01Icon,
  CallIcon,
  CheckmarkCircle02Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Result } from "better-result"
import Link from "next/link"
import { useState } from "react"
import { validateOrganizationContact } from "@/lib/validations"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"

export function CTAContacto() {
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "submitting") return
    setErrors({})

    const formData = new FormData(event.currentTarget)
    const data = {
      nombre: formData.get("nombre"),
      apellido: formData.get("apellido"),
      email: formData.get("email"),
      telefono: formData.get("telefono"),
      empresa: formData.get("empresa"),
      mensaje: formData.get("mensaje"),
    }
    const validation = validateOrganizationContact(data)

    if (!validation.success) {
      setErrors(validation.errors ?? {})
      return
    }

    setStatus("submitting")
    const request = await Result.tryPromise(() =>
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    )

    if (request.isErr()) {
      setStatus("idle")
      setErrors({ form: "Error de conexión. Verifica tu red e intenta de nuevo." })
      return
    }

    const response = request.value
    const responseBody = await Result.tryPromise(async (): Promise<unknown> => response.json())
    const payload = responseBody.isOk() ? responseBody.value : null
    if (
      !response.ok ||
      typeof payload !== "object" ||
      payload === null ||
      !("success" in payload) ||
      payload.success !== true
    ) {
      const message =
        typeof payload === "object" &&
        payload !== null &&
        "error" in payload &&
        typeof payload.error === "string" &&
        payload.error.length > 0
          ? payload.error
          : "No pudimos enviar tu mensaje. Intenta de nuevo."
      setStatus("idle")
      setErrors({ form: message })
      return
    }

    setStatus("submitted")
  }

  return (
    <section
      id="contacto"
      aria-labelledby="companies-contact-title"
      className="bg-surface-container-low py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div data-company-reveal className="lg:col-span-5">
            <span className="mb-5 block font-mono text-xs font-semibold uppercase tracking-wider text-secondary">
              Hablemos de tu equipo
            </span>
            <h2
              id="companies-contact-title"
              className="mb-10 text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-4xl"
            >
              ¿Listo para encontrar tu próximo{" "}
              <span className="text-accent font-semibold">talento científico</span>?
            </h2>
            <div className="mb-10 divide-y divide-border/60 border-y border-border/60">
              <a
                href="mailto:dleteliers@biovity.cl"
                className="flex min-h-16 items-center gap-4 py-4 text-sm text-foreground transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest text-secondary">
                  <HugeiconsIcon icon={Mail01Icon} size={18} />
                </div>
                <span className="font-medium">dleteliers@biovity.cl</span>
              </a>

              <a
                href="tel:+56978181654"
                className="flex min-h-16 items-center gap-4 py-4 text-sm text-foreground transition-colors hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest text-secondary">
                  <HugeiconsIcon icon={CallIcon} size={18} />
                </div>
                <span className="font-medium">+56 9 7818 1654</span>
              </a>
            </div>

            <Button
              size="lg"
              variant="outline"
              className="h-11 px-5 bg-surface-container-lowest border border-border hover:bg-surface-container-low rounded-lg text-sm font-medium motion-reduce:transition-none"
              asChild
            >
              <Link href="/register/organization">
                Publicar una oferta
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1.5" />
              </Link>
            </Button>
          </div>

          <div data-company-reveal className="min-w-0 lg:col-span-7">
            {status === "submitted" ? (
              <div
                role="status"
                className="rounded-xl bg-surface-container-lowest p-8 text-center sm:p-12"
              >
                <div className="size-14 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mx-auto mb-4 text-secondary">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={28} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  ¡Mensaje enviado con éxito!
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto text-pretty">
                  Nos pondremos en contacto contigo dentro de las próximas 24 horas hábiles. Gracias
                  por tu interés en Biovity.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                aria-busy={status === "submitting"}
                className="rounded-xl border border-border/40 bg-surface-container-lowest p-5 sm:p-8 md:p-10"
              >
                <div className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-baseline border-b border-border/60 pb-5">
                  <h3 className="text-lg font-semibold text-foreground">
                    Contacta a nuestro equipo
                  </h3>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    * Obligatorio
                  </span>
                </div>

                {Object.keys(errors).length > 0 && (
                  <div
                    id="companies-contact-errors"
                    role="alert"
                    className="mb-5 p-3.5 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs font-medium"
                  >
                    <ul className="space-y-1">
                      {Object.entries(errors).map(([field, message]) => (
                        <li key={field}>{message}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="nombre"
                        className="block text-xs font-medium text-foreground mb-2.5"
                      >
                        Nombre <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="nombre"
                        autoComplete="given-name"
                        name="nombre"
                        aria-invalid={Boolean(errors.nombre)}
                        aria-describedby={errors.nombre ? "companies-contact-errors" : undefined}
                        required
                        placeholder="Tu nombre"
                        className={`h-11 text-sm bg-surface-container-lowest border-border rounded-lg motion-reduce:transition-none ${
                          errors.nombre
                            ? "border-destructive focus-visible:ring-destructive/30"
                            : ""
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="apellido"
                        className="block text-xs font-medium text-foreground mb-2.5"
                      >
                        Apellido <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="apellido"
                        autoComplete="family-name"
                        name="apellido"
                        aria-invalid={Boolean(errors.apellido)}
                        aria-describedby={errors.apellido ? "companies-contact-errors" : undefined}
                        required
                        placeholder="Tu apellido"
                        className="h-11 text-sm bg-surface-container-lowest border-border rounded-lg motion-reduce:transition-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-medium text-foreground mb-2.5"
                      >
                        Email corporativo <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="email"
                        autoComplete="email"
                        name="email"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "companies-contact-errors" : undefined}
                        type="email"
                        required
                        placeholder="tu@empresa.cl"
                        className="h-11 text-sm bg-surface-container-lowest border-border rounded-lg motion-reduce:transition-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="empresa"
                        className="block text-xs font-medium text-foreground mb-2.5"
                      >
                        Empresa / Institución <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="empresa"
                        autoComplete="organization"
                        name="empresa"
                        aria-invalid={Boolean(errors.empresa)}
                        aria-describedby={errors.empresa ? "companies-contact-errors" : undefined}
                        required
                        placeholder="Nombre de la entidad"
                        className="h-11 text-sm bg-surface-container-lowest border-border rounded-lg motion-reduce:transition-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="telefono"
                      className="block text-xs font-medium text-foreground mb-2.5"
                    >
                      Teléfono <span className="text-muted-foreground font-normal">(opcional)</span>
                    </label>
                    <Input
                      id="telefono"
                      autoComplete="tel"
                      name="telefono"
                      aria-invalid={Boolean(errors.telefono)}
                      aria-describedby={errors.telefono ? "companies-contact-errors" : undefined}
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      className="h-11 text-sm bg-surface-container-lowest border-border rounded-lg motion-reduce:transition-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="mensaje"
                      className="block text-xs font-medium text-foreground mb-2.5"
                    >
                      ¿Cómo podemos ayudarte? <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      aria-invalid={Boolean(errors.mensaje)}
                      aria-describedby={errors.mensaje ? "companies-contact-errors" : undefined}
                      rows={3}
                      required
                      placeholder="Cuéntanos sobre los perfiles o vacantes que buscas cubrir."
                      className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-border rounded-lg font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 focus:outline-none transition-colors resize-y motion-reduce:transition-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-medium mt-2"
                  >
                    {status === "submitting" ? (
                      <>
                        <span className="size-4 border-2 border-current/30 border-t-current rounded-full animate-spin mr-2 motion-reduce:animate-none" />
                        Enviando solicitud...
                      </>
                    ) : (
                      <>
                        Enviar mensaje
                        <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="ml-1.5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
