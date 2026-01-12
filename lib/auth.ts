import { betterAuth } from "better-auth"
import { Pool } from "pg"
import { createAuthMiddleware } from "better-auth/api"

export const auth = betterAuth({
  database: new Pool({
    connectionString:
      "postgresql://postgres:AlineLarroucau270221_@db.ozdaoqgtvjdfkpqosnnj.supabase.co:5432/postgres",
  }),
	hooks: {
		before: createAuthMiddleware(async (_ctx) => {
		}),
	},
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
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
      refreshTokenExpiresAt: "refreshTokenExpiresAt", // Added missing field
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
        input: false,
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
    updateAge: 86400, // 1 day
    disableSessionRefresh: true,
    additionalFields: {
      customField: {
        type: "string",
        required: false,
        input: false,
      },
    },
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
    level: "debug",
	}
})
