require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const { pool } = require('../lib/db')
const { enqueueOfferResponseEmail } = require('../lib/email-outbox.ts')
const { POST } = require('../app/api/internal/offer-response-email/route.ts')

const originalQuery = pool.query
const originalSecret = process.env.EMAIL_OUTBOX_SECRET

test.afterEach(() => {
  pool.query = originalQuery
  if (originalSecret === undefined) delete process.env.EMAIL_OUTBOX_SECRET
  else process.env.EMAIL_OUTBOX_SECRET = originalSecret
})

test('accepts an identical event replay from the durable outbox row', async () => {
  let call = 0
  let storedPayload
  pool.query = async (sql, values) => {
    call += 1
    if (call === 1) {
      storedPayload = {
        email_type: 'offer_response',
        source_type: 'offer_response_payload_hash',
        source_id: values[2],
        recipient_user_id: values[3],
        recipient_email: values[4],
        subject: values[6],
        html: values[7],
      }
      return { rowCount: 1, rows: [] }
    }
    if (call === 2) return { rowCount: 0, rows: [] }
    assert.match(sql, /SELECT email_type, source_type, source_id, recipient_user_id, recipient_email/)
    return {
      rowCount: 1,
      rows: [{ ...storedPayload, html: null }],
    }
  }

  const input = {
    eventKey: 'offer-response:123e4567-e89b-42d3-a456-426614174000',
    recipientId: '123e4567-e89b-42d3-a456-426614174001',
    to: 'recruiter@example.com',
    subject: 'Offer response accepted',
    html: '<p>The offer response was accepted.</p>',
  }
  assert.deepEqual(await enqueueOfferResponseEmail(input), { kind: 'inserted' })
  const result = await enqueueOfferResponseEmail(input)

  assert.equal(result.kind, 'replayed')
})

test('rejects an event replay when its payload differs', async () => {
  let call = 0
  pool.query = async (sql) => {
    call += 1
    if (call === 1) return { rowCount: 0, rows: [] }
    assert.match(sql, /SELECT email_type, source_type, source_id, recipient_user_id, recipient_email/)
    return {
      rowCount: 1,
      rows: [{
        email_type: 'offer_response',
        source_type: 'offer_response_payload_hash',
        source_id: '123e4567-e89b-42d3-a456-426614174000',
        recipient_user_id: '123e4567-e89b-42d3-a456-426614174001',
        recipient_email: 'other@example.com',
        subject: 'Different subject',
        html: '<p>Different</p>',
      }],
    }
  }

  const result = await enqueueOfferResponseEmail({
      eventKey: 'offer-response:123e4567-e89b-42d3-a456-426614174000',
      recipientId: '123e4567-e89b-42d3-a456-426614174001',
      to: 'recruiter@example.com',
      subject: 'Offer response accepted',
      html: '<p>The offer response was accepted.</p>',
    })
  assert.equal(result.kind, 'conflict')
})

test('requires the service secret before reading or queuing a payload', async () => {
  process.env.EMAIL_OUTBOX_SECRET = 'test-secret'
  const originalPoolQuery = pool.query
  pool.query = async () => assert.fail('unauthorized request reached the database')

  const response = await POST(new Request('https://local/api/internal/offer-response-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  }))

  assert.equal(response.status, 401)
  pool.query = originalPoolQuery
})

test('rejects extra fields from the private endpoint payload', async () => {
  process.env.EMAIL_OUTBOX_SECRET = 'test-secret'
  const originalPoolQuery = pool.query
  pool.query = async () => assert.fail('invalid payload reached the database')

  const response = await POST(new Request('https://local/api/internal/offer-response-email', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer test-secret',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      eventKey: 'offer-response:123e4567-e89b-42d3-a456-426614174000',
      recipientId: '123e4567-e89b-42d3-a456-426614174001',
      to: 'recruiter@example.com',
      subject: 'Offer response accepted',
      html: '<p>The offer response was accepted.</p>',
      organizationId: 'org-1',
    }),
  }))

  assert.equal(response.status, 400)
  pool.query = originalPoolQuery
})

test('requires a recipient user ID on the private endpoint', async () => {
  process.env.EMAIL_OUTBOX_SECRET = 'test-secret'
  const originalPoolQuery = pool.query
  pool.query = async () => assert.fail('payload without recipient ID reached the database')

  const response = await POST(new Request('https://local/api/internal/offer-response-email', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer test-secret',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      eventKey: 'offer-response:123e4567-e89b-42d3-a456-426614174000',
      to: 'recruiter@example.com',
      subject: 'Offer response accepted',
      html: '<p>The offer response was accepted.</p>',
    }),
  }))

  assert.equal(response.status, 400)
  pool.query = originalPoolQuery
})
