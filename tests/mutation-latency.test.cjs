require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const { QueryObserver } = require('@tanstack/react-query')
const { createQueryClient } = require('../lib/query-client.ts')

test('marking one notification read does not reload unrelated dashboard panels', async () => {
  const client = createQueryClient()
  const reads = { profile: 0, metrics: 0 }
  const observers = Object.keys(reads).map(name => {
    client.setQueryData([name], { value: 1 })
    const observer = new QueryObserver(client, { queryKey: [name], staleTime: Infinity, queryFn: async () => { reads[name] += 1; return { value: 1 } } })
    return observer.subscribe(() => {})
  })
  const mutation = client.getMutationCache().build(client, { mutationFn: async () => undefined })
  await mutation.execute('notification-id')
  assert.deepEqual(reads, { profile: 0, metrics: 0 })
  observers.forEach(unsubscribe => unsubscribe())
  client.clear()
})

test('profile save completes while the refresh GET is still pending', async (t) => {
  const Module = require('node:module')
  const { Result } = require('better-result')
  const query = require('@tanstack/react-query')
  const client = createQueryClient()
  const load = Module._load
  Module._load = function(name, parent, ...args) {
    if (name === '@tanstack/react-query') return { ...query, useQueryClient: () => client, useMutation: options => options }
    if (name === './users' && parent.filename.endsWith('use-profile.ts')) return { updateUser: async () => Result.ok({ id: 'user', name: 'Updated' }) }
    return load.call(this, name, parent, ...args)
  }
  const { useUpdateUserMutation, profileKeys } = require('../lib/api/use-profile.ts')
  Module._load = load
  let finishGet
  const key = profileKeys.user('user')
  client.setQueryData(key, { id: 'user', name: 'Before' })
  const observer = new QueryObserver(client, { queryKey: key, staleTime: Infinity, queryFn: () => new Promise(resolve => { finishGet = resolve }) })
  const unsubscribe = observer.subscribe(() => {})
  const mutation = client.getMutationCache().build(client, useUpdateUserMutation('user'))
  const execution = mutation.execute({ name: 'Updated' })
  t.after(async () => { if (finishGet) finishGet({ id: 'user', name: 'Updated' }); await execution; unsubscribe(); client.clear() })
  const result = await Promise.race([execution.then(() => 'saved'), new Promise(resolve => setImmediate(() => resolve('waiting-for-read')))])
  assert.equal(result, 'saved')
  assert.equal(client.getQueryData(key).name, 'Updated')
})
