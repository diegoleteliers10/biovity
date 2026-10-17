require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')

const { matchesOrganizationEmailDomain } = require('../lib/organization-domain.ts')
const { organizationRegistrationSchema } = require('../lib/validations/auth.ts')

const validRegistration = {
  contactName: 'Ana Test',
  contactEmail: 'ana@biovity.cl',
  contactPassword: 'SecurePass123',
  confirmPassword: 'SecurePass123',
  contactPosition: 'Administradora',
  organizationName: 'Biovity',
  organizationWebsite: 'https://www.biovity.cl',
  acceptTerms: true,
}

test('organization signup requires the verified email and website domains to match', () => {
  assert.equal(matchesOrganizationEmailDomain('ana@biovity.cl', 'https://www.biovity.cl'), true)
  assert.equal(matchesOrganizationEmailDomain('ana@biovity.cl', 'https://other.cl'), false)
  assert.equal(matchesOrganizationEmailDomain('ana@biovity.cl', ''), false)
})

test('organization signup rejects a website with a different email domain', () => {
  assert.equal(
    organizationRegistrationSchema.safeParse({
      ...validRegistration,
      organizationWebsite: 'https://other.cl',
    }).success,
    false
  )
})

test('organization signup rejects public email providers', () => {
  assert.equal(
    organizationRegistrationSchema.safeParse({
      ...validRegistration,
      contactEmail: 'ana@gmail.com',
      organizationWebsite: 'https://gmail.com',
    }).success,
    false
  )
})
