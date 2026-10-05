const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const path = require('node:path')

const root = path.join(__dirname, '..')

/** Every .tsx under app/ and components/, skipping build output. */
function tsxFiles() {
  const walk = dir => {
    const out = []
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.next' || entry.name.startsWith('.')) {
        continue
      }
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) out.push(...walk(full))
      else if (entry.name.endsWith('.tsx')) out.push(full)
    }
    return out
  }
  return ['app', 'components'].filter(d => fs.existsSync(d)).flatMap(walk)
}

const read = file => fs.readFileSync(file, 'utf8')

test('the progress primitive forwards value to the Radix root', () => {
  // Radix derives aria-valuenow and data-state from the Root's value. Without it
  // the bar announces itself as indeterminate to assistive tech while it visibly
  // advances, which is worse than reporting nothing at all.
  const src = read(path.join(root, 'components', 'ui', 'progress.tsx'))
  const rootTag = src.match(/<ProgressPrimitive\.Root[\s\S]*?>/)?.[0] ?? ''
  assert.match(rootTag, /\bvalue=\{value\}/, 'ProgressPrimitive.Root must receive value')
})

test('the progress indicator does not transition unrelated properties', () => {
  // Only transform changes on the indicator. transition-all animates paint
  // properties the component never touches.
  const src = read(path.join(root, 'components', 'ui', 'progress.tsx'))
  assert.doesNotMatch(src, /transition-all/, 'use transition-transform on the indicator')
})

test('the canonical focus ring is present on every primitive control that needs one', () => {
  // The system defines one recipe in components/ui/button.tsx:
  //   outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30
  // These are the controls that carry it. Adding one means adding it here too.
  const recipe = 'focus-visible:ring-ring/30'
  const expected = [
    'components/ui/accordion.tsx',
    'components/ui/search-address.tsx',
    'components/common/NotificationBell.tsx',
    'components/common/Header.tsx',
    'components/dashboard/shared/RichTextEditor.tsx',
  ]
  const missing = []
  for (const relative of expected) {
    const src = read(path.join(root, relative))
    if (!src.includes(recipe)) missing.push(relative)
  }
  assert.deepEqual(missing, [], `missing the focus ring recipe: ${missing.join(', ')}`)
})