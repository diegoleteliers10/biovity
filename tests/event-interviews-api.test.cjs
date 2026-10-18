require('./register-ts.cjs')
const assert = require('node:assert/strict')
const test = require('node:test')
const {
  getEventInterviewRecords,
  saveEventInterviewEvaluation,
  saveEventInterviewOutcome,
} = require('../lib/api/event-interviews.ts')

test('event interview APIs keep evaluation and final outcome scoped to one event', async (t) => {
  const calls = []
  const fetch = t.mock.method(global, 'fetch', async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method ?? 'GET', body: init.body ? JSON.parse(init.body) : undefined })
    if (init.method === 'GET') return Response.json({ evaluations: [], outcome: null, audit: [], canEvaluate: true })
    if (String(url).endsWith('/interview-outcome')) return Response.json({ event_id: 'event-1', outcome: 'advance' })
    return Response.json({ event_id: 'event-1', evaluator_id: 'reviewer-1', rating: 'positive' })
  })

  const records = await getEventInterviewRecords('event-1')
  const evaluation = await saveEventInterviewEvaluation('event-1', {
    rating: 'positive',
    recommendation: 'advance',
  })
  const outcome = await saveEventInterviewOutcome('event-1', { outcome: 'advance' })

  assert.equal(records.isOk(), true)
  assert.equal(evaluation.isOk(), true)
  assert.equal(outcome.isOk(), true)
  assert.deepEqual(calls.map(({ url, method }) => [url, method]), [
    ['/api/v1/events/event-1/interview-evaluations', 'GET'],
    ['/api/v1/events/event-1/interview-evaluations/me', 'PUT'],
    ['/api/v1/events/event-1/interview-outcome', 'PUT'],
  ])
  assert.deepEqual(calls[1]?.body, { rating: 'positive', recommendation: 'advance' })
  assert.equal(calls[1]?.body?.evaluatorId, undefined)
  assert.equal(fetch.mock.callCount(), 3)
})
