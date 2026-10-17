require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const { pool } = require('../lib/db')
const { enqueueOrganizationVerificationEmail } = require('../lib/email-outbox.ts')
const { POST } = require('../app/api/internal/organization-verification-email/route.ts')

const originalQuery = pool.query
const originalSecret = process.env.EMAIL_OUTBOX_SECRET
const input = {
  eventKey: 'organization-verification:123e4567-e89b-42d3-a456-426614174000',
  requestId: '123e4567-e89b-42d3-a456-426614174001',
  to: 'admin@example.com',
  subject: 'Nueva solicitud de verificación',
  html: '<p>Revisar solicitud</p>',
}

test.afterEach(() => {
  pool.query = originalQuery
  if (originalSecret === undefined) delete process.env.EMAIL_OUTBOX_SECRET
  else process.env.EMAIL_OUTBOX_SECRET = originalSecret
})

test('enqueues an admin verification email with a stable idempotency key', async () => {
  pool.query = async (sql, values) => {
    assert.match(sql, /email_type, idempotency_key, source_type, source_id/)
    assert.equal(values[1], input.eventKey)
    assert.equal(values[2], input.requestId)
    assert.equal(values[3], input.to)
    assert.equal(values[5], input.subject)
    assert.equal(values[6], input.html)
    return { rowCount: 1, rows: [] }
  }

  assert.deepEqual(await enqueueOrganizationVerificationEmail(input), { kind: 'inserted' })
})

test('accepts a matching retry after the email entered the outbox', async () => {
  let call = 0
  pool.query = async () => {
    call += 1
    if (call === 1) return { rowCount: 0, rows: [] }
    return {
      rowCount: 1,
      rows: [{
        email_type: 'organization_verification',
        source_type: 'organization_verification',
        source_id: input.requestId,
        recipient_email: input.to,
        subject: input.subject,
        html: null,
      }],
    }
  }

  assert.deepEqual(await enqueueOrganizationVerificationEmail(input), { kind: 'replayed' })
})

test('rejects a retry when the stable event key has different content', async () => {
  let call = 0
  pool.query = async () => {
    call += 1
    if (call === 1) return { rowCount: 0, rows: [] }
    return {
      rowCount: 1,
      rows: [{
        email_type: 'organization_verification',
        source_type: 'organization_verification',
        source_id: input.requestId,
        recipient_email: 'other@example.com',
        subject: input.subject,
        html: input.html,
      }],
    }
  }

  assert.deepEqual(await enqueueOrganizationVerificationEmail(input), { kind: 'conflict' })
})

test('requires the private endpoint secret before queue access', async () => {
  process.env.EMAIL_OUTBOX_SECRET = 'test-secret'
  pool.query = async () => assert.fail('unauthorized request reached the database')
  const response = await POST(new Request('https://local/api/internal/organization-verification-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }))

  assert.equal(response.status, 401)
})

test('accepts a valid bridge payload and adds it to the durable email outbox', async () => {
  process.env.EMAIL_OUTBOX_SECRET = 'test-secret'
  pool.query = async (_sql, values) => {
    assert.equal(values[1], input.eventKey)
    assert.equal(values[2], input.requestId)
    return { rowCount: 1, rows: [] }
  }
  const response = await POST(new Request('https://local/api/internal/organization-verification-email', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer test-secret',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }))

  assert.equal(response.status, 202)
  assert.deepEqual(await response.json(), { accepted: true, replayed: false })
})
