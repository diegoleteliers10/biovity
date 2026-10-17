require('./register-ts.cjs')
const { test } = require('node:test')
const assert = require('node:assert/strict')
const Module = require('node:module')
const { Result } = require('better-result')

const jobId = '00000000-0000-4000-8000-000000000001'
const revisionId = '00000000-0000-4000-8000-000000000002'
const actionId = '00000000-0000-4000-8000-000000000003'
const reviewerId = '00000000-0000-4000-8000-000000000004'
const review = {
  id: actionId,
  actionId,
  revisionId,
  reviewerId,
  reviewerName: 'Reclutadora',
  aiRecommendation: 'Evaluar',
  decision: 'Avanzar',
  reason: 'La experiencia fue confirmada en entrevista.',
  createdAt: '2026-10-11T20:00:00.000Z',
}
const writes = []
const reads = []
let session = { user: { id: reviewerId, name: 'Reclutadora' } }
let writeStatus = 'created'

const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === 'next/headers') return { headers: async () => new Headers() }
  if (name === '@/lib/auth') return { auth: { api: { getSession: async () => session } } }
  if (name === '@/lib/api/jobs') {
    return { getManagedJob: async () => Result.ok({ organizationId: reviewerOrganizationId }) }
  }
  if (name === '@/lib/db/application-ai-recommendation-review') {
    return {
      listAIRecommendationReviews: async (input) => {
        reads.push(input)
        return Result.ok([review])
      },
      writeAIRecommendationReview: async (input) => {
        writes.push(input)
        if (writeStatus === 'error') return Result.err(new Error('fixture'))
        return Result.ok({ status: writeStatus, review })
      },
    }
  }
  return load.call(this, name, parent, ...args)
}
const reviewerOrganizationId = '00000000-0000-4000-8000-000000000005'
const { GET, POST } = require('../app/api/ai/score-review/route.ts')
Module._load = load

function getRequest(query = `jobId=${jobId}&revisionId=${revisionId}`) {
  const url = new URL(`http://localhost/api/ai/score-review?${query}`)
  return Object.assign(new Request(url), { nextUrl: url })
}

function postRequest(body) {
  return new Request('http://localhost/api/ai/score-review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

test('GET returns review history scoped to the authorized managed job', async () => {
  const response = await GET(getRequest())
  assert.equal(response.status, 200)
  assert.deepEqual(reads.at(-1), { revisionId, jobId, organizationId: reviewerOrganizationId })
  assert.deepEqual((await response.json()).reviews, [review])
})

test('POST derives the reviewer and organization from the session and managed job', async () => {
  const response = await POST(postRequest({
    jobId,
    revisionId,
    actionId,
    decision: 'Avanzar',
    reason: review.reason,
    reviewerId: '00000000-0000-4000-8000-000000000099',
    aiRecommendation: 'Descartar',
  }))
  assert.equal(response.status, 400)
  assert.equal(writes.length, 0)

  const saved = await POST(postRequest({
    jobId,
    revisionId,
    actionId,
    decision: 'Avanzar',
    reason: review.reason,
  }))
  assert.equal(saved.status, 201)
  assert.equal(writes.at(-1).reviewerId, reviewerId)
  assert.equal(writes.at(-1).reviewerName, 'Reclutadora')
  assert.equal(writes.at(-1).organizationId, reviewerOrganizationId)
})

test('POST maps idempotency conflicts and missing change reasons', async () => {
  writeStatus = 'conflict'
  assert.equal((await POST(postRequest({ jobId, revisionId, actionId, decision: 'Evaluar', reason: null }))).status, 409)
  writeStatus = 'reason_required'
  const response = await POST(postRequest({ jobId, revisionId, actionId, decision: 'Avanzar', reason: null }))
  assert.equal(response.status, 400)
  writeStatus = 'created'
})

test('POST requires a session and rejects invalid payloads', async () => {
  const count = writes.length
  session = null
  assert.equal((await POST(postRequest({ jobId, revisionId, actionId, decision: 'Evaluar', reason: null }))).status, 401)
  session = { user: { id: reviewerId, name: 'Reclutadora' } }
  assert.equal((await POST(postRequest({ jobId, revisionId, actionId, decision: 'other', reason: null }))).status, 400)
  assert.equal(writes.length, count)
})
