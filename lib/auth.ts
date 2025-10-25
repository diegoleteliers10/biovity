import { betterAuth } from "better-auth"
import { Pool } from "pg"

export const auth = betterAuth({
  database: new Pool({
    connectionString:
      "postgresql://postgres:J5qvqaP0mU8XscNT@db.ozdaoqgtvjdfkpqosnnj.supabase.co:5432/postgres",
  }),
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
  account: {
    fields: {
      userId: "user_id",
      providerId: "provider", // mapea providerId de Better Auth a tu columna 'provider'
      accountId: "provideraccountid", // mapea accountId de Better Auth a tu columna 'providerAccountId'
      refreshToken: "refresh_token",
      accessToken: "access_token",
      accessTokenExpiresAt: "expires_at",
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
      },
      verificationToken: {
        type: "string",
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
    updateAge: 86400, // 1 day
    disableSessionRefresh: true, // Disable session refresh so that the session is not updated regardless of the `updateAge` option. (default: `false`)
    additionalFields: {
      // Additional fields for the session table
      customField: {
        type: "string",
      },
    },
    cookieCache: {
      enabled: true, // Enable caching session in cookie (default: `false`)
      maxAge: 300, // 5 minutes
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET as string,
    },
  },
  logger: {
    level: "debug",
    transport: {
      console: {
        level: "debug",
      },
    },
  },
})
