import { inferAdditionalFields } from "better-auth/client/plugins"
import type { DBFieldType } from "better-auth/db"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  plugins: [
    inferAdditionalFields({
      user: {
        type: { type: "string" as DBFieldType },
      },
    }),
  ],
  baseURL: "http://localhost:3000",
})
