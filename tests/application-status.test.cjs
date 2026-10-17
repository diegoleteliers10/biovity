require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { after, test } = require('node:test')

const applicationId = '11111111-1111-4111-8111-111111111111'
const originalFetch = global.fetch
const calls = []
global.fetch = async (url, init) => {
  calls.push({ url: String(url), init })
  return {
    ok: true,
    json: async () => ({
      data: String(url).endsWith('/status-history')
        ? [{ id: applicationId, status: 'rechazado' }]
        : { id: applicationId, status: 'rechazado' },
    }),
  }
}

const {
  getApplicationStatusHistory,
  reopenApplication,
  updateApplicationHiringPlan,
  updateApplicationPipelineStage,
  updateApplicationStatus,
} = require('../lib/api/applications.ts')

after(() => {
  global.fetch = originalFetch
})

test('status update sends the rejection note to NestJS', async () => {
  calls.length = 0
  const result = await updateApplicationStatus({
    id: applicationId,
    status: 'rechazado',
    rejectionNote: 'Experiencia insuficiente para este cargo',
    rejectionReasonId: '44444444-4444-4444-8444-444444444444',
  })

  assert.equal(result.isOk(), true)
  assert.match(calls[0].url, new RegExp(`/applications/${applicationId}/status$`))
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    status: 'rechazado',
    rejectionNote: 'Experiencia insuficiente para este cargo',
    rejectionReasonId: '44444444-4444-4444-8444-444444444444',
  })
})

test('status history reads from the authenticated NestJS route', async () => {
  calls.length = 0
  const result = await getApplicationStatusHistory(applicationId)

  assert.equal(result.isOk(), true)
  assert.deepEqual(result.value, [{ id: applicationId, status: 'rechazado' }])
  assert.match(calls[0].url, new RegExp(`/applications/${applicationId}/status-history$`))
})

test('pipeline stage update sends stage ID to the stage route', async () => {
  calls.length = 0
  const stageId = '22222222-2222-4222-8222-222222222222'
  const result = await updateApplicationPipelineStage({ id: applicationId, stageId })

  assert.equal(result.isOk(), true)
  assert.match(calls[0].url, new RegExp(`/applications/${applicationId}/stage$`))
  assert.deepEqual(JSON.parse(calls[0].init.body), { stageId })
})

test('pipeline stage update forwards the server session cookie', async () => {
  calls.length = 0
  const stageId = '22222222-2222-4222-8222-222222222222'
  const result = await updateApplicationPipelineStage({
    id: applicationId,
    stageId,
    requestHeaders: new Headers({ cookie: 'better-auth.session_token=session-value' }),
  })

  assert.equal(result.isOk(), true)
  assert.equal(calls[0].init.headers.get('cookie'), 'better-auth.session_token=session-value')
})

test('reopening sends the active stage and reason to the explicit route', async () => {
  calls.length = 0
  const stageId = '22222222-2222-4222-8222-222222222222'
  const reason = 'La persona confirmó disponibilidad'
  const result = await reopenApplication({ id: applicationId, stageId, reason })

  assert.equal(result.isOk(), true)
  assert.match(calls[0].url, new RegExp(`/applications/${applicationId}/reopen$`))
  assert.equal(calls[0].init.method, 'POST')
  assert.deepEqual(JSON.parse(calls[0].init.body), { stageId, reason })
})

test('hiring plan update sends assignment, action, and target date to NestJS', async () => {
  calls.length = 0
  const result = await updateApplicationHiringPlan({
    id: applicationId,
    assigneeId: '33333333-3333-4333-8333-333333333333',
    nextAction: 'Coordinar entrevista',
    targetDate: '2026-11-30',
  })

  assert.equal(result.isOk(), true)
  assert.match(calls[0].url, new RegExp(`/applications/${applicationId}/hiring-plan$`))
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    assigneeId: '33333333-3333-4333-8333-333333333333',
    nextAction: 'Coordinar entrevista',
    targetDate: '2026-11-30',
  })
})
