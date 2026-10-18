require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')

const { getOrganizationJobSubmissionStatus } = require('../lib/api/organizations.ts')

test('only verified organizations can submit active jobs', () => {
  assert.equal(getOrganizationJobSubmissionStatus({ status: 'verified', latestRequest: null }), 'active')
  assert.equal(getOrganizationJobSubmissionStatus({ status: 'pending', latestRequest: null }), 'draft')
  assert.equal(getOrganizationJobSubmissionStatus({ status: 'unverified', latestRequest: null }), 'draft')
  assert.equal(getOrganizationJobSubmissionStatus({ status: 'rejected', latestRequest: null }), 'draft')
  assert.equal(getOrganizationJobSubmissionStatus({ status: 'suspended', latestRequest: null }), 'draft')
  assert.equal(getOrganizationJobSubmissionStatus(undefined), 'draft')
})
