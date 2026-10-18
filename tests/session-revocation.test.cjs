require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const { Result } = require('better-result')
const { ApiError } = require('../lib/errors.ts')
let options
let currentSession = { user: { id: 'admin', email: 'admin@example.com', type: 'admin', isActive: true } }
let user = { id: 'user', isActive: true }
const revokedSessions = []
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === '@better-auth/infra') return { dash: () => ({}), sentinel: () => ({}) }
  if (name === 'better-auth') return { betterAuth: (config) => {
    options = config
    return {
      api: { getSession: async () => currentSession },
      $context: Promise.resolve({ internalAdapter: { deleteUserSessions: async (id) => revokedSessions.push(id) } }),
    }
  } }
  if (name === 'better-auth/api') return { APIError: class APIError extends Error {}, createAuthMiddleware: (handler) => handler }
  if (name === 'better-auth/next-js') return { nextCookies: () => ({}) }
  if (name === 'next/headers') return { headers: async () => new Headers() }
  if (name === 'react') return { cache: (fn) => fn }
  if (name === '@/lib/mail') return {}
  if (name === '@/lib/db/short-links') return {}
  if (name === '@/lib/api/users') return {
    getUser: async () => user
      ? Result.ok(user)
      : Result.err(new ApiError({ status: 404, message: 'User not found' })),
    updateUser: async (_id, updates) => {
      user = { ...user, ...updates }
      return Result.ok(user)
    },
  }
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

test('deactivation changes the user through NestJS and revokes all sessions', async () => {
  user = { id: 'user', isActive: true }
  revokedSessions.length = 0
  assert.equal((await PATCH(request(false), params)).status, 200)
  assert.equal(user.isActive, false)
  assert.deepEqual(revokedSessions, ['user'])
})

test('reactivation revokes stale sessions and a missing user returns 404', async () => {
  user = { id: 'user', isActive: false }
  revokedSessions.length = 0
  assert.equal((await PATCH(request(true), params)).status, 200)
  assert.equal(user.isActive, true)
  assert.deepEqual(revokedSessions, ['user'])
  user = null
  assert.equal((await PATCH(request(false), params)).status, 404)
  user = { id: 'user', isActive: true }
})

test('the admin route rejects an inactive admin and malformed input before SQL', async () => {
  currentSession.user.isActive = false
  assert.equal((await PATCH(request(false), params)).status, 403)
  currentSession.user.isActive = true
  assert.equal((await PATCH(request('false'), params)).status, 400)
  const malformed = new Request('http://localhost/api/admin/users/user/is-active', { method: 'PATCH', body: '{' })
  assert.equal((await PATCH(malformed, params)).status, 400)
})
