require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const { Result } = require('better-result')
const { ApiError } = require('../lib/errors.ts')
const owner = '00000000-0000-4000-8000-000000000001'
const path = `cv/file_${owner}.pdf`
let session = { user: { id: owner } }
let storedResume = { id: 'resume', userId: owner, cvFile: { path } }
let updateError = null
const removals = []
const updates = []
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === 'next/headers') return { headers: async () => new Headers({ cookie: 'better-auth.session_token=fixture' }) }
  if (name === '@/lib/auth') return { auth: { api: { getSession: async () => session } } }
  if (name === '@/lib/api/resumes') return {
    getResumeByUserId: async () => Result.ok(storedResume),
    updateResume: async (id, input, headers) => {
      updates.push({ id, input, headers })
      return updateError ? Result.err(updateError) : Result.ok({ ...storedResume, ...input })
    },
  }
  if (name === '@/lib/supabase') return { getSupabaseAdmin: () => ({ storage: { from: () => ({
    remove: async (paths) => { removals.push(paths); return { error: null } },
  }) } }) }
  return load.call(this, name, parent, ...args)
}
const { DELETE } = require('../app/api/delete/cv/route.ts')

function request(cvPath = path, resumeId = 'resume') {
  return new Request(`http://localhost/api/delete/cv?resumeId=${resumeId}&path=${encodeURIComponent(cvPath)}`)
}

test('CV delete rejects a missing session before storage access', async () => {
  session = null
  const response = await DELETE(request())
  assert.equal(response.status, 401)
  assert.equal(removals.length, 0)
  session = { user: { id: owner } }
})

test('CV delete rejects a different stored file or resume', async () => {
  assert.equal((await DELETE(request(`cv/other_${owner}.pdf`))).status, 403)
  assert.equal((await DELETE(request(path, 'other-resume'))).status, 403)
  assert.equal((await DELETE(request('../avatar/other.png'))).status, 403)
  assert.equal(removals.length, 0)
  assert.equal(updates.length, 0)
})

test('CV delete preserves storage when the backend refuses the metadata update', async () => {
  updateError = new ApiError({ status: 403, message: 'Denied' })
  assert.equal((await DELETE(request())).status, 500)
  assert.equal(removals.length, 0)
  updateError = null
})

test('owner CV delete clears metadata with its cookie before file removal', async () => {
  assert.equal((await DELETE(request())).status, 200)
  assert.deepEqual(updates.at(-1).input, { cvFile: null })
  assert.equal(updates.at(-1).headers.get('cookie'), 'better-auth.session_token=fixture')
  assert.deepEqual(removals, [[path]])
})
