"use client"

import { useCallback, useEffect, useState } from "react"

export type Theme = "light" | "dark"

const STORAGE_KEY = "biovity-theme"
const DARK_QUERY = "(prefers-color-scheme: dark)"

function readStored(): Theme | null {
  if (typeof window === "undefined") return null
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === "dark" || value === "light" ? value : null
  } catch {
    // Private mode or blocked storage. The OS preference still applies.
    return null
  }
}

function systemTheme(): Theme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light"
}

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
 * Theme state for the dashboard only. The landing has no toggle, so it keeps
 * following the OS through the shared tokens.
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

  // Follow the OS only while the visitor has never chosen. An explicit choice
  // must survive the sun going down.
  useEffect(() => {
    if (readStored()) return
    const media = window.matchMedia(DARK_QUERY)
    const onChange = () => {
      const next = systemTheme()
      apply(next)
      setTheme(next)
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [])

  return { theme, setTheme: apply, toggle, ready }
}

/**
 * Runs before first paint. Without it the page renders light and then flips,
 * which reads as a flash on every navigation.
 *
 * Deliberately inline and dependency-free: it has to be a blocking script in
 * the document head, so it cannot wait for a bundle.
 */
export const themeScript = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var d=s?s==='dark':matchMedia('${DARK_QUERY}').matches;var r=document.documentElement;r.classList.toggle('dark',d);r.dataset.theme=d?'dark':'light';var m=document.querySelector('meta[name="theme-color"]');if(m)m.content=d?'${CHROME.dark}':'${CHROME.light}'}catch(e){}})()`
