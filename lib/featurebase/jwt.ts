// @env node
import { createHmac } from "node:crypto"
import { FEATUREBASE_JWT_SECRET } from "./config"

const base64url = (value: string) => Buffer.from(value, "utf8").toString("base64url")

export function signFeaturebaseJwt(payload: Record<string, unknown>): string {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const body = base64url(JSON.stringify(payload))
  const signature = createHmac("sha256", FEATUREBASE_JWT_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url")
  return `${header}.${body}.${signature}`
}
