require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const { QueryClient } = require('@tanstack/react-query')
const actualQuery = require('@tanstack/react-query')
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
const disposers = []
let removals = 0
const channel = {
  on() { return this },
  subscribe() { return this },
}
const supabase = {
  channel() { return channel },
  removeChannel() { removals += 1 },
}
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === '@tanstack/react-query') return {
    ...actualQuery,
    useMutation: (options) => options,
    useQueryClient: () => queryClient,
    useQuery: (options) => ({ data: [], isLoading: false, options }),
  }
  if (name === 'react') return {
    useEffect: (subscribe) => { const dispose = subscribe(); if (dispose) disposers.push(dispose) },
    useCallback: (fn) => fn,
    useSyncExternalStore: (subscribe, snapshot) => { disposers.push(subscribe(() => {})); return snapshot() },
  }
  if (name === 'next/navigation') return { useRouter: () => ({ push() {} }) }
  if (name === 'sonner') return { toast: { info() {} } }
  if (name === '@/lib/supabase-browser') return { createClientBrowser: () => supabase }
  if (name === './use-realtime-topics') return { useRealtimeUserTopic: () => 'fixture-topic' }
  return load.call(this, name, parent, ...args)
}

const jobs = require('../lib/api/jobs.ts')
const hooks = require('../lib/api/use-jobs.ts')
const orgId = '00000000-0000-4000-8000-000000000001'
const job = { id: '00000000-0000-4000-8000-000000000002', organizationId: orgId, title: 'Fixture', status: 'draft' }

test('job creation unwraps the backend response before cache insertion', async (t) => {
  const previous = global.fetch
  t.after(() => { global.fetch = previous })
  global.fetch = async () => Response.json({ data: job, timestamp: new Date().toISOString() })
  const result = await jobs.createJob({ organizationId: orgId, title: 'Fixture' })
  assert.equal(result.isOk(), true)
  assert.equal(result.value.id, job.id)
})

test('job deletion removes the offer from the visible cache without a refetch', () => {
  queryClient.clear()
  const key = [...hooks.jobsKeys.byOrganization(orgId), 1, 10]
  queryClient.setQueryData(key, { data: [job], total: 1, page: 1, limit: 10, totalPages: 1 })
  const mutation = hooks.useDeleteJobMutation(orgId)
  mutation.onSuccess(undefined, job.id)
  assert.deepEqual(queryClient.getQueryData(key).data, [])
  assert.equal(queryClient.getQueryData(key).total, 0)
})

test('Jev queue serializes the fields that PostgreSQL reads', async (t) => {
  const { pool } = require('../lib/db/index.ts')
  const { enqueueCandidateAssessments } = require('../lib/db/application-ai-score.ts')
  const previous = pool.connect
  t.after(() => { pool.connect = previous })
  pool.connect = async () => ({
    release() {},
    async query(sql, values) {
      if (sql.includes('SELECT analysis_count')) return { rows: [{ analysis_count: 0 }] }
      if (sql.includes('WITH requested')) return { rows: [{ count: 1 }] }
      if (sql.includes('INSERT INTO application_ai_score (')) {
        const row = JSON.parse(values[1])[0]
        assert.equal(row.application_id, job.id)
        assert.equal(row.candidate_id, orgId)
        assert.equal(row.job_id, job.id)
        assert.equal(row.requested_by, orgId)
        assert.deepEqual(row.job_snapshot, { title: 'Fixture' })
        assert.deepEqual(row.candidate_snapshot, { skills: [] })
        return { rowCount: 1, rows: [{ id: job.id }] }
      }
      return { rows: [], rowCount: 1 }
    },
  })
  const result = await enqueueCandidateAssessments(orgId, [{
    applicationId: job.id, candidateId: orgId, jobId: job.id, organizationId: orgId,
    requestedBy: orgId, fingerprint: 'fixture', jobSnapshot: { title: 'Fixture' }, candidateSnapshot: { skills: [] },
  }])
  assert.equal(result.isOk(), true, 'The SQL payload must contain all required IDs and snapshots')
  assert.equal(result.value.queued, 1)
})

test('leaving a chat cannot disconnect the global notifications subscription', () => {
  const { useNotificationsRealtime } = require('../lib/api/use-notifications.ts')
  const { useMessages } = require('../lib/api/use-messages.ts')
  useNotificationsRealtime(orgId, 'fixture-session')
  const parentSubscriptions = disposers.length
  useMessages(job.id, orgId)
  for (const dispose of disposers.splice(parentSubscriptions)) dispose()
  assert.equal(removals, 0)
  for (const dispose of disposers.splice(0)) dispose()
})

test('a live message and notification update the shared cache once and reject another user', () => {
  const { applyDashboardEvent } = require('../lib/realtime/dashboard-events.ts')
  queryClient.clear()
  queryClient.setQueryData(['messages', 'chat', job.id], [])
  const message = { id: 'message-1', chatId: job.id, senderId: orgId, content: 'Probe',
    type: 'text', contentType: null, isRead: false, createdAt: new Date().toISOString() }
  applyDashboardEvent(queryClient, orgId, { event: 'message_insert', payload: { payload: message } })
  applyDashboardEvent(queryClient, orgId, { event: 'message_insert', payload: { payload: message } })
  assert.equal(queryClient.getQueryData(['messages', 'chat', job.id]).length, 1)
  const notification = { id: 'notification-1', user_id: orgId, type: 'message', title: 'Probe',
    body: null, link: null, data: null, is_read: false, created_at: message.createdAt }
  const event = { event: 'notification_insert', payload: { payload: notification } }
  assert.ok(applyDashboardEvent(queryClient, orgId, event))
  assert.equal(applyDashboardEvent(queryClient, orgId, event), null)
  assert.equal(queryClient.getQueryData(['notifications', orgId]).unreadCount, 1)
  assert.equal(applyDashboardEvent(queryClient, job.id, event), null)
  assert.equal(queryClient.getQueryData(['notifications', job.id]), undefined)
})

test('shared channel survives one subscriber leaving and reconciles on reconnect', async () => {
  const { subscribeUserChannel } = require('../lib/realtime/user-channel.ts')
  let statusCallback
  let removed = 0
  let connected = 0
  const handlers = new Map()
  const socket = {
    on(_type, filter, callback) { handlers.set(filter.event, callback); return this },
    subscribe(callback) { statusCallback = callback; return this },
  }
  const client = { channel: () => socket, removeChannel: () => { removed += 1 } }
  const events = []
  const listener = { onEvent: event => events.push(event), onConnected: () => { connected += 1 }, onStatusChange() {} }
  const leaveA = subscribeUserChannel(client, 'shared', listener)
  const leaveB = subscribeUserChannel(client, 'shared', { ...listener })
  statusCallback('SUBSCRIBED')
  leaveA()
  await Promise.resolve()
  handlers.get('message_insert')({ payload: {} })
  assert.equal(removed, 0)
  assert.equal(events.length, 1)
  statusCallback('SUBSCRIBED')
  assert.equal(connected, 3)
  leaveB()
  await Promise.resolve()
  assert.equal(removed, 1)
})

test('creating an offer updates page one and keeps status filters isolated', () => {
  const { storeCreatedJob } = require('../lib/api/jobs-cache.ts')
  queryClient.clear()
  const drafts = ['jobs', 'organization', orgId, 1, 10, 'draft', '']
  const active = ['jobs', 'organization', orgId, 1, 10, 'active', '']
  const empty = { data: [], total: 0, page: 1, limit: 10, totalPages: 0 }
  queryClient.setQueryData(drafts, empty)
  queryClient.setQueryData(active, empty)
  storeCreatedJob(queryClient, orgId, job)
  assert.equal(queryClient.getQueryData(drafts).data[0].id, job.id)
  assert.equal(queryClient.getQueryData(active).data.length, 0)
})

test('remount waits for a slow unsubscribe before it opens a new channel', async () => {
  const { subscribeUserChannel } = require('../lib/realtime/user-channel.ts')
  let acknowledge
  let existing
  let opened = 0
  const client = {
    channel() {
      if (existing) return existing
      opened += 1
      existing = { handlers: new Map(),
        on(_type, filter, callback) { this.handlers.set(filter.event, callback); return this },
        subscribe(callback) { this.status = callback; return this },
      }
      return existing
    },
    removeChannel() { return new Promise(resolve => { acknowledge = () => { existing = undefined; resolve('ok') } }) },
  }
  let events = 0
  const listener = { onEvent() { events += 1 }, onConnected() {}, onStatusChange() {} }
  const leave = subscribeUserChannel(client, 'slow', listener)
  leave()
  await Promise.resolve()
  const leaveReplacement = subscribeUserChannel(client, 'slow', { ...listener })
  assert.equal(opened, 1)
  acknowledge()
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(opened, 2)
  existing.status('SUBSCRIBED')
  existing.handlers.get('message_insert')({ payload: {} })
  assert.equal(events, 1)
  leaveReplacement()
  await Promise.resolve()
  acknowledge()
})

test('private resource changes invalidate dependent panels without changing other cached data', () => {
  const { invalidateResource } = require('../lib/realtime/resources.ts')
  queryClient.clear()
  queryClient.setQueryData(['applications', 'job', job.id], [])
  queryClient.setQueryData(['org', 'metrics', orgId], { count: 1 })
  queryClient.setQueryData(['job-alerts', orgId], [])
  assert.equal(invalidateResource(queryClient, { payload: { resource: 'application', id: job.id, operation: 'update' } }), 'application')
  assert.equal(queryClient.getQueryState(['applications', 'job', job.id]).isInvalidated, true)
  assert.equal(queryClient.getQueryState(['org', 'metrics', orgId]).isInvalidated, true)
  assert.equal(queryClient.getQueryState(['job-alerts', orgId]).isInvalidated, false)
  assert.equal(invalidateResource(queryClient, { resource: 'unknown', id: job.id, operation: 'update' }), null)
})

test('template lists and creations use the backend envelope data', async (t) => {
  const previous = global.fetch
  t.after(() => { global.fetch = previous })
  for (const [module, getter, creator] of [
    ['job-templates', 'getJobTemplates', 'createJobTemplate'],
    ['message-templates', 'getMessageTemplates', 'createMessageTemplate'],
  ]) {
    const api = require(`../lib/api/${module}.ts`)
    global.fetch = async () => Response.json({ data: [job] })
    assert.equal((await api[getter](orgId)).value[0].id, job.id)
    global.fetch = async () => Response.json({ data: job })
    assert.equal((await api[creator](orgId, { title: 'Fixture' })).value.id, job.id)
  }
})

test('a stale pending message GET cannot erase a live message', async () => {
  const { applyDashboardEvent } = require('../lib/realtime/dashboard-events.ts')
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const key = ['messages', 'chat', job.id]
  client.setQueryData(key, [])
  let completeGet
  const stale = client.fetchQuery({ queryKey: key, queryFn: () => new Promise(resolve => { completeGet = resolve }) }).then(() => {}, () => {})
  applyDashboardEvent(client, orgId, { event: 'message_insert', payload: { id: 'live', chatId: job.id, senderId: orgId, content: 'Probe', createdAt: new Date().toISOString() } })
  completeGet([])
  await stale
  assert.equal(client.getQueryData(key)[0].id, 'live')
  client.clear()
})

test('server-side job and event tools forward the authenticated session', async (t) => {
  const previous = global.fetch
  t.after(() => { global.fetch = previous })
  const cookie = 'better-auth.session_token=fixture-token'
  const requestHeaders = new Headers({ cookie })
  const seen = []
  global.fetch = async (url, init) => {
    seen.push({ url: String(url), cookie: new Headers(init.headers).get('cookie') })
    return Response.json({ data: job })
  }
  const events = require('../lib/api/events.ts')
  await jobs.createJob({ organizationId: orgId, title: 'Fixture' }, requestHeaders)
  await jobs.updateJob(job.id, { title: 'Updated' }, requestHeaders)
  await events.createEvent({ title: 'Interview' }, requestHeaders)
  await events.updateEvent(job.id, { title: 'Updated' }, requestHeaders)
  await events.getEvents({ organizationId: orgId }, requestHeaders)
  assert.equal(seen.length, 5)
  assert.ok(seen.every((call) => call.cookie === cookie))
  assert.ok(seen.at(-1).url.includes('organizationId='))
})

test('a pending notification GET cannot remove a notification delivered live', async () => {
  const { applyDashboardEvent } = require('../lib/realtime/dashboard-events.ts')
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const key = ['notifications', orgId]
  client.setQueryData(key, { data: [], unreadCount: 0 })
  let completeGet
  const stale = client.fetchQuery({ queryKey: key, queryFn: () => new Promise(resolve => { completeGet = resolve }) }).then(() => {}, () => {})
  applyDashboardEvent(client, orgId, { event: 'notification_insert', payload: {
    id: 'live-notification', user_id: orgId, type: 'message', title: 'Message', body: null,
    link: null, data: null, is_read: false, created_at: new Date().toISOString(),
  } })
  completeGet({ data: [], unreadCount: 0 })
  await stale
  assert.equal(client.getQueryData(key).data[0]?.id, 'live-notification')
  assert.equal(client.getQueryData(key).unreadCount, 1)
  client.clear()
})

test('topic rotation keeps the old subscription live until the replacement joins', async () => {
  const { subscribeDashboardChannel } = require('../lib/realtime/dashboard-subscription.ts')
  const channels = new Map()
  const removed = []
  const client = {
    channel(topic) {
      if (channels.has(topic)) return channels.get(topic)
      const channel = { handlers: new Map(), on(_type, filter, callback) { this.handlers.set(filter.event, callback); return this }, subscribe(callback) { this.status = callback; return this } }
      channels.set(topic, channel)
      return channel
    },
    async removeChannel(channel) { removed.push(channel); return 'ok' },
  }
  let events = 0
  const listener = { onEvent() { events += 1 }, onConnected() {}, onStatusChange() {} }
  const leaveOld = subscribeDashboardChannel(client, 'user:session', 'old', listener)
  channels.get('old').status('SUBSCRIBED')
  leaveOld()
  const leaveNew = subscribeDashboardChannel(client, 'user:session', 'new', listener)
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(removed.length, 0)
  channels.get('old').handlers.get('notification_insert')({ payload: {} })
  assert.equal(events, 1)
  channels.get('new').status('SUBSCRIBED')
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(removed.length, 1)
  leaveNew()
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(removed.length, 2)
})

test('notification read changes the count before its PATCH completes', async (t) => {
  const previous = global.fetch
  t.after(() => { global.fetch = previous; queryClient.clear() })
  queryClient.clear()
  const key = ['notifications', orgId]
  queryClient.setQueryData(key, { data: [{ id: 'read-now', isRead: false }], unreadCount: 1 })
  let finishPatch
  global.fetch = () => new Promise(resolve => { finishPatch = resolve })
  const notifications = require('../lib/api/use-notifications.ts')
  const options = notifications.useMarkNotificationRead(orgId)
  const mutation = queryClient.getMutationCache().build(queryClient, options)
  const execution = mutation.execute('read-now')
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(queryClient.getQueryData(key).unreadCount, 0)
  assert.equal(mutation.state.status, 'pending')
  finishPatch(new Response(null, { status: 204 }))
  await execution
  assert.equal(mutation.state.status, 'success')
})

test('mark all read handles hidden unread rows and rollback preserves new notifications', () => {
  const { readNotifications, restoreUnreadNotifications } = require('../lib/api/notification-cache.ts')
  const client = new QueryClient()
  const key = ['notifications', orgId]
  client.setQueryData(key, { data: [{ id: 'old', isRead: false }], unreadCount: 80 })
  const context = readNotifications(client, orgId)
  assert.equal(client.getQueryData(key).unreadCount, 0)
  client.setQueryData(key, current => ({ data: [{ id: 'new', isRead: false }, ...current.data], unreadCount: 1 }))
  restoreUnreadNotifications(client, orgId, context.ids, context.hiddenUnreadCount)
  assert.equal(client.getQueryData(key).unreadCount, 81)
  assert.equal(client.getQueryData(key).data[0].id, 'new')
  client.clear()
})

test('calendar creation and deletion change the visible month without a GET', () => {
  const { storeCalendarEvent, removeCalendarEvent } = require('../lib/api/events-cache.ts')
  const client = new QueryClient()
  const key = ['events', 'list', { organizerId: orgId, from: '2026-10-01', to: '2026-10-31', limit: 100 }]
  const outsideKey = ['events', 'list', { organizerId: orgId, from: '2026-11-01', to: '2026-11-30', limit: 100 }]
  const page = { data: [], total: 0, page: 1, limit: 100, totalPages: 0 }
  client.setQueryData(key, page)
  client.setQueryData(outsideKey, page)
  const event = { id: job.id, organizerId: orgId, title: 'Interview', startAt: '2026-10-20T12:00:00Z', type: 'interview', status: 'scheduled' }
  storeCalendarEvent(client, event)
  assert.equal(client.getQueryData(key).data[0].id, event.id)
  assert.equal(client.getQueryData(key).total, 1)
  assert.equal(client.getQueryData(outsideKey).total, 0)
  removeCalendarEvent(client, event.id)
  assert.equal(client.getQueryData(key).data.length, 0)
  assert.equal(client.getQueryData(key).total, 0)
  client.clear()
})

test('two pending notification reads never refetch and keep the optimistic state', async (t) => {
  const { QueryObserver } = actualQuery
  const previous = global.fetch
  const key = ['notifications', orgId]
  queryClient.clear()
  const rows = [{ id: 'A', isRead: false }, { id: 'B', isRead: false }]
  queryClient.setQueryData(key, { data: rows, unreadCount: 2 })
  const finish = new Map()
  let reads = 0
  global.fetch = (url, init) => {
    if (init.method === 'PATCH') return new Promise(resolve => finish.set(new URL(url).searchParams.get('id'), resolve))
    reads += 1
    return Promise.resolve(Response.json({ data: rows, unreadCount: 2 }))
  }
  const hooks = require('../lib/api/use-notifications.ts')
  const queryOptions = hooks.useNotifications(orgId).options
  const observer = new QueryObserver(queryClient, { ...queryOptions, staleTime: Infinity, refetchOnMount: false, refetchInterval: false })
  const unsubscribe = observer.subscribe(() => {})
  const first = queryClient.getMutationCache().build(queryClient, hooks.useMarkNotificationRead(orgId)).execute('A')
  const second = queryClient.getMutationCache().build(queryClient, hooks.useMarkNotificationRead(orgId)).execute('B')
  t.after(async () => { for (const resolve of finish.values()) resolve(new Response(null, { status: 204 })); await Promise.allSettled([first, second]); global.fetch = previous; unsubscribe(); queryClient.clear() })
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(queryClient.getQueryData(key).unreadCount, 0)
  finish.get('A')(new Response(null, { status: 204 }))
  await first
  assert.equal(reads, 0)
  await observer.refetch()
  assert.equal(queryClient.getQueryData(key).data.find(row => row.id === 'B').isRead, true)
  finish.get('B')(new Response(null, { status: 204 }))
  await second
  assert.equal(reads, 1)
})

test('an incoming message updates the unread badge once before a chat GET', () => {
  const { applyDashboardEvent } = require('../lib/realtime/dashboard-events.ts')
  const client = new QueryClient()
  const key = ['chats', 'recruiter', orgId]
  client.setQueryData(key, [{ id: job.id, recruiterId: orgId, professionalId: 'candidate', unreadCountRecruiter: 0, unreadCountProfessional: 0 }])
  const event = { event: 'message_insert', payload: { id: 'badge-message', chatId: job.id, senderId: 'candidate', content: 'Live', createdAt: new Date().toISOString() } }
  applyDashboardEvent(client, orgId, event)
  applyDashboardEvent(client, orgId, event)
  assert.equal(client.getQueryData(key)[0].unreadCountRecruiter, 1)
  assert.equal(client.getQueryData(key)[0].lastMessage, 'Live')
  client.clear()
})
