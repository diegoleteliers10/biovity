require('./register-ts.cjs')
const test = require('node:test')
const assert = require('node:assert/strict')
const { createEvent, getEventChangeHistory, getParticipantStatusHistory, updateEvent } = require('../lib/api/events.ts')

test('event API writes and returns explicit UTC instants and IANA zones', async (t) => {
  const requests = []
  t.mock.method(global, 'fetch', async (_url, init) => {
    const body = JSON.parse(init.body)
    requests.push({ method: init.method, body })
    return Response.json({ data: { id: 'event', ...body } })
  })
  const created = await createEvent({ title: 'Interview', type: 'interview', organizerId: 'organizer', startAt: '2026-09-06T04:30:00.000Z', timeZone: 'America/Santiago' })
  assert.equal(created.isOk(), true)
  assert.equal(created.value.startAt, '2026-09-06T04:30:00.000Z')
  assert.equal(created.value.timeZone, 'America/Santiago')
  const edited = await updateEvent('event', { startAt: '2026-09-07T00:30:00.000Z', timeZone: 'Asia/Tokyo' })
  assert.equal(edited.isOk(), true)
  assert.equal(edited.value.startAt, '2026-09-07T00:30:00.000Z')
  assert.equal(edited.value.timeZone, 'Asia/Tokyo')
  assert.deepEqual(requests, [
    { method: 'POST', body: { title: 'Interview', type: 'interview', organizerId: 'organizer', startAt: '2026-09-06T04:30:00.000Z', timeZone: 'America/Santiago' } },
    { method: 'PATCH', body: { startAt: '2026-09-07T00:30:00.000Z', timeZone: 'Asia/Tokyo' } },
  ])
})

test('participant history API reads one event participant timeline', async (t) => {
  const request = { data: { eventId: 'event-1', userId: 'candidate-1', entries: [] } }
  const fetch = t.mock.method(global, 'fetch', async (url) => {
    assert.match(String(url), /\/api\/v1\/events\/event-1\/participants\/candidate-1\/status-history$/)
    return Response.json(request)
  })

  const result = await getParticipantStatusHistory('event-1', 'candidate-1')

  assert.equal(result.isOk(), true)
  assert.deepEqual(result.value, request.data)
  assert.equal(fetch.mock.callCount(), 1)
})

test('event change history API reads the audit timeline', async (t) => {
  const request = { data: { eventId: 'event-1', entries: [] } }
  const fetch = t.mock.method(global, 'fetch', async (url) => {
    assert.match(String(url), /\/api\/v1\/events\/event-1\/change-history$/)
    return Response.json(request)
  })

  const result = await getEventChangeHistory('event-1')

  assert.equal(result.isOk(), true)
  assert.deepEqual(result.value, request.data)
  assert.equal(fetch.mock.callCount(), 1)
})
