require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const { Result } = require('better-result')
const id = '11111111-1111-4111-8111-111111111111'
const secondId = '22222222-2222-4222-8222-222222222222'
const queries = []
const accesses = []
let denied = null
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === '@/lib/auth') return { getServerSession: async () => ({ user: { id: 'current-user' } }) }
  if (name === '@/lib/auth/resource-access') return { authorizeResource: async (resource, permission) => {
    accesses.push({ resource, permission })
    return resource.id === denied ? Result.err({ status: 403, message: 'Denied' }) : Result.ok({})
  } }
  if (name === '@/lib/db') return { pool: { query: async (sql, values) => { queries.push({ sql, values }); return { rows: sql.includes("INSERT") ? [{ id }] : [] } } } }
  return load.call(this, name, parent, ...args)
}
const { GET, PATCH } = require('../app/api/evaluations/route.ts')
const { evaluationInputSchema, latestEvaluationByApplication } = require('../lib/evaluations/index.ts')
function patch(body) { return new Request('http://localhost/api/evaluations', { method: 'PATCH', body: JSON.stringify(body) }) }

test('batch authorizes every resource as recruit before it reads evaluations', async () => {
  queries.length = 0; accesses.length = 0; denied = secondId
  const response = await GET(new Request(`http://localhost/api/evaluations?applicationIds=${id},${secondId}`))
  assert.equal(response.status, 403)
  assert.equal(queries.length, 0)
  assert.deepEqual(accesses.map(a => a.permission), ['recruit', 'recruit'])
  denied = null
  assert.equal((await GET(new Request(`http://localhost/api/evaluations?applicationIds=${id},${secondId}`))).status, 200)
  assert.deepEqual(queries[0].values, [[id, secondId]])
  assert.match(queries[0].sql, /ANY\(\$1::uuid\[\]\)/)
  assert.match(queries[0].sql, /updated_at DESC/)
})

test('batch rejects missing, invalid, ambiguous and more than 100 ids', async () => {
  for (const suffix of ['', '?applicationIds=bad', `?applicationId=${id}&applicationIds=${id}`, `?applicationIds=${Array(101).fill(id).join(',')}`])
    assert.equal((await GET(new Request(`http://localhost/api/evaluations${suffix}`))).status, 400)
})

test('scores, context and notes are validated before save', async () => {
  for (const score of ['-1', '6', '1.2', '01', ''])
    assert.equal((await PATCH(patch({ applicationId: id, rating: 'positive', skillsAssessment: { technical: score } }))).status, 400)
  for (const rating of ['neutral', 'negative'])
    assert.equal((await PATCH(patch({ applicationId: id, rating, notes: '  ' }))).status, 400)
  assert.equal(evaluationInputSchema.safeParse({ applicationId: id, rating: 'positive', skillsAssessment: { context: 'other' } }).success, false)
  assert.equal(evaluationInputSchema.safeParse({ applicationId: id, rating: 'positive', skillsAssessment: { context: 'cv_review', technical: '0', cultural: '5', expectations: '3', tags: 'Experiencia relevante' } }).success, true)
})

test('upsert binds evaluator to the current user and authorizes recruit', async () => {
  queries.length = 0; accesses.length = 0
  await PATCH(patch({ applicationId: id, evaluatorId: 'attacker', rating: 'positive' }))
  assert.equal(queries[0].values[1], 'current-user')
  assert.equal(accesses[0].permission, 'recruit')
  assert.match(queries[0].sql, /ON CONFLICT \(application_id, evaluator_id\)/)
})

test('summary selects latest update with stable id tie break', () => {
  const rows = [{ application_id: id, id: 'a', updated_at: '2026-01-01' }, { application_id: id, id: 'b', updated_at: '2026-01-02' }, { application_id: id, id: 'c', updated_at: '2026-01-02' }]
  assert.equal(latestEvaluationByApplication(rows).get(id).id, 'c')
  assert.equal(latestEvaluationByApplication(rows.toReversed()).get(id).id, 'c')
})
