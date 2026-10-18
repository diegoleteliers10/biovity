require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { after, test } = require('node:test')

const originalFetch = global.fetch
const payloads = []
const requestedUrls = []
global.fetch = async (url) => {
  requestedUrls.push(String(url))
  return { ok: true, json: async () => payloads.shift() }
}

const { getOrganizationMembers } = require('../lib/api/organization-members.ts')

after(() => {
  global.fetch = originalFetch
})

test('reads all pages from the paginated NestJS response wrapper', async () => {
  const members = [{ userId: 'recruiter-id', role: 'recruiter', user: { name: 'Recruiter' } }]
  const secondPage = [{ userId: 'recruiter-2-id', role: 'recruiter', user: { name: 'Recruiter 2' } }]
  payloads.push(
    { data: members, total: 2, page: 1, limit: 100, totalPages: 2, timestamp: 'now', path: '/members?page=1' },
    { data: secondPage, total: 2, page: 2, limit: 100, totalPages: 2, timestamp: 'now', path: '/members?page=2' },
    { data: { id: 'owner-id', name: 'Owner', email: 'owner@example.com' }, timestamp: 'now', path: '/members/owner' },
  )

  const result = await getOrganizationMembers('organization-id')

  assert.equal(result.isOk(), true)
  assert.deepEqual(result.value.map((member) => member.userId), ['recruiter-id', 'recruiter-2-id', 'owner-id'])
  assert.match(requestedUrls[0], /page=1&limit=100$/)
  assert.match(requestedUrls[1], /page=2&limit=100$/)
  assert.match(requestedUrls[2], /\/members\/owner$/)
})
