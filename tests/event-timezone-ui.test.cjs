const test = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')

test('organization event details show the event change audit while open', () => {
  const run = spawnSync(process.execPath, ['-e', `
    require('./tests/register-ts.cjs')
    const Module = require('node:module')
    const load = Module._load
    let changeHistoryEnabled
    Module._load = function(name, ...args) {
      if (name === '@/lib/api/use-events') return {
        useEventChangeHistory: (_eventId, enabled) => {
          changeHistoryEnabled = enabled
          return { history: [{ id: 'change-1', actorUserId: 'manager-1', action: 'updated', changes: { title: { from: 'Old title', to: 'New title' } }, createdAt: '2026-10-10T10:00:00.000Z' }], isLoading: false, isError: false, refetch: () => {} }
        },
        useParticipantStatusHistory: () => ({ history: [], isLoading: false, isError: false, refetch: () => {} })
      }
      if (name === '@/components/ui/dialog') return Object.fromEntries(['Dialog', 'DialogContent', 'DialogDescription', 'DialogHeader', 'DialogTitle'].map(key => [key, ({ children }) => require('react').createElement('div', null, children)]))
      if (name === '@hugeicons/react') return { HugeiconsIcon: () => null }
      return load.call(this, name, ...args)
    }
    const React = require('react')
    const { renderToStaticMarkup } = require('react-dom/server')
    const { EventDetailModal } = require('./components/dashboard/employee/calendar/event-detail-modal.tsx')
    const event = { id: 'event-1', title: 'Interview', type: 'interview', startAt: '2026-10-10T10:00:00.000Z', status: 'scheduled', organizerId: 'manager-1', createdAt: '2026-10-01T10:00:00.000Z' }
    process.stdout.write(renderToStaticMarkup(React.createElement(EventDetailModal, { event, isOpen: true, onClose: () => {}, currentUserRole: 'organization' })))
    process.stdout.write('\\nopen=' + changeHistoryEnabled)
  `], { cwd: require('node:path').join(__dirname, '..'), encoding: 'utf8' })
  assert.equal(run.status, 0, run.stderr)
  assert.match(run.stdout, /Historial del evento/)
  assert.match(run.stdout, /Evento actualizado/)
  assert.match(run.stdout, /Usuario manager-1/)
  assert.match(run.stdout, /Título: Old title → New title/)
  assert.match(run.stdout, /open=true/)
})

for (const [zone, expected, instant] of [
  ['America/Los_Angeles', '05 sep 2026, 21:30', '2026-09-06T04:30:00Z'],
  ['Asia/Tokyo', '06 sep 2026, 13:30', '2026-09-06T04:30:00Z'],
  ['America/Santiago', '06 sep 2026, 01:30', '2026-09-06T04:30:00Z'],
  ['America/Santiago', '05 sep 2026, 00:30', '2026-09-05T04:30:00Z'],
]) {
  test(`interview display uses participant time in ${zone} at ${instant} and labels the event zone`, () => {
    const run = spawnSync(process.execPath, ['-e', `
      require('./tests/register-ts.cjs')
      const Module = require('node:module')
      const load = Module._load
      Module._load = function(name, ...args) {
        if (name === '@/lib/api/use-events') return { useEvents: () => ({ events: [{ id: 'event', title: 'Interview', startAt: '${instant}', timeZone: 'America/Santiago', status: 'scheduled' }] }) }
        return load.call(this, name, ...args)
      }
      const React = require('react')
      const { renderToStaticMarkup } = require('react-dom/server')
      const { ApplicationInterviews } = require('./components/dashboard/organization/ApplicationInterviews.tsx')
      process.stdout.write(renderToStaticMarkup(React.createElement(ApplicationInterviews, {applicationId:'app', organizationId:'org'})))
    `], { cwd: require('node:path').join(__dirname, '..'), env: { ...process.env, TZ: zone }, encoding: 'utf8' })
    assert.equal(run.status, 0, run.stderr)
    assert.ok(run.stdout.includes(expected), run.stdout)
    assert.ok(run.stdout.includes('America/Santiago'), run.stdout)
  })
}


test('organizer edit form shows the saved event-zone date and clock outside Chile', () => {
  const run = spawnSync(process.execPath, ['-e', `
    require('./tests/register-ts.cjs')
    const Module = require('node:module')
    const load = Module._load
    Module._load = function(name, ...args) {
      if (name === '@/lib/api/use-applications') return { useApplicationDetail: () => ({ data: null }) }
      if (name === '@/lib/api/use-pipeline-stages') return { usePipelineStageRubric: () => ({ data: null }) }
      if (name === '@/lib/api/use-events') return { useCreateEvent: () => ({}), useUpdateEvent: () => ({}), useDeleteEvent: () => ({}) }
      if (name === '@/lib/api/use-talent') return { useProfessionalUsers: () => ({}) }
      if (name === '@/lib/api/use-organization-members') return { useOrganizationMembers: () => ({ data: [] }) }
      if (name === '@hugeicons/react') return { HugeiconsIcon: () => null }
      if (name === '@/components/animate-ui/components/radix/sheet') {
        const React = require('react')
        return Object.fromEntries(['Sheet', 'SheetContent', 'SheetHeader', 'SheetTitle', 'SheetDescription'].map(name => [name, ({children}) => React.createElement('div', null, children)]))
      }
      return load.call(this, name, ...args)
    }
    const React = require('react')
    const { renderToStaticMarkup } = require('react-dom/server')
    const { EventFormModal } = require('./components/calendar/event-form-modal/event-form-modal.tsx')
    process.stdout.write(renderToStaticMarkup(React.createElement(EventFormModal, {isOpen:true, onClose:()=>{}, organizerId:'organizer', editEvent:{id:'event', title:'Interview', type:'interview', startAt:'2026-04-05T02:30:27.123Z', timeZone:'America/Santiago'}})))
  `], { cwd: require('node:path').join(__dirname, '..'), env: { ...process.env, TZ: 'Asia/Tokyo' }, encoding: 'utf8' })
  assert.equal(run.status, 0, run.stderr)
  assert.match(run.stdout, /type="date"[^>]*value="2026-04-04"/)
  assert.match(run.stdout, /type="time"[^>]*value="23:30"/)
  assert.ok(run.stdout.includes('value="America/Santiago"'))
})

test('new interview form lists recruiting members and hides viewers', () => {
  const run = spawnSync(process.execPath, ['-e', `
    require('./tests/register-ts.cjs')
    const Module = require('node:module')
    const load = Module._load
    Module._load = function(name, ...args) {
      if (name === '@/lib/api/use-applications') return { useApplicationDetail: () => ({ data: null }) }
      if (name === '@/lib/api/use-pipeline-stages') return { usePipelineStageRubric: () => ({ data: null }) }
      if (name === '@/lib/api/use-events') return { useCreateEvent: () => ({}), useUpdateEvent: () => ({}), useDeleteEvent: () => ({}) }
      if (name === '@/lib/api/use-talent') return { useProfessionalUsers: () => ({}) }
      if (name === '@/lib/api/use-organization-members') return { useOrganizationMembers: () => ({ data: [
        { userId: 'recruiter', role: 'recruiter', user: { name: 'Recruiter Name' } },
        { userId: 'viewer', role: 'viewer', user: { name: 'Viewer Name' } }
      ] }) }
      if (name === '@hugeicons/react') return { HugeiconsIcon: () => null }
      if (name === '@/components/animate-ui/components/radix/sheet') {
        const React = require('react')
        return Object.fromEntries(['Sheet', 'SheetContent', 'SheetHeader', 'SheetTitle', 'SheetDescription'].map(name => [name, ({children}) => React.createElement('div', null, children)]))
      }
      return load.call(this, name, ...args)
    }
    const React = require('react')
    const { renderToStaticMarkup } = require('react-dom/server')
    const { EventFormModal } = require('./components/calendar/event-form-modal/event-form-modal.tsx')
    process.stdout.write(renderToStaticMarkup(React.createElement(EventFormModal, {isOpen:true, onClose:()=>{}, organizerId:'organizer', organizationId:'org', lockedType:'interview'})))
  `], { cwd: require('node:path').join(__dirname, '..'), encoding: 'utf8' })
  assert.equal(run.status, 0, run.stderr)
  assert.ok(run.stdout.includes('Recruiter Name'))
  assert.ok(run.stdout.includes('event-interviewer-recruiter'))
  assert.ok(!run.stdout.includes('Viewer Name'))
})

test('organizer form parser rejects numeric fixed-offset zones', () => {
  require('./register-ts.cjs')
  const { organizerInstant } = require('../lib/event-time.ts')
  for (const timeZone of ['+03:00', '-04:00', '+0300']) {
    const parsed = organizerInstant('2026-10-10T15:30', timeZone)
    assert.equal(parsed.isErr(), true, timeZone)
    assert.match(parsed.error.message, /IANA/)
  }
})

test('weekly calendar places the Tokyo rollover appointment on Sunday at 00:30', () => {
  const run = spawnSync(process.execPath, ['-e', `
    require('./tests/register-ts.cjs')
    const React = require('react')
    const { renderToStaticMarkup } = require('react-dom/server')
    const { WeekView } = require('./components/dashboard/employee/calendar/week-view.tsx')
    process.stdout.write(renderToStaticMarkup(React.createElement(WeekView, {
      currentDate: new Date(2026, 9, 10), onCreateEvent: () => {},
      events: [{id:'event', title:'Tokyo rollover interview', type:'interview', startAt:'2026-10-10T15:30:00Z', endAt:'2026-10-10T16:30:00Z', timeZone:'America/Santiago', status:'scheduled'}]
    })))
  `], { cwd: require('node:path').join(__dirname, '..'), env: { ...process.env, TZ: 'Asia/Tokyo' }, encoding: 'utf8' })
  assert.equal(run.status, 0, run.stderr)
  const columns = run.stdout.split('class="relative border-l border-border/30"').slice(1)
  assert.equal(columns.length, 7)
  assert.ok(columns.slice(0, 6).every(column => !column.includes('Tokyo rollover interview')))
  assert.match(columns[6], /aria-label="Crear evento 11 de octubre a las 00:00"/)
  assert.match(columns[6], /aria-label="Crear evento 11 de octubre a las 23:00"/)
  assert.match(columns[6], /style="top:24px;height:46px"[^>]*><div[^>]*>Tokyo rollover interview/)
  assert.ok(columns[6].includes('00:30'))
  assert.ok(columns[6].includes('America/Santiago'))
})
