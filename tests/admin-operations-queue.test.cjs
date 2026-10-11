require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')

const { buildOperationsQueueUrl } = require('../components/dashboard/admin/AdminOperationsQueue.tsx')

test('builds the selected queue request with search and paging filters', () => {
  assert.equal(
    buildOperationsQueueUrl({
      type: 'organization_without_active_jobs',
      page: 3,
      limit: 20,
      search: ' BioVity ',
    }),
    '/api/admin/operations-queue?type=organization_without_active_jobs&page=3&limit=20&search=BioVity',
  )
})

test('keeps the existing queue filters available', () => {
  assert.equal(
    buildOperationsQueueUrl({ type: 'expired_job', page: 1, limit: 20, search: '' }),
    '/api/admin/operations-queue?type=expired_job&page=1&limit=20',
  )
  assert.equal(
    buildOperationsQueueUrl({ type: 'application_follow_up', page: 2, limit: 20, search: '' }),
    '/api/admin/operations-queue?type=application_follow_up&page=2&limit=20',
  )
})
