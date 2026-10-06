require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const { normalizeAILog } = require('../lib/admin/ai-logs.ts')
const { aiLogsQuerySchema } = require('../lib/admin/ai-logs-schema.ts')
const row = {
  id: 'log', user_id: 'historical-invalid-id', user_name: null, user_email: null, user_type: null,
  endpoint: '/api/ai/agent', tools_called: ['search'], flagged: false, duration_ms: 12,
  timestamp: new Date('2026-10-05T12:00:00Z'), metadata: null,
}
test('legacy agent hides setup duration and tool availability without inventing provider', () => {
  const log = normalizeAILog({ ...row, metadata: { model: 'gpt-legacy' } })
  assert.equal(log.durationMs, null)
  assert.equal(log.toolsCalled, null)
  assert.equal(log.provider, null)
  assert.equal(log.modelId, 'gpt-legacy')
  assert.equal(log.userId, 'historical-invalid-id')
  assert.equal(log.userName, null)
  assert.equal('outputSummary' in log, false)
})
test('complete audit retains zero token usage and executed tools', () => {
  const log = normalizeAILog({ ...row, metadata: { auditVersion: 2, status: 'ready', provider: 'openai', modelId: 'model', inputTokens: 0, outputTokens: 17, durationScope: 'complete', toolsScope: 'executed' } })
  assert.equal(log.inputTokens, 0)
  assert.equal(log.outputTokens, 17)
  assert.equal(log.durationMs, 12)
  assert.deepEqual(log.toolsCalled, ['search'])
  assert.equal(log.status, 'ready')
})
test('legacy Jev zero duration and malformed fields stay unavailable', () => {
  const log = normalizeAILog({ ...row, endpoint: '/api/ai/score-candidates', duration_ms: 0, metadata: { engine: 'model', inputTokens: -1, status: 'unknown', errorCode: 'raw private error' } })
  assert.equal(log.durationMs, null)
  assert.equal(log.inputTokens, null)
  assert.equal(log.status, null)
  assert.equal(log.errorCode, null)
  assert.equal(log.modelId, 'model')
})
test('pagination rejects malformed and unbounded values', () => {
  for (const input of [{ page: 'NaN' }, { page: '2x' }, { page: '0' }, { limit: '51' }, { page: '100001' }, { flagged: 'yes' }]) {
    assert.equal(aiLogsQuerySchema.safeParse(input).success, false)
  }
  assert.deepEqual(aiLogsQuerySchema.parse({}), { page: 1, limit: 20, search: '', endpoint: '' })
})
let admin = true
let queries = []
const load = Module._load
Module._load = function(name, parent, ...args) {
  if (name === '@/lib/auth') return { auth: { api: { getSession: async () => ({}) } }, isAdminSession: () => admin }
  if (name === '@/lib/db') return { pool: { query: async (sql, params) => { queries.push({ sql, params }); return { rows: sql.startsWith('SELECT COUNT') ? [{ count: '1' }] : [row] } } } }
  return load.call(this, name, parent, ...args)
}
const { GET } = require('../app/api/admin/ai-logs/route.ts')
test('route preserves authorization and rejects invalid pagination before database access', async () => {
  queries = []
  admin = false
  assert.equal((await GET(new Request('http://localhost/api/admin/ai-logs'))).status, 403)
  admin = true
  assert.equal((await GET(new Request('http://localhost/api/admin/ai-logs?page=NaN'))).status, 400)
  assert.equal(queries.length, 0)
})
test('route joins historical actor safely and binds name/email/id/operation search in both queries', async () => {
  queries = []
  const response = await GET(new Request('http://localhost/api/admin/ai-logs?search=Ana&page=2&limit=10&flagged=true'))
  assert.equal(response.status, 200)
  for (const query of queries) {
    assert.match(query.sql, /LEFT JOIN "user" u ON u.id::text = l.user_id/)
    assert.match(query.sql, /u.name ILIKE/)
    assert.match(query.sql, /u.email ILIKE/)
    assert.match(query.sql, /l.user_id ILIKE/)
    assert.match(query.sql, /l.endpoint ILIKE/)
    assert.equal(query.params[1], '%Ana%')
  }
  assert.deepEqual(queries[1].params, [true, '%Ana%', 10, 10])
  const body = await response.json()
  assert.equal(body.data[0].userId, 'historical-invalid-id')
  assert.equal(body.total, 1)
})

test('safe failure code survives without raw error text', () => {
  const log = normalizeAILog({ ...row, metadata: { auditVersion: 2, status: 'failed', errorCode: 'provider_error', error: 'private request payload' } })
  assert.equal(log.status, 'failed')
  assert.equal(log.errorCode, 'provider_error')
  assert.equal('error' in log, false)
})

test('normalization preserves all safe Jev and explanation failure codes', () => {
  const codes = [
    'provider_error', 'persistence_error', 'lease_lost',
    'provider_balance', 'provider_rate_limit', 'provider_auth', 'provider_timeout',
    'explanation_failed', 'invalid_explanation_format', 'unsupported_evidence',
    'explanation_persistence_failed', 'explanation_lease_lost',
  ]
  for (const errorCode of codes) {
    const log = normalizeAILog({ ...row, metadata: { auditVersion: 2, status: 'failed', errorCode } })
    assert.equal(log.errorCode, errorCode)
  }
  const log = normalizeAILog({ ...row, metadata: { auditVersion: 2, status: 'failed', errorCode: 'private request payload' } })
  assert.equal(log.errorCode, null)
})
