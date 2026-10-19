export const COOKIE_CONSENT_COOKIE = "biovity-cookie-consent"

export type CookieConsent = "all" | "essential"

export const parseCookieConsent = (value: string | undefined): CookieConsent | null => {
  if (value === "all" || value === "essential") return value
  return null
}
