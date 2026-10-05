require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const { applicationComments } = require('../components/dashboard/organization/application-comments.ts')

test('evaluation comments use their source record, refresh edits and omit cleared comments', () => {
  const note = { id: 'same-id', content: 'Nota independiente', author_name: 'Ana', created_at: '2026-10-01T00:00:00Z', tags: [] }
  const evaluation = { id: 'same-id', notes: 'Comentario de evaluación', evaluator_name: 'Luis', updated_at: '2026-10-02T00:00:00Z' }
  const comments = applicationComments([note], [evaluation])
  assert.deepEqual(comments.map(item => item.kind), ['evaluation', 'note'])
  assert.equal(new Set(comments.map(item => item.id)).size, 2)
  assert.equal(comments[0].evaluation, evaluation)
  assert.equal(comments[0].author, 'Luis')
  assert.equal(applicationComments([note], [{ ...evaluation, notes: 'Editado' }])[0].content, 'Editado')
  assert.equal(applicationComments([note], [{ ...evaluation, notes: '  ' }]).length, 1)
  assert.equal(applicationComments([note], [{ ...evaluation, notes: null }]).length, 1)
  assert.equal(note.content, 'Nota independiente')
})
