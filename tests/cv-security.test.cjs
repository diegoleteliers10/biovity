require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const { Result } = require('better-result')
const { ApiError } = require('../lib/errors.ts')
const owner = '00000000-0000-4000-8000-000000000001'
const path = `cv/file_${owner}.pdf`
let session = { user: { id: owner } }
let storedResume = { id: 'resume', userId: owner, cvVersion: 4, cvFile: { path } }
let deleteError = null
let resumeError = null
const removals = []
const deletedRequests = []
const signedUrls = []
const uploads = []
const reservationId = '00000000-0000-4000-8000-000000000002'
const reservedPath = `cv/${owner}/${reservationId}.pdf`
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === 'next/headers') return { headers: async () => new Headers({ cookie: 'better-auth.session_token=fixture' }) }
  if (name === '@/lib/auth') return { auth: { api: { getSession: async () => session } } }
  if (name === '@/lib/api/resumes') return {
    getResumeByUserId: async () => resumeError ? Result.err(resumeError) : Result.ok(storedResume),
  }
  if (name === '@/lib/result') return {
    fetchJsonWithSession: async (url, headers, init) => {
      const call = { url, headers, init }
      deletedRequests.push(call)
      if (deleteError) return Result.err(deleteError)
      if (url.endsWith('/cv-upload-reservations')) {
        return Result.ok({ reservationId, path: reservedPath, version: 4 })
      }
      if (url.endsWith(`/cv-upload-reservations/${reservationId}/finalize`)) {
        return Result.ok({ ...storedResume, cvFile: { path: reservedPath } })
      }
      return Result.ok({ success: true })
    },
  }
  if (name === '@/lib/supabase') return { getSupabaseAdmin: () => ({ storage: { from: () => ({
    upload: async (filePath, file, options) => {
      uploads.push({ filePath, file, options })
      return { data: { path: filePath }, error: null }
    },
    remove: async (paths) => { removals.push(paths); return { error: null } },
    createSignedUrl: async (filePath, expiresIn) => {
      signedUrls.push({ filePath, expiresIn })
      return { data: { signedUrl: 'https://storage.test/cv' }, error: null }
    },
  }) } }) }
  return load.call(this, name, parent, ...args)
}
const { DELETE } = require('../app/api/delete/cv/route.ts')
const { GET } = require('../app/api/cv/signed-url/route.ts')
const { POST: uploadCv } = require('../app/api/upload/cv/route.ts')

function request(cvPath = path, resumeId = 'resume') {
  return new Request(`http://localhost/api/delete/cv?resumeId=${resumeId}&path=${encodeURIComponent(cvPath)}`)
}

function signedUrlRequest(cvPath = path) {
  return new Request(`http://localhost/api/cv/signed-url?path=${encodeURIComponent(cvPath)}`)
}

function uploadRequest(file = new File(['%PDF-1.7\ncontent'], 'resume.pdf', { type: 'application/pdf' })) {
  const formData = new FormData()
  formData.set('resumeId', 'resume')
  formData.set('file', file)
  return new Request('http://localhost/api/upload/cv', { method: 'POST', body: formData })
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
  assert.equal(deletedRequests.length, 0)
})

test('CV delete keeps its pointer when the backend refuses the versioned delete', async () => {
  deleteError = new ApiError({ status: 403, message: 'Denied' })
  assert.equal((await DELETE(request())).status, 403)
  assert.equal(removals.length, 0)
  deleteError = null
})

test('owner CV delete asks the backend to clear the expected path and version', async () => {
  assert.equal((await DELETE(request())).status, 200)
  assert.equal(deletedRequests.at(-1).url, 'http://localhost:3001/api/v1/resumes/resume/cv')
  assert.equal(deletedRequests.at(-1).headers.get('cookie'), 'better-auth.session_token=fixture')
  assert.deepEqual(JSON.parse(deletedRequests.at(-1).init.body), {
    expectedPath: path,
    expectedVersion: 4,
  })
  assert.deepEqual(removals, [])
})

test('CV signed URL rejects a missing session before storage access', async () => {
  session = null
  const response = await GET(signedUrlRequest())
  assert.equal(response.status, 401)
  assert.equal(signedUrls.length, 0)
  session = { user: { id: owner } }
})

test('CV signed URL rejects invalid or mismatched paths before storage access', async () => {
  assert.equal((await GET(signedUrlRequest('../avatar/other.png'))).status, 400)
  storedResume = { ...storedResume, cvFile: { path: `cv/other_${owner}.pdf` } }
  assert.equal((await GET(signedUrlRequest())).status, 403)
  assert.equal(signedUrls.length, 0)
  storedResume = { id: 'resume', userId: owner, cvFile: { path } }
})

test('CV signed URL returns the backend denial without storage access', async () => {
  resumeError = new ApiError({ status: 403, message: 'Denied' })
  const response = await GET(signedUrlRequest())
  assert.equal(response.status, 403)
  assert.equal(signedUrls.length, 0)
  resumeError = null
})

test('CV signed URL uses the stored path and disables response caching', async () => {
  const response = await GET(signedUrlRequest())
  assert.equal(response.status, 307)
  assert.equal(response.headers.get('location'), 'https://storage.test/cv')
  assert.equal(response.headers.get('cache-control'), 'private, no-store')
  assert.deepEqual(signedUrls.at(-1), { filePath: path, expiresIn: 60 })
})

test('CV signed URL accepts the immutable reservation path format', async () => {
  storedResume = { ...storedResume, cvFile: { path: reservedPath } }
  const response = await GET(signedUrlRequest(reservedPath))
  assert.equal(response.status, 307)
  assert.deepEqual(signedUrls.at(-1), { filePath: reservedPath, expiresIn: 60 })
  storedResume = { id: 'resume', userId: owner, cvVersion: 4, cvFile: { path } }
})

test('CV upload reserves an immutable path and finalizes metadata after Storage upload', async () => {
  const initialCalls = deletedRequests.length
  const response = await uploadCv(uploadRequest())
  assert.equal(response.status, 200)
  assert.deepEqual(uploads.at(-1), {
    filePath: reservedPath,
    file: uploads.at(-1).file,
    options: { contentType: 'application/pdf', upsert: false },
  })
  assert.equal(deletedRequests[initialCalls].url.endsWith('/cv-upload-reservations'), true)
  assert.equal(
    deletedRequests[initialCalls + 1].url.endsWith(`/cv-upload-reservations/${reservationId}/finalize`),
    true
  )
  assert.match(JSON.parse(deletedRequests[initialCalls + 1].init.body).url, /^https:\/\/biovity\.cl\/api\/cv\/signed-url\?/)
})

test('CV upload rejects a file without PDF bytes before it reserves Storage', async () => {
  const initialCalls = deletedRequests.length
  const file = new File(['not a PDF'], 'resume.pdf', { type: 'application/pdf' })
  const response = await uploadCv(uploadRequest(file))
  assert.equal(response.status, 400)
  assert.equal(deletedRequests.length, initialCalls)
})
