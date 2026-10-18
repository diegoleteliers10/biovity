require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')

let queryError = null
let emailError = null
let client
let queuedWithClient
let subscribed = 0
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === 'next/server') {
    return { NextResponse: { json: (body, init) => Response.json(body, init) } }
  }
  if (name === '@/lib/db') {
    return { pool: { connect: async () => client } }
  }
  if (name === '@/lib/mail') {
    return {
      sendWaitlistEmail: async (_email, _role, _id, queryable) => {
        queuedWithClient = queryable
        if (emailError) return Promise.reject(emailError)
        return true
      },
      subscribeToResendAudience: async () => { subscribed += 1 },
    }
  }
  if (name === '@/lib/rate-limit') return { checkRateLimit: () => ({ allowed: true }) }
  if (name === '@/lib/validations') {
    return {
      waitlistSchema: {
        safeParse: (value) =>
          value?.email && value?.role
            ? { success: true, data: value }
            : { success: false, error: { issues: [{ message: 'invalid' }] } },
      },
    }
  }
  return load.call(this, name, parent, ...args)
}

const { POST } = require('../app/api/waitlist/route.ts')

function setupClient() {
  const queries = []
  let released = false
  client = {
    async query(sql, values) {
      queries.push({ sql, values })
      if (queryError && sql.includes('INSERT INTO waitlist')) return Promise.reject(queryError)
      if (sql.includes('INSERT INTO waitlist')) return { rows: [{ id: 'waitlist-id' }] }
      return { rows: [], rowCount: 1 }
    },
    release() { released = true },
    get released() { return released },
    queries,
  }
  return client
}

function request() {
  return new Request('http://localhost/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'person@example.com', role: 'professional' }),
  })
}

test.beforeEach(() => {
  queryError = null
  emailError = null
  queuedWithClient = null
  subscribed = 0
})

test('waitlist signup and welcome email commit on the same client', async () => {
  const dbClient = setupClient()

  const response = await POST(request())

  assert.equal(response.status, 200)
  assert.equal(queuedWithClient, dbClient)
  assert.deepEqual(dbClient.queries.map(({ sql }) => sql), [
    'BEGIN',
    'INSERT INTO waitlist (email, role) VALUES ($1, $2) RETURNING id',
    'COMMIT',
  ])
  assert.equal(dbClient.released, true)
  assert.equal(subscribed, 1)
})

test('an outbox insert failure rolls back the waitlist signup', async () => {
  const dbClient = setupClient()
  emailError = new Error('outbox insert failed')

  const response = await POST(request())

  assert.equal(response.status, 500)
  assert.deepEqual(dbClient.queries.map(({ sql }) => sql), [
    'BEGIN',
    'INSERT INTO waitlist (email, role) VALUES ($1, $2) RETURNING id',
    'ROLLBACK',
  ])
  assert.equal(dbClient.released, true)
  assert.equal(subscribed, 0)
})

test('duplicate signup rolls back and returns conflict', async () => {
  const dbClient = setupClient()
  queryError = Object.assign(new Error('duplicate email'), { code: '23505' })

  const response = await POST(request())

  assert.equal(response.status, 409)
  assert.deepEqual(dbClient.queries.map(({ sql }) => sql), [
    'BEGIN',
    'INSERT INTO waitlist (email, role) VALUES ($1, $2) RETURNING id',
    'ROLLBACK',
  ])
  assert.equal(dbClient.released, true)
})
