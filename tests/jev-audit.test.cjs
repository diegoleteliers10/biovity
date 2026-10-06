require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const { Result } = require('better-result')
const logs = []
let nextResult
let saved
let failed = 0
let clock = 1000
const originalNow = Date.now
Date.now = () => clock
const assessment = { requestedBy: 'recruiter', candidateId: 'candidate', revisionId: 'revision', fingerprint: 'hash', organizationId: 'org', jobId: 'job', applicationId: 'application', attempts: 1, jobSnapshot: {}, candidateSnapshot: {} }
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === '@/lib/ai/audit') return { aiAuditService: { log: async item => { logs.push(item); return 'id' } } }
  if (name === '@/lib/db/application-ai-score') return {
    purgeExpiredCandidateSnapshots: async () => Result.ok(0),
    claimCandidateAssessments: async () => Result.ok([assessment]),
    failCandidateAssessment: async () => { failed++; return Result.ok(true) },
    finishCandidateAssessment: async () => saved,
  }
  if (name === './jev' && parent.filename.endsWith('/worker.ts')) return { assessWithJev: async () => { clock += 42; return nextResult } }
  return load.call(this, name, parent, ...args)
}
const { processJevQueue } = require('../lib/ai/decision/worker.ts')
const result = { model: 'jev-1.13.0', sufficiency: 1, inputTokens: 123, outputTokens: 45 }

test('Jev audit records completed and failed attempts with real actor, elapsed time and available usage', async () => {
  for (const scenario of [
    { result: Result.ok(result), saved: Result.ok(true), status: 'ready' },
    { result: Result.ok({ ...result, sufficiency: 0 }), saved: Result.ok(true), status: 'insufficient' },
    { result: Result.err(new Error('private provider error')), saved: Result.ok(true), status: 'failed', errorCode: 'provider_error' },
    { result: Result.ok(result), saved: Result.err(new Error('private db error')), status: 'failed', errorCode: 'persistence_error' },
    { result: Result.ok(result), saved: Result.ok(false), status: 'aborted', errorCode: 'lease_lost' },
  ]) {
    logs.length = 0
    nextResult = scenario.result
    saved = scenario.saved
    await processJevQueue(1)
    assert.equal(logs.length, 1)
    const log = logs[0]
    assert.equal(log.userId, 'recruiter')
    assert.equal(log.durationMs, 42)
    assert.equal(log.metadata.status, scenario.status)
    assert.equal(log.metadata.provider, 'typesafe')
    assert.equal(log.metadata.durationScope, 'complete')
    assert.equal(log.metadata.errorCode, scenario.errorCode)
    assert.equal(log.metadata.inputTokens, scenario.result.isOk() ? 123 : undefined)
    assert.equal(JSON.stringify(log).includes('private'), false)
  }
  assert.equal(failed, 1)
  Date.now = originalNow
})
