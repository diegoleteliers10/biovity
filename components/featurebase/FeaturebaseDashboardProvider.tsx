"use client"

import { FeaturebaseProvider, useFeedbackWidget } from "featurebase-js/react"
import { type ReactNode, useEffect, useState } from "react"

const RESOLVER_CACHE_PREFIX = "featurebase-js:org:"
const RESOLVER_CACHE_TTL_MS = 20 * 60 * 1000
const RESOLVER_URL = "https://do.featurebase.app/v1/organization/by-id/"

function hasCachedOrg(appId: string) {
  try {
    const raw = window.localStorage.getItem(RESOLVER_CACHE_PREFIX + appId)
    if (!raw) return false
    const parsed = JSON.parse(raw) as { fetchedAt?: number; info?: { slug?: string } }
    return (
      typeof parsed.fetchedAt === "number" &&
      Date.now() - parsed.fetchedAt <= RESOLVER_CACHE_TTL_MS &&
      typeof parsed.info?.slug === "string"
    )
  } catch {
    return false
  }
}

const priming = new Map<string, Promise<void>>()

function primeOrgSlug(appId: string) {
  const existing = priming.get(appId)
  if (existing) return existing
  const promise = (async () => {
    if (hasCachedOrg(appId)) return
    try {
      const res = await fetch(`${RESOLVER_URL}${encodeURIComponent(appId)}`)
      const body = await res.json()
      if (!res.ok || !body || body.success === false || typeof body.slug !== "string") return
      window.localStorage.setItem(
        RESOLVER_CACHE_PREFIX + appId,
        JSON.stringify({
          info: { slug: body.slug, modules: { support: Boolean(body.modules?.support) } },
          fetchedAt: Date.now(),
        })
      )
    } catch {}
  })()
  priming.set(appId, promise)
  return promise
}

function FeedbackWidget({ board }: { board?: string }) {
  useFeedbackWidget({
    theme: "light",
    placement: "bottom-right",
    defaultBoard: board,
    locale: "es",
  })
  return null
}

export function FeaturebaseDashboardProvider({
  appId,
  jwt,
  board,
  children,
}: {
  appId: string
  jwt: string
  board?: string
  children: ReactNode
}) {
  const [primed, setPrimed] = useState(false)

  useEffect(() => {
    let cancelled = false
    primeOrgSlug(appId).finally(() => {
      if (!cancelled) setPrimed(true)
    })
    return () => {
      cancelled = true
    }
  }, [appId])

  return (
    <>
      {primed && (
        <FeaturebaseProvider
          appId={appId}
          featurebaseJwt={jwt}
          messenger
          hideDefaultLauncher
          theme="light"
          language="es"
        >
          <FeedbackWidget board={board} />
        </FeaturebaseProvider>
      )}
      {children}
    </>
  )
}
