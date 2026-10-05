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

/** Read the Tailwind palette for external color references. */
const palette = (() => {
  const theme = fs.readFileSync(
    path.join(__dirname, '..', 'node_modules', 'tailwindcss', 'theme.css'),
    'utf8'
  )
  const out = {}
  for (const m of theme.matchAll(/(--color-[a-z0-9-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim()
  return out
})()

/** Resolve theme aliases to a color literal. */
function resolve(value, depth = 0, theme) {
  if (depth > 8) throw new Error(`var() chain too deep: ${value}`)
  const text = value.trim()
  const ref = text.match(/^var\(\s*(--[a-z0-9-]+)\s*\)$/i)
  if (!ref) return text
  const name = ref[1]
  const themeValue = theme && !(name in palette) && rawToken(theme, name)
  if (!themeValue && !(name in palette)) {
    throw new Error(
      `${name} is not in the Tailwind palette. A token points at it, so it has to resolve.`
    )
  }
  return resolve(themeValue || palette[name], depth + 1, theme)
}

/** Relative luminance from a hex literal or an oklch() literal. */
function luminance(rawValue) {
  const text = resolve(rawValue)

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

/** Read a token from one theme block, so the other theme's value is ignored. */
function rawToken(theme, name) {
  // Match the `.dark {` block, not the first `.dark` in the file: the custom
  // variant near the top also contains it, and it sits before `:root`.
  const start = globals.indexOf(theme === 'dark' ? '\n.dark {' : ':root')
  const end = theme === 'dark' ? globals.indexOf('\n@layer base') : globals.indexOf('\n.dark {')
  assert.ok(start !== -1 && end > start, `globals.css must have a ${theme} block`)
  const block = globals.slice(start, end)
  const match = block.match(new RegExp(`${name}:\\s*([^;]+);`))
  assert.ok(match, `--${name} must be declared in the ${theme} block so this can check it`)
  return match[1].trim()
}

const token = (theme, name) => resolve(rawToken(theme, name), 0, theme)

const lightToken = name => token('light', name)
const darkToken = name => token('dark', name)

// Every surface a token can be painted on. Light mirrors card-on-white;
// dark walks the full tonal ladder from the page up to the highest surface.
const lightSurfaces = ['background', 'card', 'surface-container-low', 'surface-container-highest']
const darkSurfaces = [
  'background',
  'surface-container-lowest',
  'surface-container-low',
  'surface-raised',
  'surface-container-highest',
]

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

test('no surface literal is hardcoded in a class', () => {
  // The salary band on the offer page was bg-[#f3f3f5], the light value of
  // --surface-container-low. It stayed near-white in the dark theme, so the
  // salary text lost its background. A literal bypasses the token, so a token
  // fix can never reach it. This catches any light-theme surface, not just
  // muted-foreground.
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
  // These render literal swatches on purpose: the brand reference page, and
  // the not-found page which is a fixed light surface by design.
  const allowed = new Set([
    path.join('components', 'landing', 'marca', 'MarcaColors.tsx'),
    path.join('app', 'not-found.tsx'),
  ])
  // The light values of every surface token. A class carrying one of these is
  // frozen at the light theme.
  const lightSurfaces = [
    lightToken('surface-container-lowest'),
    lightToken('surface-container-low'),
    lightToken('surface-container-highest'),
    lightToken('card'),
    lightToken('background'),
  ]
  const offenders = []
  for (const file of [...walk('app'), ...walk('components')]) {
    if (allowed.has(file)) continue
    fs.readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        for (const value of lightSurfaces) {
          if (/^#[0-9a-fA-F]{6}$/.test(value)) {
            // `[#]` is a character class matching a literal #. Writing `\#` here
            // would be an escaped # in a template literal, which loses the
            // brackets. Strip the # from the token and put it back in a class.
            const pattern = new RegExp(`(bg|text|border)-\\[#${value.slice(1)}\\]`, 'i')
            if (pattern.test(line)) offenders.push(`${file}:${i + 1} ${value}`)
          }
        }
      })
  }
  assert.deepEqual(
    offenders,
    [],
    `use a surface token so both themes follow: ${offenders.join(', ')}`
  )
})

test('the oklch conversion matches the hex it replaced', () => {
  // Guards the maths above, so a future refactor cannot silently pass everything.
  assert.ok(Math.abs(contrast('oklch(1 0 0)', '#ffffff') - 1) < 0.001)
  assert.ok(Math.abs(contrast('#ffffff', '#000000') - 21) < 0.01)
})

// The hard rule, enforced in both themes and both directions:
//
//   a state colour must clear 4.5:1 as TEXT on every surface it is painted on,
//   and its -foreground must clear 4.5:1 ON the state colour itself.
//
// The dashboard already distinguished "pendiente" from "completado" with raw
// amber and emerald. Collapsing them onto two colours would make those
// indicators stop communicating anything, which is why the tokens exist rather
// than a mapping onto primary and secondary.
const STATES = ['success', 'warning', 'info', 'destructive']

for (const theme of ['light', 'dark']) {
  const read = theme === 'dark' ? darkToken : lightToken
  const surfaceNames = theme === 'dark' ? darkSurfaces : lightSurfaces

  for (const state of STATES) {
    test(`--${state} clears AA in the ${theme} theme`, () => {
      const value = read(state)
      for (const surface of surfaceNames) {
        const ratio = contrast(value, read(surface))
        assert.ok(
          ratio >= 4.5,
          `--${state} ${value} as text on --${surface} is ${report(ratio)}, needs 4.5:1`
        )
      }
    })

    test(`--${state}-foreground clears AA on --${state} in the ${theme} theme`, () => {
      const fg = read(`${state}-foreground`)
      const ratio = contrast(fg, read(state))
      assert.ok(
        ratio >= 4.5,
        `--${state}-foreground ${fg} on --${state} is ${report(ratio)}, needs 4.5:1`
      )
    })
  }

  test(`--accent-foreground clears AA on --accent in the ${theme} theme`, () => {
    const ratio = contrast(read('accent-foreground'), read('accent'))
    assert.ok(
      ratio >= 4.5,
      `--accent-foreground on --accent is ${report(ratio)}, needs 4.5:1`
    )
  })

  test(`every foreground pair in the ${theme} theme clears AA`, () => {
    // A -foreground is meant to sit on its own token. Catches the pattern that
    // produced white on the periwinkle accent, 3.40:1 light and 2.77:1 dark.
    const pairs = [
      ['primary', 'primary-foreground'],
      ['secondary', 'secondary-foreground'],
      ['accent', 'accent-foreground'],
      ['tertiary', 'tertiary-foreground'],
      ['on-primary-container', 'primary-container'],
      ...STATES.map(state => [state, `${state}-foreground`]),
    ]
    const failures = []
    for (const [background, foreground] of pairs) {
      const ratio = contrast(read(foreground), read(background))
      if (ratio < 4.5) failures.push(`${foreground} on ${background} is ${report(ratio)}`)
    }
    assert.deepEqual(failures, [], failures.join('; '))
  })

  test(`text tokens clear AA on every surface in the ${theme} theme`, () => {
    const failures = []
    for (const foreground of ['foreground', 'muted-foreground']) {
      for (const surface of surfaceNames) {
        const ratio = contrast(read(foreground), read(surface))
        if (ratio < 4.5) {
          failures.push(`${foreground} on ${surface} is ${report(ratio)}`)
        }
      }
    }
    assert.deepEqual(failures, [], failures.join('; '))
  })
}

test('the dark palette uses the requested values', () => {
  const expected = {
    'surface-container-lowest': '#1a1a1a',
    'surface-container-low': '#212123',
    'surface-raised': '#28282b',
    'surface-container-highest': '#353538',
    foreground: '#e8e8ea',
    'muted-foreground': '#a3a3a8',
    primary: '#d6e6ec',
    'primary-foreground': '#00374a',
    'primary-container': '#00374a',
    'on-primary-container': '#a9d8ea',
    secondary: '#2fbf9f',
    'secondary-foreground': '#00281f',
    accent: '#9594e0',
  }
  for (const [name, value] of Object.entries(expected)) {
    assert.equal(darkToken(name), value)
  }
})

test('a filled button keeps its edge on every surface', () => {
  // WCAG 1.4.11 asks 3:1 for the boundary of a control, which no ratio in this
  // file checked. A primary button that melts into the page is unusable even
  // when its label is legible.
  for (const theme of ['light', 'dark']) {
    const surfaces = theme === 'dark' ? darkSurfaces : lightSurfaces
    const fill = token(theme, 'primary')
    const failures = surfaces
      .map(surface => [surface, contrast(fill, token(theme, surface))])
      .filter(([, ratio]) => ratio < 3)
      .map(([surface, ratio]) => `${theme}: --primary on ${surface} is ${report(ratio)}`)
    assert.deepEqual(failures, [], failures.join('; '))
  }
})

test('the primary works as link text on every surface', () => {
  // text-primary appears 127 times. It needs the full 4.5:1, not the 3:1 a
  // button edge would settle for, so the two requirements are checked apart.
  for (const theme of ['light', 'dark']) {
    const surfaces = theme === 'dark' ? darkSurfaces : lightSurfaces
    const failures = surfaces
      .map(surface => [surface, contrast(token(theme, 'primary'), token(theme, surface))])
      .filter(([, ratio]) => ratio < 4.5)
      .map(([surface, ratio]) => `${theme}: --primary as text on ${surface} is ${report(ratio)}`)
    assert.deepEqual(failures, [], failures.join('; '))
  }
})

test('the primary hover does not blend with an alpha', () => {
  // `hover:bg-primary/80` mixes with whatever sits behind the button, so one
  // class meant two different colours. On the dark primary it put the label at
  // 4.16:1, under AA, and the button looked bleached. An alpha cannot be
  // checked statically because its result depends on the backdrop, so the rule
  // is that the class must not exist.
  const button = fs.readFileSync(path.join(__dirname, '..', 'components', 'ui', 'button.tsx'), 'utf8')
  assert.doesNotMatch(
    button,
    /hover:bg-primary\/\d/,
    'the primary hover must mix toward a token, not use an alpha over an unknown backdrop'
  )
  assert.match(button, /hover:bg-\[color-mix\(in_oklch,var\(--primary\)/)
})

test('the focus ring shares the hue of the control it surrounds', () => {
  // Both themes used the secondary teal for --ring, so a green ring surrounded
  // the blue primary button and read as an error state. The ring now derives
  // from --primary, so it cannot drift away from it.
  for (const theme of ['light', 'dark']) {
    const ring = token(theme, 'ring')
    assert.match(
      ring,
      /color-mix\(in oklch, var\(--primary\)/,
      `${theme} --ring must derive from --primary, found: ${ring}`
    )
  }
})

test('both themes declare the same token names', () => {
  // A token present in :root and missing from .dark silently keeps its light
  // value in dark mode. That is how the three --surface-container-* tokens were
  // pure white on a dark page.
  const namesIn = (theme) => {
    const start = globals.indexOf(theme === 'dark' ? '\n.dark {' : ':root')
    const end = theme === 'dark' ? globals.indexOf('\n@layer base') : globals.indexOf('\n.dark {')
    return [...globals.slice(start, end).matchAll(/^\s{4}--([a-z0-9-]+):/gm)].map(m => m[1])
  }
  const structural = name => !/^color-|^radius/.test(name)
  const light = namesIn('light').filter(structural)
  const dark = namesIn('dark').filter(structural)
  const missingInDark = light.filter(name => !dark.includes(name))
  const missingInLight = dark.filter(name => !light.includes(name))
  assert.deepEqual(missingInDark, [], `dark theme is missing: ${missingInDark.join(', ')}`)
  assert.deepEqual(missingInLight, [], `light theme is missing: ${missingInLight.join(', ')}`)
})
test('every token mapped in @theme resolves in both themes', () => {
  // Tailwind only emits a utility for a token once something uses it, so a
  // mapping can rot silently. This checks the declaration side: whatever
  // @theme inline exposes must have a value in :root and in .dark.
  const themeBlock = globals.slice(globals.indexOf('@theme'), globals.indexOf(':root'))
  const mapped = [...themeBlock.matchAll(/--color-([a-z0-9-]+):\s*var\(--([a-z0-9-]+)\)/g)].map(
    m => m[2]
  )
  assert.ok(mapped.length > 20, `expected the theme to map tokens, found ${mapped.length}`)
  const missing = []
  for (const name of mapped) {
    for (const theme of ['light', 'dark']) {
      try {
        token(theme, name)
      } catch {
        missing.push(`${name} (${theme})`)
      }
    }
  }
  assert.deepEqual(missing, [], `mapped but not declared: ${missing.join(', ')}`)
})

test('the dark theme is reachable from the document class', () => {
  // `@custom-variant dark (&:is(.dark *))` is descendant-only, so the class has
  // to sit on <html> for the tokens to reach <body>. The theme script does that.
  assert.match(globals, /@custom-variant dark \(&:is\(\.dark \*\)\)/)
  const theme = fs.readFileSync(
    path.join(__dirname, '..', 'lib', 'theme.ts'),
    'utf8'
  )
  assert.match(theme, /classList\.toggle\('dark'/, 'the theme script must set the class')
  const layout = fs.readFileSync(path.join(__dirname, '..', 'app', 'layout.tsx'), 'utf8')
  assert.match(
    layout,
    /dangerouslySetInnerHTML=\{\{ __html: themeScript \}\}/,
    'the script must be inlined in the document head, before first paint'
  )
})
