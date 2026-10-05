const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const path = require('node:path')

const globals = fs.readFileSync(path.join(__dirname, '..', 'app', 'globals.css'), 'utf8')

const srgbGamma = v => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055)
const srgbLinear = v => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)

/** OKLCH to linear-light sRGB, per the OKLab reference matrices. */
function oklchToLinear(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(v => Math.min(1, Math.max(0, v)))
}

/** Relative luminance from either a hex literal or an oklch() literal. */
function luminance(value) {
  const text = value.trim()

  const hex = text.match(/^#([0-9a-fA-F]{3,8})$/)
  if (hex) {
    const m = hex[1].length <= 4 ? hex[1].split('').map(c => c + c).join('') : hex[1]
    const [r, g, b] = [0, 2, 4].map(i => parseInt(m.slice(i, i + 2), 16))
    return 0.2126 * srgbLinear(r / 255) + 0.7152 * srgbLinear(g / 255) + 0.0722 * srgbLinear(b / 255)
  }

  const oklch = text.match(/^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/)
  if (oklch) {
    const [r, g, b] = oklchToLinear(Number(oklch[1]), Number(oklch[2]), Number(oklch[3]))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  throw new Error(`unsupported colour literal: ${text}`)
}

const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Read a token from the light `:root` block only, so dark overrides are ignored. */
function lightToken(name) {
  // Match the `.dark {` block, not the first `.dark` in the file: the custom
  // variant on line 4 also contains it, and it sits before `:root`.
  const start = globals.indexOf(':root')
  const end = globals.indexOf('\n.dark {')
  assert.ok(start !== -1 && end > start, 'globals.css must have a :root block followed by .dark')
  const root = globals.slice(start, end)
  const match = root.match(new RegExp(`${name}:\\s*([^;]+);`))
  assert.ok(match, `--${name} must be declared in :root so this can check it`)
  return match[1].trim()
}

// Every surface these text tokens are actually painted on.
const surfaces = ['background', 'card', 'surface-container-low', 'surface-container-highest']
  .map(name => [name, lightToken(name)])

const report = ratio => `${ratio.toFixed(2)}:1`

test('--muted-foreground meets WCAG AA on every surface', () => {
  const token = lightToken('muted-foreground')
  for (const [name, surface] of surfaces) {
    const ratio = contrast(token, surface)
    assert.ok(
      ratio >= 4.5,
      `--muted-foreground ${token} on --${name} is ${report(ratio)}, needs 4.5:1`
    )
  }
})

test('the text-bearing brand tokens meet AA on the background', () => {
  const background = lightToken('background')
  for (const name of ['foreground', 'primary', 'secondary', 'destructive']) {
    const ratio = contrast(lightToken(name), background)
    assert.ok(ratio >= 4.5, `--${name} on background is ${report(ratio)}, needs 4.5:1`)
  }
})

test('no muted-foreground literal is hardcoded in a class', () => {
  // `text-[#hex]` bypasses the token, so a token fix would never reach it.
  const hex = lightToken('muted-foreground')
  assert.match(hex, /^#[0-9a-fA-F]{6}$/, 'this guard only applies while the token is hex')
  const walk = dir => {
    const out = []
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) out.push(...walk(full))
      else if (entry.name.endsWith('.tsx')) out.push(full)
    }
    return out
  }
  // The brand reference page renders literal swatches on purpose, so it is the
  // one place the raw value belongs.
  const allowed = new Set([path.join('components', 'landing', 'marca', 'MarcaColors.tsx')])
  const offenders = []
  const pattern = new RegExp(`\\[[#]${hex.replace('#', '')}\\]`, 'i')
  for (const file of [...walk('app'), ...walk('components')]) {
    if (allowed.has(file)) continue
    fs.readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        if (pattern.test(line)) offenders.push(`${file}:${i + 1}`)
      })
  }
  assert.deepEqual(offenders, [], `use text-muted-foreground instead: ${offenders.join(', ')}`)
})

test('the oklch conversion matches the hex it replaced', () => {
  // Guards the maths above, so a future refactor cannot silently pass everything.
  assert.ok(Math.abs(contrast('oklch(1 0 0)', '#ffffff') - 1) < 0.001)
  assert.ok(Math.abs(contrast('#ffffff', '#000000') - 21) < 0.01)
})