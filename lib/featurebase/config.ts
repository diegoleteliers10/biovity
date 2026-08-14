export const FEATUREBASE_APP_ID = process.env.NEXT_PUBLIC_FEATUREBASE_APP_ID ?? ""

export const FEATUREBASE_JWT_SECRET = process.env.FEATUREBASE_JWT_SECRET ?? ""

export const FEATUREBASE_BOARDS: Record<"professional" | "organization" | "admin", string> = {
  professional: process.env.FEATUREBASE_BOARD_PROFESSIONAL ?? "profesionales",
  organization: process.env.FEATUREBASE_BOARD_ORGANIZATION ?? "organizaciones",
  admin: process.env.FEATUREBASE_BOARD_ADMIN ?? "admin",
}

export function isFeaturebaseEnabled(): boolean {
  return Boolean(FEATUREBASE_APP_ID && FEATUREBASE_JWT_SECRET)
}
