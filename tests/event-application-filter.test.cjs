require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')

test('event lookup sends the application filter to NestJS', async (t) => {
  const previous = global.fetch
  t.after(() => { global.fetch = previous })
  let requestedUrl
  global.fetch = async (url) => {
    requestedUrl = new URL(url)
    return Response.json({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 })
  }

  const { getEvents } = require('../lib/api/events.ts')
  await getEvents({ applicationId: 'application-id', limit: 20 })

  assert.equal(requestedUrl.searchParams.get('applicationId'), 'application-id')
})
