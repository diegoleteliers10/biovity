require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test, beforeEach, afterEach, mock } = require('node:test')
const Module = require('node:module')
const { Result } = require('better-result')
const { ApiError } = require('../lib/errors.ts')

const registration = {
  name: 'Ana Pérez',
  email: 'ANA@BIOVITY.CL',
  password: 'test-password-123',
  organizationName: 'Biovity',
  organizationWebsite: 'https://www.biovity.cl',
}
let signUp
let organizationResult
let signUpCalls
let organizationCalls
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === 'next/server') return { NextResponse: Response }
  if (name === '@/lib/auth') {
    return {
      auth: {
        api: {
          signUpEmail: async (input) => {
            signUpCalls.push(input)
            return signUp()
          },
        },
      },
    }
  }
  if (name === '@/lib/api/organizations') {
    return {
      registerOrganizationForUser: async (input) => {
        organizationCalls.push(input)
        return organizationResult
      },
    }
  }
  return load.call(this, name, parent, ...args)
}
const { POST } = require('../app/api/register/organization/route.ts')
Module._load = load

beforeEach(() => {
  signUpCalls = []
  organizationCalls = []
  signUp = () => Response.json({ user: { id: 'new-user' }, token: null })
  organizationResult = Result.ok({ id: 'new-organization' })
  mock.method(console, 'error', () => {})
})
afterEach(() => mock.restoreAll())

const request = (body = registration) => new Request('https://biovity.test/api/register/organization', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

test('invalid signup requests cannot create accounts or organizations', async () => {
  const invalidBodies = [
    { ...registration, email: 'ana@gmail.com', organizationWebsite: 'https://gmail.com' },
    { ...registration, organizationWebsite: 'https://other.cl' },
    { ...registration, password: 'short' },
    { ...registration, organizationName: '' },
  ]
  for (const body of invalidBodies) {
    const response = await POST(request(body))
    assert.equal(response.status, 400)
    assert.equal(typeof (await response.json()).error, 'string')
  }
  const malformed = new Request('https://biovity.test/api/register/organization', {
    method: 'POST', body: '{',
  })
  assert.equal((await POST(malformed)).status, 400)
  assert.deepEqual(signUpCalls, [])
  assert.deepEqual(organizationCalls, [])
})

test('signup fixes the role and organization owner server-side and does not forward auth tokens', async () => {
  signUp = () => Response.json(
    { user: { id: 'new-user' }, token: 'private-token' },
    { headers: { 'Set-Cookie': 'session=private-token' } }
  )
  const response = await POST(request({
    ...registration,
    type: 'admin',
    ownerUserId: 'another-user',
    organizationId: 'another-organization',
  }))

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), {
    user: { id: 'new-user' }, organizationId: 'new-organization',
  })
  assert.equal(response.headers.get('set-cookie'), null)
  assert.deepEqual(signUpCalls, [{
    body: {
      email: 'ana@biovity.cl', password: registration.password, name: registration.name,
      type: 'organization', profession: 'Representante', avatar: '',
    },
    asResponse: true,
  }])
  assert.deepEqual(organizationCalls, [{
    ownerUserId: 'new-user', name: registration.organizationName,
    website: registration.organizationWebsite,
  }])
})

test('signup uses the contact position when provided', async () => {
  assert.equal((await POST(request({ ...registration, contactPosition: 'Recruiter' }))).status, 200)
  assert.equal(signUpCalls[0].body.profession, 'Recruiter')
})

test('auth service rejections are mapped without creating an organization', async () => {
  for (const [status, body, expectedStatus, message] of [
    [422, { message: 'Email already exists' }, 400, 'Email already exists'],
    [400, { error: 'Invalid email' }, 400, 'Invalid email'],
    [409, { error: { message: 'Duplicate account' } }, 400, 'Duplicate account'],
    [503, {}, 502, 'No pudimos crear la cuenta'],
  ]) {
    signUp = () => Response.json(body, { status })
    const response = await POST(request())
    assert.equal(response.status, expectedStatus)
    assert.deepEqual(await response.json(), { error: message })
  }
  signUp = () => new Response('upstream unavailable', { status: 502 })
  assert.equal((await POST(request())).status, 502)
  assert.deepEqual(organizationCalls, [])
})

test('auth transport failures return a generic error before organization creation', async () => {
  signUp = () => { throw new Error('private infrastructure details') }
  const response = await POST(request())
  assert.equal(response.status, 500)
  assert.deepEqual(await response.json(), { error: 'No pudimos crear la cuenta' })
  assert.deepEqual(organizationCalls, [])
})

test('invalid successful auth responses cannot create an organization without a valid user id', async () => {
  for (const body of [{}, { user: { id: '' } }, { user: { id: 123 } }]) {
    signUp = () => Response.json(body)
    assert.equal((await POST(request())).status, 502)
  }
  signUp = () => new Response('not json')
  assert.equal((await POST(request())).status, 502)
  signUp = () => Response.json({ user: { id: 'new-user' }, error: 'Signup rejected' })
  const rejected = await POST(request())
  assert.equal(rejected.status, 400)
  assert.deepEqual(await rejected.json(), { error: 'Signup rejected' })
  assert.deepEqual(organizationCalls, [])
})

test('an unavailable organization registration endpoint preserves the legacy signup response', async () => {
  organizationResult = Result.err(new ApiError({ status: 404 }))
  const response = await POST(request())
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { success: true })
  assert.equal(signUpCalls.length, 1)
  assert.equal(organizationCalls.length, 1)
})

test('organization persistence failures explain that the account already exists instead of reporting success', async () => {
  for (const error of [new ApiError({ status: 503 }), new Error('connection failed')]) {
    organizationResult = Result.err(error)
    const response = await POST(request())
    assert.equal(response.status, 502)
    assert.deepEqual(await response.json(), {
      error: 'La cuenta se creó, pero falta guardar los datos de la organización. Verifica tu correo e inicia sesión para completar el registro.',
    })
  }
  assert.equal(signUpCalls.length, 2)
  assert.equal(organizationCalls.length, 2)
})
