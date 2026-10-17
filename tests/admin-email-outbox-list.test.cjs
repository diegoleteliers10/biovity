require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const { NextRequest } = require('next/server')

let session = { user: { id: 'admin-id', type: 'admin' } }
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
          if (queryArgs[0].includes('FILTER')) {
            return {
              rows: [{ pending: '4', processing: '2', dead: '76', suppressed: '3', legacy_offer_response: '1' }],
            }
          }
          return {
            rows: [{
              id: '00000000-0000-4000-8000-000000000001',
              email_type: 'welcome',
              recipient_email: 'candidate@example.com',
              subject: 'Welcome',
              attempts: 8,
              last_error: 'delivery_failed',
              created_at: new Date('2026-10-12T10:00:00.000Z'),
              expires_at: new Date('2026-10-20T10:00:00.000Z'),
            }],
          }
        },
      },
    }
  }
  return load.call(this, name, parent, ...args)
}

const { GET } = require('../app/api/admin/email-outbox/route.ts')
const request = (page = '1') =>
  new NextRequest(`https://biovity.test/api/admin/email-outbox?page=${page}`)

test('rejects unauthenticated users and invalid pages before database access', async () => {
  queries.length = 0
  session = null
  const forbidden = await GET(request())

  session = { user: { id: 'admin-id', type: 'admin' } }
  const invalid = await GET(request('0'))

  assert.equal(forbidden.status, 403)
  assert.equal(invalid.status, 400)
  assert.equal(queries.length, 0)
})

test('returns stable pages and masks recipient addresses', async () => {
  queries.length = 0
  session = { user: { id: 'admin-id', type: 'admin' } }

  const response = await GET(request('9'))
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.deepEqual(body.pagination, { page: 2, pageSize: 50, totalItems: 76, totalPages: 2 })
  assert.equal(body.data[0].recipient, 'c***@example.com')
  assert.deepEqual(queries[1][1], [50, 50])
  assert.match(queries[1][0], /ORDER BY created_at DESC, id DESC LIMIT \$1 OFFSET \$2/)
})
