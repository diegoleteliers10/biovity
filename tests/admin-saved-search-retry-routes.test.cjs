require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const { Result } = require('better-result')

let session = { user: { id: 'admin-id', type: 'admin' } }
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
        return Result.ok({ data: { status: 'requeued' } })
      },
    }
  }
  return load.call(this, name, parent, ...args)
}

const handlers = [
  [
    'saved-search-alert',
    require('../app/api/admin/operations-queue/saved-search-alert/[intentId]/retry/route.ts').POST,
  ],
  [
    'saved-search-match',
    require('../app/api/admin/operations-queue/saved-search-match/[intentId]/retry/route.ts').POST,
  ],
  [
    'ai-explanation',
    require('../app/api/admin/operations-queue/ai-explanation/[revisionId]/retry/route.ts').POST,
  ],
]
const intentId = '00000000-0000-4000-8000-000000000001'
const params = (id = intentId) => ({ params: Promise.resolve({ intentId: id, revisionId: id }) })
const request = () => new Request('https://biovity.test/api/admin/operations-queue/retry', { method: 'POST' })

test('requires an admin and valid ID before it calls NestJS', async () => {
  for (const [, POST] of handlers) {
    session = null
    requests.length = 0
    const forbidden = await POST(request(), params())

    session = { user: { id: 'admin-id', type: 'admin' } }
    const invalidId = await POST(request(), params('bad-id'))

    assert.equal(forbidden.status, 403)
    assert.equal(invalidId.status, 400)
    assert.equal(requests.length, 0)
  }
})

test('forwards retry actions with the admin session', async () => {
  session = { user: { id: 'admin-id', type: 'admin' } }
  requests.length = 0

  for (const [path, POST] of handlers) {
    const response = await POST(request(), params())
    assert.equal(response.status, 200)
    assert.deepEqual(await response.json(), { status: 'requeued' })
    assert.equal(
      requests.at(-1)[0],
      `https://api.biovity.test/api/v1/admin/operations-queue/${path}/${intentId}/retry`,
    )
    assert.equal(requests.at(-1)[2].method, 'POST')
  }
})
