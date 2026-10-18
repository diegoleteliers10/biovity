require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')

let session = { user: { id: '00000000-0000-4000-8000-000000000001', type: 'admin' } }
let queryResult = { rowCount: 1, rows: [{ retried_count: 1 }] }
const queries = []
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === '@/lib/auth') {
    return {
      auth: { api: { getSession: async () => session } },
      isAdminSession: (value) => Boolean(value?.user?.type === 'admin'),
    }
  }
  if (name === '@/lib/db') {
    return {
      pool: {
        query: async (...queryArgs) => {
          queries.push(queryArgs)
          return queryResult
        },
      },
    }
  }
  return load.call(this, name, parent, ...args)
}

const { POST } = require('../app/api/admin/email-outbox/[id]/retry/route.ts')
const emailId = '00000000-0000-4000-8000-000000000002'
const request = () => new Request('https://biovity.test/api/admin/email-outbox/retry', { method: 'POST' })
const params = (id = emailId) => ({ params: Promise.resolve({ id }) })

test('requires an admin and a valid email ID', async () => {
  session = null
  queries.length = 0
  const forbidden = await POST(request(), params())

  session = { user: { id: '00000000-0000-4000-8000-000000000001', type: 'admin' } }
  const invalidId = await POST(request(), params('bad-id'))
  const malformedUuid = await POST(request(), params('------------------------------------'))

  assert.equal(forbidden.status, 403)
  assert.equal(invalidId.status, 400)
  assert.equal(malformedUuid.status, 400)
  assert.equal(queries.length, 0)
})

test('records an audit row in the same conditional retry statement', async () => {
  session = { user: { id: '00000000-0000-4000-8000-000000000001', type: 'admin' } }
  queries.length = 0
  queryResult = { rowCount: 1, rows: [{ retried_count: 1 }] }

  const response = await POST(request(), params())

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { success: true })
  assert.match(queries[0][0], /FOR UPDATE/)
  assert.match(queries[0][0], /INSERT INTO email_outbox_admin_retry/)
  assert.deepEqual(queries[0][1], [emailId, session.user.id])
})

test('returns conflict when no eligible email is requeued', async () => {
  queryResult = { rowCount: 1, rows: [{ retried_count: 0 }] }

  const response = await POST(request(), params())

  assert.equal(response.status, 409)
  assert.deepEqual(await response.json(), { error: 'El correo expiró o ya no se puede reintentar' })
})
