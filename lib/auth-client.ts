import { sentinelClient } from "@better-auth/infra/client"
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

export async function signOutAndRedirect(redirectUrl: string): Promise<void> {
  await signOut()
  window.location.replace(redirectUrl)
}

export async function signOutAndHardRedirect(redirectUrl: string): Promise<void> {
  await signOut()
  window.location.replace(redirectUrl)
}

export async function signInWithHardRedirect(
  ...args: Parameters<typeof signIn.email>
): Promise<ReturnType<typeof signIn.email>> {
  const result = await signIn.email(...args)
  return result
}
