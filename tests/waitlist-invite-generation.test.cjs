require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')

const { pool } = require('../lib/db')
const outbox = require('../lib/email-outbox.ts')
const { sendWaitlistInviteEmail } = require('../lib/mail.ts')
const originalQuery = pool.query
const originalEnqueueEmail = outbox.enqueueEmail

let queueResults
let enqueued
let existingRows
let generationCount
pool.query = async (sql) => {
  if (sql.includes('count(*)::int AS count')) return { rows: [{ count: generationCount }] }
  return { rows: existingRows }
}
outbox.enqueueEmail = async (input) => {
  enqueued.push(input)
  return queueResults.shift() ?? true
}

test.beforeEach(() => {
  queueResults = []
  enqueued = []
  existingRows = []
  generationCount = 0
})

test.after(() => {
  pool.query = originalQuery
  outbox.enqueueEmail = originalEnqueueEmail
})

test('a first invitation uses its stable idempotency key', async () => {
  assert.equal(await sendWaitlistInviteEmail('person@example.com', 'professional', 'row-1'), true)
  assert.equal(enqueued[0].idempotencyKey, 'waitlist-invite:row-1')
})

test('an expired dead invitation gets a deterministic new generation', async () => {
  existingRows = [{ status: 'dead', expired: true, has_content: false }]
  generationCount = 1

  assert.equal(await sendWaitlistInviteEmail('person@example.com', 'professional', 'row-1'), true)
  assert.equal(enqueued[0].idempotencyKey, 'waitlist-invite:row-1:retry:1')
})

test('an active or sent invitation does not create another row', async () => {
  existingRows = [{ status: 'processing', expired: false, has_content: true }]

  assert.equal(await sendWaitlistInviteEmail('person@example.com', 'professional', 'row-1'), false)
  assert.equal(enqueued.length, 0)
})
