export function matchesOrganizationEmailDomain(email: string, website: string): boolean {
  const emailDomain = email.trim().toLowerCase().split("@").at(-1)
  const websiteHost = website
    .trim()
    .toLowerCase()
    .match(/^https?:\/\/([^/:?#]+)/)?.[1]
  const normalizeDomain = (domain: string | undefined) =>
    domain?.replace(/^www\./, "").replace(/\.$/, "")
  return Boolean(
    emailDomain && websiteHost && normalizeDomain(emailDomain) === normalizeDomain(websiteHost)
  )
}
