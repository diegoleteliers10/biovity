import { betterAuth } from "better-auth"
import { pool } from "@/lib/db"

export const auth = betterAuth({
  database: pool,
  // Rate limiting for security
  rateLimit: {
    enabled: true,
    window: 60, // 1 minute
    max: 10, // 10 requests per minute per IP
  },
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
    useSecureCookies: process.env.NODE_ENV === "production",
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
    cookieCache: {
      enabled: true,
      maxAge: 300, // 5 minutes
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
    level: process.env.NODE_ENV === "production" ? "error" : "debug",
  },
})
