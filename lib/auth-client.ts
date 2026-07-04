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

function resolveAuthBaseURL(): string {
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_SITE_URL || "https://biovity.cl"
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

export const authClient = createAuthClient({
  baseURL: resolveAuthBaseURL(),
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
    sentinelClient({
      identifyUrl: process.env.NEXT_PUBLIC_BETTER_AUTH_IDENTIFY_URL,
    }),
  ],
})

export const { useSession, signIn, signOut } = authClient

type SessionAtom = {
  set: (v: {
    data: null
    error: null
    isPending: boolean
    isRefetching: boolean
    refetch: () => void
  }) => void
  get: () => {
    data: unknown
    error: unknown
    isPending: boolean
    isRefetching: boolean
    refetch: () => void
  }
}

function clearSessionAtom() {
  const sessionAtom = authClient.$store.atoms.session as SessionAtom
  const current = sessionAtom.get()
  sessionAtom.set({
    data: null,
    error: null,
    isPending: false,
    isRefetching: false,
    refetch: current.refetch,
  })
}

export async function signOutAndRedirect(redirectUrl: string): Promise<void> {
  clearSessionAtom()
  await signOut()
  window.location.href = redirectUrl
}
