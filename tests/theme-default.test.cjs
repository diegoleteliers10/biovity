const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const read = p => fs.readFileSync(path.join(root, p), 'utf8')

const theme = read('lib/theme.ts')

const STORAGE_KEY = theme.match(/const STORAGE_KEY = "([^"]+)"/)[1]
const CHROME = {
  light: theme.match(/light: "(#[0-9a-f]{3,8})"/)[1],
  dark: theme.match(/dark: "(#[0-9a-f]{3,8})"/)[1],
}

/**
 * Run the blocking head script against a fake DOM. A fresh document starts
 * without the dark class, the same as <html> in app/layout.tsx.
 */
function runScript(localStorage) {
  const documentElement = {
    classList: {
      values: [false],
      toggle(_name, on) {
        this.values = [on]
      },
    },
    dataset: {},
  }
  const meta = { content: '' }
  const querySelector = sel => (sel === 'meta[name="theme-color"]' ? meta : null)
  // The script interpolates module constants, which only exist after the build.
  const body = theme
    .match(/export const themeScript = `([\s\S]*)`/)[1]
    .replaceAll('${STORAGE_KEY}', STORAGE_KEY)
    .replaceAll('${CHROME.dark}', CHROME.dark)
    .replaceAll('${CHROME.light}', CHROME.light)
  // biome-ignore lint/security/noGlobalEval: the code under test is a string literal read from the repo
  new Function('localStorage', 'document', body)(localStorage, {
    documentElement,
    querySelector,
  })
  return { dark: documentElement.classList.values[0], dataset: documentElement.dataset, meta: meta.content }
}

test('a visitor with no stored preference gets light', () => {
  const result = runScript({ getItem: () => null })
  assert.equal(result.dark, false)
  assert.equal(result.dataset.theme, 'light')
  assert.equal(result.meta, CHROME.light)
})

test('the OS preference cannot turn on dark mode', () => {
  // matchMedia is deliberately not provided. A dark OS must not reach the script.
  assert.ok(!theme.includes('prefers-color-scheme'), 'no media query can set the theme')
  assert.ok(!theme.includes('matchMedia'), 'nothing reads the OS preference')
})

test('a stored choice survives reloads, in both directions', () => {
  const dark = runScript({ getItem: () => 'dark' })
  assert.equal(dark.dark, true)
  assert.equal(dark.dataset.theme, 'dark')
  assert.equal(dark.meta, CHROME.dark)

  const light = runScript({ getItem: () => 'light' })
  assert.equal(light.dark, false)
  assert.equal(light.dataset.theme, 'light')
  assert.equal(light.meta, CHROME.light)
})

test('blocked storage leaves the visitor in light mode', () => {
  const blocked = runScript({
    getItem: () => {
      throw new Error('storage disabled')
    },
  })
  assert.equal(blocked.dark, false)
  assert.equal(blocked.dataset.theme, undefined)
})

test('no component reads the OS theme preference', () => {
  // A tile set or a chart that follows the OS renders dark inside a light page.
  const map = read('components/ui/map.tsx')
  assert.ok(!map.includes('prefers-color-scheme'), 'the map must follow the app theme')
  assert.match(map, /getDocumentTheme\(\) \?\? "light"/, 'a missing theme is light')
})

test('only the signed-in sidebar exposes the toggle', () => {
  const sidebar = read('components/dashboard/shared/DashboardSidebar.tsx')
  assert.match(sidebar, /onClick=\{toggle\}/)
  assert.match(sidebar, /useTheme\(\)/)
})
