require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const { Result } = require('better-result')

const owner = '00000000-0000-4000-8000-000000000001'
const reservation = '00000000-0000-4000-8000-000000000002'
let items = [{ id: 'cleanup-1', bucket: 'biovity_cv', path: `cv/${owner}/${reservation}.pdf`, leaseToken: 'lease-1' }]
let storageError = null
const removed = []
const buckets = []
const backendCalls = []
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === '@/lib/result') {
    return {
      fetchJson: async (url, init) => {
        backendCalls.push({ url, init })
        return Result.ok(url.endsWith('/claim') ? { items } : { status: 'completed' })
      },
    }
  }
  if (name === '@/lib/supabase') {
    return {
      getSupabaseAdmin: () => ({
        storage: {
          from: (bucket) => {
            buckets.push(bucket)
            return {
            remove: async (paths) => {
              removed.push(paths)
              return { error: storageError }
            },
            }
          },
        },
      }),
    }
  }
  return load.call(this, name, parent, ...args)
}

const { processCvCleanup } = require('../lib/cv-cleanup-worker.ts')

test('CV cleanup removes only claimed candidate paths and acknowledges each lease', async () => {
  const result = await processCvCleanup()
  assert.equal(result.status, 'ok')
  assert.deepEqual(removed, [[`cv/${owner}/${reservation}.pdf`]])
  assert.equal(buckets.at(-1), 'biovity_cv')
  assert.match(backendCalls.at(-1).url, /\/cv-cleanup\/cleanup-1\/finish$/)
  assert.deepEqual(JSON.parse(backendCalls.at(-1).init.body), { leaseToken: 'lease-1' })
})

test('CV cleanup reports Storage errors to the backend retry queue', async () => {
  storageError = { message: 'Storage unavailable' }
  await processCvCleanup()
  assert.match(backendCalls.at(-1).url, /\/cv-cleanup\/cleanup-1\/fail$/)
  assert.deepEqual(JSON.parse(backendCalls.at(-1).init.body), {
    leaseToken: 'lease-1',
    error: 'Storage unavailable',
  })
  storageError = null
})

test('CV cleanup rejects unsafe backend paths before Storage access', async () => {
  items = [{ id: 'cleanup-2', bucket: 'biovity_cv', path: 'cv/../other.pdf', leaseToken: 'lease-2' }]
  const storageCalls = removed.length
  const result = await processCvCleanup()
  assert.equal(result.status, 'invalid_response')
  assert.equal(removed.length, storageCalls)
  items = [{ id: 'cleanup-1', bucket: 'biovity_cv', path: `cv/${owner}/${reservation}.pdf`, leaseToken: 'lease-1' }]
})

test('CV cleanup removes allowed message attachment paths from their bucket', async () => {
  items = [{ id: 'cleanup-3', bucket: 'biovity_bucket', path: 'message-files/owner/file.pdf', leaseToken: 'lease-3' }]
  const result = await processCvCleanup()
  assert.equal(result.status, 'ok')
  assert.equal(buckets.at(-1), 'biovity_bucket')
  assert.deepEqual(removed.at(-1), ['message-files/owner/file.pdf'])
})

test('CV cleanup rejects buckets outside configured storage buckets', async () => {
  items = [{ id: 'cleanup-4', bucket: 'other_bucket', path: 'files/file.pdf', leaseToken: 'lease-4' }]
  const storageCalls = removed.length
  const result = await processCvCleanup()
  assert.equal(result.status, 'invalid_response')
  assert.equal(removed.length, storageCalls)
  items = [{ id: 'cleanup-1', bucket: 'biovity_cv', path: `cv/${owner}/${reservation}.pdf`, leaseToken: 'lease-1' }]
})
