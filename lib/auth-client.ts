import { sentinelClient } from "@better-auth/infra/client"
import type { QueryClient } from "@tanstack/react-query"
import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export type AuthUser = {
  id: string
  name?: string
  email: string
  image?: string
  type: "professional" | "organization" | "admin"
  profession: string
  avatar?: string
  isActive?: boolean
  organizationId?: string
}

export function getDashboardPath(_userType?: string): string {
  return "/dashboard"
}

export function createRoleBasedRedirect(_user: AuthUser | undefined): string {
  return "/dashboard"
}

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    inferAdditionalFields({
      user: {
        type: { type: "string", required: true },
        profession: { type: "string", required: true },
        avatar: { type: "string", required: false },
        isActive: { type: "boolean", required: false },
        organizationId: { type: "string", required: false },
        verificationToken: { type: "string", required: false },
      },
    }),
    sentinelClient(),
  ],
})

export const { useSession, signIn, signUp, signOut } = authClient

let globalQueryClient: QueryClient | null = null

export function setGlobalQueryClient(client: QueryClient) {
  globalQueryClient = client
}

export async function signOutAndRedirect(redirectUrl: string): Promise<void> {
  if (globalQueryClient) {
    await globalQueryClient.cancelQueries()
    globalQueryClient.clear()
  }
  await signOut()
  window.location.href = redirectUrl
}
