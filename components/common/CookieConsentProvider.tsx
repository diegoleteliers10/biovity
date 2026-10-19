"use client"

import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Link from "next/link"
import { createContext, useContext, useState } from "react"
import { COOKIE_CONSENT_COOKIE, type CookieConsent } from "@/lib/cookie-consent"

type CookiePreferencesContextValue = {
  openPreferences: () => void
}

type CookieConsentProviderProps = {
  children: React.ReactNode
  initialConsent: CookieConsent | null
}

const CookiePreferencesContext = createContext<CookiePreferencesContextValue | null>(null)
const COOKIE_CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180

const saveConsent = (consent: CookieConsent) => {
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  // biome-ignore lint/suspicious/noDocumentCookie: The server reads this choice on the next request.
  document.cookie = `${COOKIE_CONSENT_COOKIE}=${consent}; Path=/; Max-Age=${COOKIE_CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure}`
}

export function CookieConsentProvider({ children, initialConsent }: CookieConsentProviderProps) {
  const [consent, setConsent] = useState<CookieConsent | null>(initialConsent)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(initialConsent === "all")

  const handleAcceptAll = () => {
    saveConsent("all")
    setConsent("all")
    setAnalyticsEnabled(true)
    setPreferencesOpen(false)
  }

  const handleRejectOptional = () => {
    saveConsent("essential")
    if (consent === "all") {
      window.location.reload()
      return
    }
    setConsent("essential")
    setAnalyticsEnabled(false)
    setPreferencesOpen(false)
  }

  const handleOpenPreferences = () => {
    setAnalyticsEnabled(consent === "all")
    setPreferencesOpen(true)
  }

  const handleSavePreferences = () => {
    const nextConsent = analyticsEnabled ? "all" : "essential"
    saveConsent(nextConsent)
    if (consent === "all" && nextConsent === "essential") {
      window.location.reload()
      return
    }
    setConsent(nextConsent)
    setPreferencesOpen(false)
  }

  const contextValue = { openPreferences: handleOpenPreferences }

  return (
    <CookiePreferencesContext.Provider value={contextValue}>
      {children}
      {consent === "all" && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
      {consent === null && !preferencesOpen && (
        <section
          aria-label="Preferencias de cookies"
          className="fixed inset-x-4 bottom-20 z-[80] mx-auto max-w-5xl rounded-xl border border-border bg-surface-container-lowest p-5 text-foreground sm:inset-x-6 sm:bottom-6 sm:p-6"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-base font-semibold">Tu privacidad importa</h2>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                Usamos cookies esenciales para que Biovity funcione. Si aceptas, también medimos el
                uso y el rendimiento del sitio. Puedes cambiar tu elección cuando quieras.
              </p>
              <Link
                className="mt-2 inline-flex text-sm font-medium text-secondary underline underline-offset-4"
                href="/cookies"
              >
                Política de cookies
              </Link>
            </div>
            <div className="flex flex-wrap gap-2 md:shrink-0">
              <button
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                onClick={handleRejectOptional}
                type="button"
              >
                Rechazar opcionales
              </button>
              <button
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                onClick={handleOpenPreferences}
                type="button"
              >
                Configurar
              </button>
              <button
                className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                onClick={handleAcceptAll}
                type="button"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        </section>
      )}
      {preferencesOpen && (
        <section
          aria-label="Configurar cookies"
          className="fixed inset-x-4 bottom-20 z-[80] mx-auto max-w-2xl rounded-xl border border-border bg-surface-container-lowest p-5 text-foreground sm:inset-x-6 sm:bottom-6 sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold">Configurar cookies</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Las cookies esenciales siempre están activas. Elige si también permites analítica.
              </p>
            </div>
            <button
              aria-label="Cerrar configuración"
              className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-surface-container-low hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              onClick={() => setPreferencesOpen(false)}
              type="button"
            >
              Cerrar
            </button>
          </div>
          <div className="mt-5 divide-y divide-border border-y border-border">
            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium">Cookies esenciales</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Necesarias para la sesión y las funciones principales.
                </p>
              </div>
              <span className="shrink-0 text-xs font-medium text-muted-foreground">
                Siempre activas
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium">Analítica y rendimiento</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ayuda a entender el uso del sitio y detectar problemas de rendimiento.
                </p>
              </div>
              <button
                aria-checked={analyticsEnabled}
                aria-label="Permitir analítica y medición de rendimiento"
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${analyticsEnabled ? "bg-primary" : "bg-muted"}`}
                onClick={() => setAnalyticsEnabled((enabled) => !enabled)}
                role="switch"
                type="button"
              >
                <span
                  className={`inline-block size-4 rounded-full bg-primary-foreground transition-transform ${analyticsEnabled ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <button
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              onClick={handleRejectOptional}
              type="button"
            >
              Rechazar opcionales
            </button>
            <button
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              onClick={handleSavePreferences}
              type="button"
            >
              Guardar preferencias
            </button>
          </div>
        </section>
      )}
    </CookiePreferencesContext.Provider>
  )
}

export function CookiePreferencesButton() {
  const preferences = useContext(CookiePreferencesContext)
  if (!preferences) return null

  return (
    <button
      className="text-left text-sm text-neutral-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      onClick={preferences.openPreferences}
      type="button"
    >
      Preferencias de cookies
    </button>
  )
}
