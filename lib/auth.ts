import { dash } from "@better-auth/infra"
import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { headers } from "next/headers"
import { pool } from "@/lib/db"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-in/email" && ctx.path !== "/sign-up/email") return

      const email = (ctx.body as { email?: string })?.email
      if (!email?.trim()) return

      const result = await pool.query<{ id: string; isActive: boolean | null }>(
        `SELECT id, "isActive" FROM "user" WHERE LOWER(email) = LOWER($1)`,
        [email.trim()]
      )
      const row = result.rows[0]
      if (row && row.isActive === false) {
        throw new APIError("UNAUTHORIZED", {
          message: "Tu cuenta está desactivada. Contacta al administrador.",
        })
      }
      if (ctx.path === "/sign-up/email" && row) {
        throw new APIError("CONFLICT", {
          message: "Ya existe una cuenta con este email.",
        })
      }
    }),
  },
  appName: "Biovity", // Define your application name
  database: pool,
  rateLimit: {
    enabled: true,
    window: 60, // 1 minute
    max: 10, // 10 requests per minute per IP
  },
  trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((s) => s.trim())
    : [
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "https://biovity.cl",
        "https://www.biovity.cl",
      ],
  experimental: {
    joins: true, // Enable database joins for better performance
  },
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === "production",
      domain: process.env.BETTER_AUTH_COOKIE_DOMAIN || ".biovity.cl",
    },
    ipAddress: {
      ipAddressHeaders: [
        "cf-connecting-ip",
        "x-vercel-forwarded-for",
        "x-forwarded-for",
        "x-real-ip",
      ],
    },
  },
  account: {
    modelName: "account",
    fields: {
      userId: "user_id",
      providerId: "provider",
      accountId: "provideraccountid",
      refreshToken: "refresh_token",
      accessToken: "access_token",
      accessTokenExpiresAt: "expires_at",
      refreshTokenExpiresAt: "refreshTokenExpiresAt",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  user: {
    modelName: "user",
    fields: {
      email: "email",
      name: "name",
      emailVerified: "isEmailVerified",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      image: "avatar",
    },
    additionalFields: {
      isActive: {
        type: "boolean",
        required: false,
        input: false,
      },
      avatar: {
        type: "string",
        required: false,
        input: true,
      },
      profession: {
        type: "string",
        required: true,
        input: true,
      },
      verificationToken: {
        type: "string",
        required: false,
        input: false,
      },
      type: {
        type: "string",
        required: true,
        input: true,
      },
      organizationId: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  session: {
    modelName: "session",
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      token: "token",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    expiresIn: 604800, // 7 days
    updateAge: 86400, // 1 day - sessions refresh after 1 day of activity
    storeSessionInDatabase: true, // Required for revokeSessions() to work
    cookieCache: {
      enabled: true,
      maxAge: 300, // 5 minutes cache
      refreshCache: {
        updateAge: 60, // Refresh when 60 seconds remain
      },
    },
  },
  verification: {
    modelName: "verification",
    fields: {
      identifier: "identifier",
      value: "value",
      expiresAt: "expiresAt",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
  },
  plugins: [
    nextCookies(),
    ...(process.env.BETTER_AUTH_API_KEY ? [dash({ apiKey: process.env.BETTER_AUTH_API_KEY })] : []),
  ],
})

export type UserRole = "admin" | "professional" | "organization"

/** Returns true if session user is admin (ADMIN_EMAILS or user.type === "admin"). */
export function isAdminSession(session: { user: { email?: string } } | null): boolean {
  if (!session?.user?.email) return false
  const user = session.user as { type?: string }
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) ?? []
  return adminEmails.includes(session.user.email) || user.type === "admin"
}

/**
 * Server-side role check for conditional routing (e.g. Parallel Routes).
 * Returns user role from session; admin if email is in ADMIN_EMAILS env.
 * Inactive users (isActive === false) are treated as unauthenticated.
 */
export async function checkUserRole(): Promise<UserRole | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user) return null

  const user = session.user as { type?: string; isActive?: boolean }
  if (user.isActive === false) return null

  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) ?? []
  if (adminEmails.includes(session.user.email)) return "admin"
  if (user.type === "admin") return "admin"

  const userType = user.type
  if (userType === "professional" || userType === "organization") return userType
  return "professional"
}
