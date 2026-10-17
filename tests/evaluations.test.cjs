require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const { Result } = require('better-result')

const applicationId = '11111111-1111-4111-8111-111111111111'
const calls = []
const evaluation = {
  id: '22222222-2222-4222-8222-222222222222',
  application_id: applicationId,
  evaluator_id: '33333333-3333-4333-8333-333333333333',
  evaluator_name: 'Recruiter',
  rating: 'positive',
  notes: null,
  skills_assessment: {},
  created_at: '2026-10-09T12:00:00.000Z',
  updated_at: '2026-10-09T12:00:00.000Z',
}
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === '@/lib/api/response') {
    return {
      fetchApiData: async (url, init) => {
        calls.push({ url, init })
        return Result.ok(init?.method ? evaluation : [evaluation])
      },
    }
  }
  return load.call(this, name, parent, ...args)
}

const { getApplicationEvaluations, saveApplicationEvaluation } = require('../lib/api/evaluations.ts')
const { evaluationInputSchema, latestEvaluationByApplication } = require('../lib/evaluations/index.ts')

test('evaluation API keeps the batch contract and uses the canonical API path', async () => {
  calls.length = 0
  const result = await getApplicationEvaluations([applicationId])

  assert.equal(result.isOk(), true)
  assert.deepEqual(result.value, [evaluation])
  assert.match(calls[0].url, /^\/api\/v1\/evaluations\?applicationIds=/)
})

test('evaluation upsert sends the current scorecard fields to the API', async () => {
  calls.length = 0
  const result = await saveApplicationEvaluation(applicationId, {
    rating: 'positive',
    skillsAssessment: { technical: '5' },
  })

  assert.equal(result.isOk(), true)
  assert.equal(calls[0].init.method, 'POST')
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    applicationId,
    rating: 'positive',
    skillsAssessment: { technical: '5' },
  })
})

test('scorecard validation and latest-evaluation ordering stay stable', () => {
  assert.equal(
    evaluationInputSchema.safeParse({
      applicationId,
      rating: 'neutral',
      notes: '  ',
    }).success,
    false,
  )
  const older = { ...evaluation, updated_at: '2026-10-08T12:00:00.000Z' }
  const newer = { ...evaluation, id: 'z', updated_at: '2026-10-09T12:00:00.000Z' }
  assert.equal(latestEvaluationByApplication([older, newer]).get(applicationId).id, 'z')
})
