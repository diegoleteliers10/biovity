const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const path = require('node:path')

/** Every file under the given roots with a matching extension, skipping build output. */
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
  return roots.flatMap(root => (fs.existsSync(root) ? walk(root) : []))
}

const tsxFiles = () => sourceFiles(['app', 'components'], ['.tsx'])
const styleFiles = () => sourceFiles(['app', 'components'], ['.tsx', '.css'])

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
        if (/hsl\(var\(--/.test(line)) offenders.push(`${file}:${i + 1}`)
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
        if (/=\s*Math\.random\(\)/.test(line)) offenders.push(`${file}:${i + 1}`)
      })
  }
  assert.deepEqual(offenders, [], `prop defaults must be deterministic: ${offenders.join(', ')}`)
})