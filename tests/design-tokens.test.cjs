const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')
const read = p => fs.readFileSync(path.join(root, p), 'utf8')

const globals = read('app/globals.css')
const landingScroll = read('app/landing-scroll.css')

// Comments explain the rule that was removed and name it, so they have to go
// before any assertion about real declarations.
const withoutComments = css => css.replace(/\/\*[\s\S]*?\*\//g, '')

/** Files under the given roots with a matching extension, skipping build output. */
function sourceFiles(roots, extensions) {
  const walk = dir => {
    const out = []
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name.startsWith('.')) {
        continue
      }
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) out.push(...walk(full))
      else if (extensions.some(ext => entry.name.endsWith(ext))) out.push(full)
    }
    return out
  }
  return roots.filter(d => fs.existsSync(d)).flatMap(walk)
}

const tsxFiles = () => sourceFiles(['app', 'components'], ['.tsx'])
const styleFiles = () => sourceFiles(['app', 'components'], ['.tsx', '.css'])

test('the root element never smooths scrolling', () => {
  // `scroll-behavior: smooth` on html or body animates every wheel scroll, not
  // just anchor jumps. It belongs on a per-element basis, never on the document.
  const code = withoutComments(globals)
  const rootRules = code.match(/(^|\n)\s*(html|body)\s*\{[^}]*\}/g) ?? []
  for (const rule of rootRules) {
    assert.doesNotMatch(
      rule,
      /scroll-behavior\s*:\s*smooth/,
      `root element must not smooth scrolling: ${rule.trim().slice(0, 60)}`
    )
  }
})

test('the landing scroll sheet does not smooth the document either', () => {
  assert.doesNotMatch(
    withoutComments(landingScroll),
    /scroll-behavior\s*:\s*smooth/,
    'landing-scroll.css must not smooth scrolling on html or body'
  )
})

test('anchor clearance under the fixed header is preserved', () => {
  assert.match(globals, /scroll-padding-top\s*:/)
})

test('the landing hero does not keep a filter rendering context', () => {
  // tw-animate-css puts `filter: blur(0)` in its `enter` keyframe and the hero
  // uses fill-mode-both, so the blur would survive on large boxes for the life
  // of the page unless it is explicitly cleared.
  assert.match(
    withoutComments(landingScroll),
    /\.landing-public\s+\.motion-safe\\:animate-in\s*\{[^}]*filter:\s*none\s*!important/,
    'the animate-in filter override must stay, and must win over the animation'
  )
})

test('the chart palette is actually used somewhere', () => {
  // These five tokens were declared and never referenced, so the charts painted
  // their own hex instead and the whole palette was dead code.
  const src = tsxFiles().map(f => fs.readFileSync(f, 'utf8')).join('\n')
  for (const token of ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5']) {
    assert.ok(src.includes(token), `${token} is declared in globals.css but never used`)
  }
})

test('no colour function wraps a token it cannot accept', () => {
  // hsl(var(--token)) is dropped as invalid whenever the token is not an hsl
  // triple. Most tokens here are oklch, and --border is a hex, so every one of
  // these declarations was being discarded. This is how the sidebar active ring
  // silently stopped rendering.
  const offenders = []
  for (const file of styleFiles()) {
    fs.readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        if (/hsl\(var\(--/.test(line)) offenders.push(`${path.relative(root, file)}:${i + 1}`)
      })
  }
  assert.deepEqual(offenders, [], `these tokens cannot be wrapped in hsl(): ${offenders.join(', ')}`)
})

test('no component defaults a prop to a random value', () => {
  // A random default makes the server and the client disagree on first paint,
  // and re-randomises on every remount.
  const offenders = []
  for (const file of tsxFiles()) {
    fs.readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        if (/=\s*Math\.random\(\)/.test(line)) {
          offenders.push(`${path.relative(root, file)}:${i + 1}`)
        }
      })
  }
  assert.deepEqual(offenders, [], `prop defaults must be deterministic: ${offenders.join(', ')}`)
})