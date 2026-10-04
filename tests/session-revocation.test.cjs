require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
let options
let currentSession = { user: { id: 'admin', email: 'admin@example.com', type: 'admin', isActive: true } }
let rowCount = 1
const queries = []
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === '@better-auth/infra') return { dash: () => ({}), sentinel: () => ({}) }
  if (name === 'better-auth') return { betterAuth: (config) => {
    options = config
    return { api: { getSession: async () => currentSession } }
  } }
  if (name === 'better-auth/api') return { APIError: class APIError extends Error {}, createAuthMiddleware: (handler) => handler }
  if (name === 'better-auth/next-js') return { nextCookies: () => ({}) }
  if (name === 'next/headers') return { headers: async () => new Headers() }
  if (name === 'react') return { cache: (fn) => fn }
  if (name === '@/lib/mail') return {}
  if (name === '@/lib/db/short-links') return {}
  if (name === '@/lib/db') return { pool: { query: async (sql, values) => {
    queries.push({ sql, values })
    return { rows: rowCount ? [{ id: values[1] }] : [], rowCount }
  } } }
  return load.call(this, name, parent, ...args)
}
const authModule = require('../lib/auth.ts')
const { PATCH } = require('../app/api/admin/users/[id]/is-active/route.ts')
function request(isActive) {
  return new Request('http://localhost/api/admin/users/user/is-active', {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive }),
  })
}
const params = { params: Promise.resolve({ id: 'user' }) }

test('session reads cannot use old role data in a cookie', () => {
  assert.equal(options.session.cookieCache.enabled, false)
})

test('the session API rejects an inactive account in direct route calls', async () => {
  const ctx = { path: '/get-session', context: { returned: { user: { isActive: false } }, session: {} }, json: (value) => value }
  assert.equal(await options.hooks.after(ctx), null)
  assert.equal(ctx.context.session, null)
  assert.equal(authModule.isAdminSession({ user: { email: 'admin@example.com', type: 'admin', isActive: false } }), false)
  currentSession = { user: { id: 'admin', email: 'admin@example.com', type: 'admin', isActive: false } }
  assert.equal(await authModule.getServerSession(), null)
  currentSession = { user: { id: 'admin', email: 'admin@example.com', type: 'admin', isActive: true } }
})

test('deactivation changes the user and revokes all sessions in one statement', async () => {
  queries.length = 0
  assert.equal((await PATCH(request(false), params)).status, 200)
  assert.equal(queries.length, 1)
  assert.match(queries[0].sql, /WITH updated_user AS/)
  assert.match(queries[0].sql, /DELETE FROM "session" USING updated_user/)
  assert.match(queries[0].sql, /"session"\.user_id = updated_user\.id AND \$1 = false/)
  assert.deepEqual(queries[0].values, [false, 'user'])
})

test('reactivation does not select session revocation and a missing user returns 404', async () => {
  queries.length = 0
  assert.equal((await PATCH(request(true), params)).status, 200)
  assert.deepEqual(queries[0].values, [true, 'user'])
  rowCount = 0
  assert.equal((await PATCH(request(false), params)).status, 404)
  rowCount = 1
})

test('the admin route rejects an inactive admin and malformed input before SQL', async () => {
  queries.length = 0
  currentSession.user.isActive = false
  assert.equal((await PATCH(request(false), params)).status, 403)
  currentSession.user.isActive = true
  assert.equal((await PATCH(request('false'), params)).status, 400)
  const malformed = new Request('http://localhost/api/admin/users/user/is-active', { method: 'PATCH', body: '{' })
  assert.equal((await PATCH(malformed, params)).status, 400)
  assert.equal(queries.length, 0)
})
