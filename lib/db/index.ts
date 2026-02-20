/**
 * Shared PostgreSQL connection pool.
 *
 * Supabase Postgres best practices (conn-pooling, conn-limits, conn-idle-timeout):
 * - Single pool reused across the app to avoid connection exhaustion
 * - Explicit max connections to prevent memory exhaustion
 * - Idle timeout to reclaim unused connections
 *
 * @see https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler
 */
import { Pool } from "pg"

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  // conn-limits: prevent exhausting DB connections (default pg max=10)
  max: 10,
  // conn-idle-timeout: reclaim idle connections after 30s
  idleTimeoutMillis: 30_000,
  // Fail fast if connection takes > 5s
  connectionTimeoutMillis: 5_000,
}

export const pool = new Pool(poolConfig)
