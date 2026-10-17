require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { after, test } = require('node:test')

const organizationId = '11111111-1111-4111-8111-111111111111'
const reasonId = '22222222-2222-4222-8222-222222222222'
const originalFetch = global.fetch
const calls = []
global.fetch = async (url, init) => {
  calls.push({ url: String(url), init })
  return {
    ok: true,
    json: async () => ({ data: { data: [{ id: reasonId, label: 'Experiencia' }] } }),
  }
}

const {
  createRejectionReason,
  getRejectionReasons,
  updateRejectionReason,
} = require('../lib/api/pipeline-stages.ts')

after(() => {
  global.fetch = originalFetch
})

test('reads the nested API response and scopes reasons to the organization', async () => {
  calls.length = 0
  const result = await getRejectionReasons(organizationId)

  assert.equal(result.isOk(), true)
  assert.deepEqual(result.value, [{ id: reasonId, label: 'Experiencia' }])
  assert.match(calls[0].url, new RegExp(`/organizations/${organizationId}/rejection-reasons$`))
})

test('creates a rejection reason with the supplied label', async () => {
  calls.length = 0
  const result = await createRejectionReason(organizationId, 'Experiencia')

  assert.equal(result.isOk(), true)
  assert.equal(calls[0].init.method, 'POST')
  assert.deepEqual(JSON.parse(calls[0].init.body), { label: 'Experiencia' })
})

test('updates a reason label or active state with PATCH', async () => {
  calls.length = 0
  const result = await updateRejectionReason(organizationId, reasonId, { active: false })

  assert.equal(result.isOk(), true)
  assert.match(calls[0].url, new RegExp(`/rejection-reasons/${reasonId}$`))
  assert.equal(calls[0].init.method, 'PATCH')
  assert.deepEqual(JSON.parse(calls[0].init.body), { active: false })
})
