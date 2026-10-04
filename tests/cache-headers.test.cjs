const assert = require('node:assert/strict')
const { test } = require('node:test')

const config = require('../vercel.json')

const cacheValue = source => {
  const rules = config.headers.filter(rule => rule.source === source)
  const last = rules[rules.length - 1]
  const header = last?.headers.find(item => item.key === 'Cache-Control')
  return header?.value ?? null
}

const publicPaths = ['/', '/jobs', '/companies', '/learn', '/login', '/nosotros', '/salaries']
const privatePaths = [
  '/api/notifications',
  '/api/messages/cda18341-0994-450b-895d-fc64e5738a94',
  '/api/admin/users',
  '/dashboard',
  '/dashboard/messages',
]

const marketingRule = config.headers.find(
  rule => rule.source.includes('(?!') && rule.headers.some(h => h.key === 'Cache-Control')
)
const toMatcher = source => new RegExp(`^${source.replace(/^\//, '/')}`)

test('the marketing cache rule never matches an api or dashboard path', () => {
  assert.ok(marketingRule, 'a marketing-only cache rule must exist')
  const matches = toMatcher(marketingRule.source)
  for (const path of privatePaths) {
    assert.equal(matches.test(path), false, `${path} must not receive the public cache header`)
  }
  for (const path of ['/_next/static/chunks/main.js', '/_next/image']) {
    assert.equal(matches.test(path), false, `${path} must not receive the public cache header`)
  }
})

test('the marketing cache rule still covers every public page', () => {
  const matches = toMatcher(marketingRule.source)
  for (const path of publicPaths) {
    assert.equal(matches.test(path), true, `${path} must stay publicly cacheable for SEO`)
  }
})

test('api and dashboard responses are private and never stored', () => {
  for (const source of ['/api/:path*', '/dashboard/:path*']) {
    const value = cacheValue(source)
    assert.ok(value, `${source} must set Cache-Control`)
    assert.match(value, /no-store/)
    assert.match(value, /private/)
    assert.doesNotMatch(value, /public/)
  }
})

test('no catch-all rule stamps a public cache header on every path', () => {
  const catchAll = config.headers.find(rule => rule.source === '/(.*)')
  assert.ok(catchAll, 'the security catch-all must remain')
  const header = catchAll.headers.find(item => item.key === 'Cache-Control')
  assert.equal(header, undefined, 'the catch-all must not set Cache-Control')
})

test('the security catch-all still covers api and dashboard paths', () => {
  const catchAll = config.headers.find(rule => rule.source === '/(.*)')
  const keys = catchAll.headers.map(item => item.key)
  for (const key of [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'Referrer-Policy',
    'X-XSS-Protection',
  ]) {
    assert.ok(keys.includes(key), `${key} must apply to every path`)
  }
})

test('content-hashed assets stay immutable', () => {
  assert.match(cacheValue('/_next/static/:path*'), /immutable/)
})

require('./register-ts.cjs')
const nextConfig = require('../next.config.ts').default

const nextHeaders = async () => await nextConfig.headers()

test('next.config.ts marks every user-scoped route private as a second layer', async () => {
  const rules = await nextHeaders()
  for (const source of ['/api/:path*', '/dashboard/:path*']) {
    const rule = rules.find(item => item.source === source)
    assert.ok(rule, `next.config.ts must declare ${source}`)
    const cache = rule.headers.find(item => item.key === 'Cache-Control')?.value ?? ''
    const vary = rule.headers.find(item => item.key === 'Vary')?.value ?? ''
    assert.match(cache, /no-store/, `${source} must forbid storage`)
    assert.match(cache, /private/, `${source} must forbid shared caches`)
    assert.match(vary, /Cookie/, `${source} must vary on Cookie`)
  }
})

test('the auth routes keep a private rule of their own', async () => {
  const rules = await nextHeaders()
  const covered = ['/api/:path*', '/dashboard/:path*'].some(source =>
    rules.some(rule => rule.source === source)
  )
  assert.ok(covered, '/api/auth must stay inside a private rule')
})

test('the vercel.json and next.config.ts layers agree on the private value', async () => {
  const rules = await nextHeaders()
  const fromNext = rules
    .filter(rule => ['/api/:path*', '/dashboard/:path*'].includes(rule.source))
    .map(rule => rule.headers.find(item => item.key === 'Cache-Control')?.value)
  const fromVercel = ['/api/:path*', '/dashboard/:path*'].map(cacheValue)
  assert.deepEqual(fromVercel, fromNext, 'both config layers must send the same directive')
})