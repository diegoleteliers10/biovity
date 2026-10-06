"use client"

import { useCallback, useEffect, useState } from "react"

export type Theme = "light" | "dark"

const STORAGE_KEY = "biovity-theme"

function apply(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  root.dataset.theme = theme
  syncBrowserChrome(theme)
}

/**
 * The address bar on mobile takes its colour from this meta tag. Left on a
 * fixed value it stays light while the dashboard behind it goes dark, which is
 * the most visible part of a broken theme. Mirrors --primary and --background.
 */
const CHROME: Record<Theme, string> = {
  light: "#00374a",
  dark: "#141414",
}

function syncBrowserChrome(theme: Theme) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = CHROME[theme]
}

/**
 * Theme state for the dashboard only. Light is the default for everyone: a
 * visitor who has never chosen sees light even when the OS is set to dark. The
 * landing has no toggle, so it stays light as well.
 *
 * The first render is always "light" on purpose: `app/layout.tsx` is a Server
 * Component, so the real class is set by the blocking script in its head before
 * first paint. Reading the DOM here would report a different value than what is
 * on screen and produce a hydration mismatch.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const current = document.documentElement.classList.contains("dark") ? "dark" : "light"
    setTheme(current)
    setReady(true)
  }, [])

  const toggle = useCallback(() => {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark"
    apply(next)
    setTheme(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Preference cannot be persisted. The session still switches.
    }
  }, [])

  return { theme, setTheme: apply, toggle, ready }
}

/**
 * Runs before first paint. Without it the page renders light and then flips,
 * which reads as a flash on every navigation.
 *
 * Only an explicit stored choice turns the dark class on. A visitor with a dark
 * OS and no stored preference gets light.
 *
 * Deliberately inline and dependency-free: it has to be a blocking script in
 * the document head, so it cannot wait for a bundle.
 */
export const themeScript = `(function(){try{var d=localStorage.getItem('${STORAGE_KEY}')==='dark';var r=document.documentElement;r.classList.toggle('dark',d);r.dataset.theme=d?'dark':'light';var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=d?'${CHROME.dark}':'${CHROME.light}'}catch(e){}})()`
