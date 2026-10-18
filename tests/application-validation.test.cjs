require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')

const { applicationStatusSchema } = require('../lib/validations/application.ts')

test('application status schema accepts candidate withdrawal', () => {
  assert.equal(applicationStatusSchema.parse('desistido'), 'desistido')
})
