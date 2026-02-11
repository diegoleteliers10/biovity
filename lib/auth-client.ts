import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    inferAdditionalFields({
      user: {
        type: {
          type: "string",
          required: true,
        },
        profession: {
          type: "string",
          required: true,
        },
        avatar: {
          type: "string",
          required: false,
        },
        isActive: {
          type: "boolean",
          required: false,
        },
        organizationId: {
          type: "string",
          required: false,
        },
      },
    }),
  ],
})

// Export typed hooks and methods for convenience
export const { useSession, signIn, signUp, signOut } = authClient
