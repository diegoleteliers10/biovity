const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const path = require('node:path')

const globals = fs.readFileSync(path.join(__dirname, '..', 'app', 'globals.css'), 'utf8')
const landingScroll = fs.readFileSync(path.join(__dirname, '..', 'app', 'landing-scroll.css'), 'utf8')

// Comments explain the rule that was removed and name it, so they have to go
// before any assertion about real declarations.
const withoutComments = css => css.replace(/\/\*[\s\S]*?\*\//g, '')
const globalsCode = withoutComments(globals)
const landingCode = withoutComments(landingScroll)

test('the root element never smooths scrolling', () => {
  // `scroll-behavior: smooth` on html or body animates every wheel scroll, not
  // just anchor jumps. It belongs on a per-element basis, never on the document.
  const rootRules = globalsCode.match(/(^|\n)\s*(html|body)\s*\{[^}]*\}/g) ?? []
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
    landingCode,
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
    landingCode,
    /\.landing-public\s+\.motion-safe\\:animate-in\s*\{[^}]*filter:\s*none\s*!important/,
    'the animate-in filter override must stay, and must win over the animation'
  )
})