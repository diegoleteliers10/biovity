require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const { explanationPlainText, evidenceHighlightParts } = require('../lib/ai/decision/explanation-text.ts')

test('evidence strips markup and keeps paragraph separation', () => {
  assert.equal(explanationPlainText('<p>Experiencia en <strong>React</strong>.</p><p>Uso de Node.js.</p>'), 'Experiencia en React. Uso de Node.js.')
  assert.equal(explanationPlainText('uno<br>dos<div>tres</div>'), 'uno dos tres')
})

test('evidence removes scripts, styles, comments and event handlers', () => {
  assert.equal(explanationPlainText('<script>alert(1)</script><style>p{display:none}</style><!--hidden--><p onclick="alert(2)">React<img src=x onerror="alert(3)"></p>'), 'React')
})

test('entities decode as text without a second HTML pass', () => {
  assert.equal(explanationPlainText('<p>React &amp; Node.js&nbsp;&lt;script&gt;visible&lt;/script&gt;</p>'), 'React & Node.js <script>visible</script>')
  assert.equal(explanationPlainText('x < 5 y 8 > 3'), 'x < 5 y 8 > 3')
  assert.equal(explanationPlainText(''), '')
})

test('highlights shared exact technology tokens and preserves punctuation', () => {
  const parts = evidenceHighlightParts({ text: '<p>React, Next.js, NODE.js y C++.</p>', claim: 'Experiencia con React, Next.js, Node.js y C++' })
  assert.deepEqual(parts.filter((part) => part.highlighted).map((part) => part.text), ['React', 'Next.js', 'NODE.js', 'C++'])
  assert.equal(parts.map((part) => part.text).join(''), 'React, Next.js, NODE.js y C++.')
  assert.ok(parts.every((part) => 'React, Next.js, NODE.js y C++.'.slice(part.start, part.start + part.text.length) === part.text))
})

test('does not highlight generic words, substrings, or invented technologies', () => {
  const parts = evidenceHighlightParts({ text: 'Experiencia con React Native y TypeScript. Reactividad.', claim: 'Experiencia con React y Node.js' })
  assert.deepEqual(parts.filter((part) => part.highlighted).map((part) => part.text), ['React'])
})

test('claim punctuation cannot change token matching or inject regular expressions', () => {
  const parts = evidenceHighlightParts({ text: 'NextXjs C++ Node.js Python', claim: 'Next.js C++ (Node.js).* [a-z]+' })
  assert.deepEqual(parts.filter((part) => part.highlighted).map((part) => part.text), ['C++', 'Node.js'])
  assert.deepEqual(evidenceHighlightParts({ text: '', claim: 'React' }), [])
})

test('resolved plain text preserves encoded type parameters through highlight segmentation', () => {
  const { buildEvidenceCatalog, resolveExplanationEvidence } = require('../lib/ai/decision/explanation-evidence.ts')
  const catalog = buildEvidenceCatalog({ description: '<p>Usa Array&lt;string&gt; en TypeScript.</p>' }, {})
  const resolved = resolveExplanationEvidence({
    reason: 'El puesto requiere TypeScript.',
    strengths: [],
    gaps: [{ text: 'Array TypeScript', evidenceId: 'job.0' }],
    recommendation: 'Evaluar',
  }, catalog)
  assert.ok(resolved)
  assert.equal(resolved.evidenceFormat, 'plain-text')
  const parts = evidenceHighlightParts({
    text: resolved.gaps[0].evidence,
    claim: 'Array TypeScript',
    format: resolved.evidenceFormat,
  })
  assert.equal(parts.map((part) => part.text).join(''), 'Usa Array<string> en TypeScript.')
  assert.deepEqual(parts.filter((part) => part.highlighted).map((part) => part.text), ['Array', 'TypeScript'])
})
