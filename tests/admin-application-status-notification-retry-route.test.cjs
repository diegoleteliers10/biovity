require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const { Result } = require('better-result')

let session = { user: { id: 'admin-id', type: 'admin' } }
let apiResult = Result.ok({ data: { status: 'requeued' } })
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

const { POST } = require('../app/api/admin/operations-queue/application-status-notification/[intentId]/retry/route.ts')
const intentId = '00000000-0000-4000-8000-000000000001'
const params = (id = intentId) => ({ params: Promise.resolve({ intentId: id }) })
const request = () => new Request('https://biovity.test/api/admin/operations-queue/retry', { method: 'POST' })

test('requires an admin and valid intent ID before calling the backend', async () => {
  session = null
  requests.length = 0
  const forbidden = await POST(request(), params())

  session = { user: { id: 'admin-id', type: 'admin' } }
  const invalidId = await POST(request(), params('bad-id'))

  assert.equal(forbidden.status, 403)
  assert.equal(invalidId.status, 400)
  assert.equal(requests.length, 0)
})

test('forwards an authenticated retry request to NestJS', async () => {
  session = { user: { id: 'admin-id', type: 'admin' } }
  requests.length = 0
  apiResult = Result.ok({ data: { status: 'requeued' } })

  const response = await POST(request(), params())

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { status: 'requeued' })
  assert.equal(
    requests[0][0],
    `https://api.biovity.test/api/v1/admin/operations-queue/application-status-notification/${intentId}/retry`,
  )
  assert.equal(requests[0][2].method, 'POST')
})
