import { dash } from "@better-auth/infra"
import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins"
import { headers } from "next/headers"
import { pool } from "@/lib/db"

export const auth = betterAuth({
  appName: "Biovity", // Define your application name
  database: pool,
  cookieCache: {
    enabled: true,
    strategy: "jwe", // Use JWE to encrypt cookie contents; ensure encryption keys are managed securely
    maxAge: 60 * 5, // Explicitly cache session cookies for 5 minutes
  },
  // Rate limiting for security
  rateLimit: {
    enabled: true,
    window: 60, // 1 minute
    max: 10, // 10 requests per minute per IP
  },
  experimental: {
    joins: process.env.BETTER_AUTH_EXPERIMENTAL_JOINS === "true", // Enable database joins conditionally via env flag
  },
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
    useSecureCookies: process.env.NODE_ENV === "production",
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
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
  },
  plugins: [
    dash({
      apiKey: process.env.BETTER_AUTH_API_KEY as string,
    }),
    ...(process.env.NODE_ENV !== "production" ? [admin()] : []),
  ],
})

export type UserRole = "admin" | "professional" | "organization"

/**
 * Server-side role check for conditional routing (e.g. Parallel Routes).
 * Returns user role from session; admin if email is in ADMIN_EMAILS env.
 */
export async function checkUserRole(): Promise<UserRole | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user) return null

  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) ?? []
  if (adminEmails.includes(session.user.email)) return "admin"

  const userType = (session.user as { type?: string }).type
  if (userType === "professional" || userType === "organization") return userType
  return "professional"
}
