require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const { Result } = require('better-result')

let session = { user: { id: 'admin-id', type: 'admin' } }
let apiResult = Result.ok({ data: { data: [], total: 0, page: 1, limit: 100, totalPages: 0 } })
const requests = []
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === '@/lib/admin/contact-inquiries') {
    return {
      ADMIN_API_BASE: 'https://api.biovity.test',
      apiErrorResponse: (error) => Response.json({ error: error.message }, { status: 502 }),
      responsePayload: (value) => value?.data ?? value,
    }
  }
  if (name === '@/lib/auth') {
    return {
      auth: { api: { getSession: async () => session } },
      isAdminSession: (value) => Boolean(value?.user?.type === 'admin'),
    }
  }
  if (name === '@/lib/result') {
    return {
      fetchJsonWithSession: async (...args) => {
        requests.push(args)
        return apiResult
      },
    }
  }
  return load.call(this, name, parent, ...args)
}

const organizationsRoute = require('../app/api/admin/organizations/route.ts')
const broadcastRoute = require('../app/api/admin/notifications/system/broadcast/route.ts')
const organizationId = '00000000-0000-4000-8000-000000000001'
const requestId = '00000000-0000-4000-8000-000000000002'

test('organization list requires an admin and forwards a bounded page', async () => {
  session = null
  requests.length = 0
  const forbidden = await organizationsRoute.GET(new Request('https://biovity.test/api/admin/organizations'))

  session = { user: { id: 'admin-id', type: 'admin' } }
  const response = await organizationsRoute.GET(
    new Request('https://biovity.test/api/admin/organizations?page=2')
  )

  assert.equal(forbidden.status, 403)
  assert.equal(response.status, 200)
  assert.equal(requests.length, 1)
  assert.equal(requests[0][0], 'https://api.biovity.test/api/v1/organizations?page=2&limit=100')
})

test('broadcast validates input and forwards an authenticated request', async () => {
  session = { user: { id: 'admin-id', type: 'admin' } }
  requests.length = 0
  const invalid = await broadcastRoute.POST(
    new Request('https://biovity.test/api/admin/notifications/system/broadcast', {
      method: 'POST',
      body: JSON.stringify({ organizationId }),
    })
  )
  const malformedJson = await broadcastRoute.POST(
    new Request('https://biovity.test/api/admin/notifications/system/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{',
    })
  )
  apiResult = Result.ok({ data: { queued: 4, status: 'queued' } })
  const response = await broadcastRoute.POST(
    new Request('https://biovity.test/api/admin/notifications/system/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId, title: 'Aviso', body: 'Mensaje', requestId }),
    })
  )

  assert.equal(invalid.status, 400)
  assert.equal(malformedJson.status, 400)
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { queued: 4, status: 'queued' })
  assert.equal(requests.length, 1)
  assert.equal(
    requests[0][0],
    'https://api.biovity.test/api/v1/admin/notifications/system/broadcast'
  )
  assert.equal(requests[0][2].method, 'POST')
  assert.deepEqual(JSON.parse(requests[0][2].body), { organizationId, title: 'Aviso', body: 'Mensaje', requestId })
})
