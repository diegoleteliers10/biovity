/**
 * Simple in-memory rate limiter by IP.
 * Note: In serverless (Vercel), each instance has its own memory.
 * For production at scale, consider Upstash Redis or similar.
 */
const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 5

const store = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const entry = store.get(identifier)

  if (!entry) {
    store.set(identifier, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true }
  }

  if (now > entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true }
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count += 1
  return { allowed: true }
}
