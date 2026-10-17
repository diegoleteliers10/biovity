require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const { parseTalentFilters } = require('../lib/api/talent-search.ts')

test('accepts saved talent filters with supported values', () => {
  assert.deepEqual(
    parseTalentFilters({
      profession: 'chemist',
      experienceLevel: 'senior',
      availability: '2weeks',
      minExp: 3,
      maxExp: 8,
    }),
    {
      search: undefined,
      profession: 'chemist',
      city: undefined,
      country: undefined,
      experienceLevel: 'senior',
      availability: '2weeks',
      skills: undefined,
      minExp: 3,
      maxExp: 8,
    },
  )
})

test('rejects unsupported values and invalid experience ranges', () => {
  assert.equal(parseTalentFilters({ experienceLevel: 'principal' }), null)
  assert.equal(parseTalentFilters({ availability: 'tomorrow' }), null)
  assert.equal(parseTalentFilters({ minExp: 7, maxExp: 2 }), null)
  assert.equal(parseTalentFilters({ profession: 'chemist', notifyEnabled: true }), null)
})
