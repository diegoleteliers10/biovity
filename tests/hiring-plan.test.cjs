require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')

const { getStageAgeDays, isHiringPlanOverdue } = require('../lib/hiring-plan.ts')

test('marks past target dates overdue only for open applications', () => {
  assert.equal(isHiringPlanOverdue('2026-10-08', 'pendiente', '2026-10-09'), true)
  assert.equal(isHiringPlanOverdue('2026-10-09', 'pendiente', '2026-10-09'), false)
  assert.equal(isHiringPlanOverdue('2026-10-08', 'contratado', '2026-10-09'), false)
})

test('calculates stage age by Chile calendar date', () => {
  assert.equal(
    getStageAgeDays('2026-10-08T02:00:00.000Z', new Date('2026-10-10T02:00:00.000Z')),
    2
  )
})
