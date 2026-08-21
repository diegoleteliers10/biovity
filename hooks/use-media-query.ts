// @env browser
import { useMemo, useSyncExternalStore } from "react"

const SERVER_SNAPSHOT = () => false

export function useMediaQuery(query: string): boolean {
  const subscribe = useMemo(
    () => (callback: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", callback)
      return () => mql.removeEventListener("change", callback)
    },
    [query]
  )

  const getSnapshot = useMemo(() => () => window.matchMedia(query).matches, [query])

  return useSyncExternalStore(subscribe, getSnapshot, SERVER_SNAPSHOT)
}
