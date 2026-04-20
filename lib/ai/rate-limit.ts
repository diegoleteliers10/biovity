/**
 * AI-specific rate limiting with sliding window algorithm.
 * Supports both authenticated users (by userId) and unauthenticated (by IP).
 */

import { RATE_LIMITS } from "./env"

const WINDOW_MS = 60 * 1000

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfter?: number
  limit: number
}

export function checkRateLimit(
  identifier: string,
  limit: number = RATE_LIMITS.AUTHENTICATED_RPM
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(identifier)

  if (!entry || now > entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + WINDOW_MS })
    return {
      allowed: true,
      remaining: limit - 1,
      limit,
    }
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      limit,
    }
  }

  entry.count += 1
  return {
    allowed: true,
    remaining: limit - entry.count,
    limit,
  }
}

export function getUserRateLimit(isAuthenticated: boolean): number {
  return isAuthenticated ? RATE_LIMITS.AUTHENTICATED_RPM : RATE_LIMITS.UNAUTHENTICATED_RPM
}

export function cleanExpiredEntries(): void {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key)
    }
  }
}

setInterval(cleanExpiredEntries, 5 * 60 * 1000)
