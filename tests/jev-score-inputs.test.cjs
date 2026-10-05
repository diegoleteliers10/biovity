require('./register-ts.cjs')
const { test } = require('node:test')
const assert = require('node:assert/strict')
const Module = require('node:module')
const { Result } = require('better-result')
const { CandidateCvError } = require('../lib/ai/decision/cv.ts')
const jobId = '00000000-0000-4000-8000-000000000001'
const candidateId = '00000000-0000-4000-8000-000000000002'
const applicationId = '00000000-0000-4000-8000-000000000003'
const resumeFixture = { userId: candidateId, summary: 'Experiencia en laboratorio', skills: [], experiences: [], education: [], certifications: [], languages: [], cvFile: { path: `cv/resume_${candidateId}.pdf` } }
let resume = resumeFixture
let cvResult = Result.ok('Experiencia documentada en PCR y control de calidad por cuatro años.')
let applications = [{ id: applicationId, candidateId }]
const alternateResumes = new Map()
const alternateCvs = new Map()
const loaded = []
const queued = []
const load = Module._load
Module._load = function(name, parent, ...args) {
  if (name === 'next/headers') return { headers: async () => new Headers() }
  if (name === 'next/server') return { after: () => {} }
  if (name === '@/lib/auth') return { auth: { api: { getSession: async () => ({ user: { id: 'recruiter' } }) } } }
  if (name === '@/lib/api/jobs') return { getManagedJob: async () => Result.ok({ id: jobId, organizationId: 'organization', title: 'Analista PCR', description: 'Control de calidad por PCR', requiredSkills: ['PCR'] }) }
  if (name === '@/lib/api/applications') return { getApplicationsByJob: async () => Result.ok(applications) }
  if (name === '@/lib/api/resumes') return { getResumeByUserId: async (id) => Result.ok(alternateResumes.get(id) ?? resume) }
  if (name === '@/lib/ai/decision/cv') return { CandidateCvError, loadCandidateCvText: async (value) => { loaded.push(value); return alternateCvs.get(value?.userId) ?? cvResult } }
  if (name === '@/lib/ai/decision/worker') return { processJevQueue: async () => {} }
  if (name === '@/lib/db/application-ai-score') return { enqueueCandidateAssessments: async (_org, assessments) => { queued.push(...assessments); return Result.ok({ accepted: true, queued: assessments.length }) } }
  return load.call(this, name, parent, ...args)
}
const { POST } = require('../app/api/ai/score-candidates/route.ts')
Module._load = load
process.env.TYPESAFE_API_KEY = 'test-fixture'
function request() {
  return new Request('http://localhost/api/ai/score-candidates', { method: 'POST', body: JSON.stringify({ jobId }) })
}
test('score request queues the candidate summary and PDF text together', async () => {
  const response = await POST(request())
  assert.equal(response.status, 202)
  assert.equal(loaded.at(-1), resumeFixture)
  assert.equal(queued.at(-1).candidateSnapshot.summary, resumeFixture.summary)
  assert.equal(queued.at(-1).candidateSnapshot.cvText, cvResult.value)
})
test('unreadable CV does not queue an empty candidate as insufficient', async () => {
  cvResult = Result.err(new Error('PDF has no selectable text'))
  const count = queued.length
  const response = await POST(request())
  assert.equal(response.status, 502)
  assert.equal(queued.length, count)
})
test('resume from another owner never reaches CV extraction', async () => {
  resume = { ...resumeFixture, userId: 'another-owner' }
  const count = loaded.length
  const response = await POST(request())
  assert.equal(response.status, 502)
  assert.equal(loaded.length, count)
})

test('scanned CV keeps the structured profile and returns a visible warning', async () => {
  resume = resumeFixture
  cvResult = Result.err(new CandidateCvError({ reason: 'no_text', message: 'No selectable text' }))
  const response = await POST(request())
  assert.equal(response.status, 202)
  const body = await response.json()
  assert.match(body.warning, /texto seleccionable/)
  assert.equal(queued.at(-1).candidateSnapshot.summary, resumeFixture.summary)
  assert.equal(queued.at(-1).candidateSnapshot.cvText, '')
})
test('one failed CV does not block other candidates', async () => {
  resume = resumeFixture
  cvResult = Result.err(new CandidateCvError({ reason: 'download', message: 'Storage unavailable' }))
  const secondId = '00000000-0000-4000-8000-000000000004'
  alternateResumes.set(secondId, { ...resumeFixture, userId: secondId })
  alternateCvs.set(secondId, Result.ok('Experiencia en PCR'))
  applications = [...applications, { id: '00000000-0000-4000-8000-000000000005', candidateId: secondId }]
  const response = await POST(request())
  assert.equal(response.status, 202)
  const body = await response.json()
  assert.equal(body.queued, 1)
  assert.match(body.warning, /No se pudo cargar el CV/)
  assert.doesNotMatch(body.warning, /texto seleccionable/)
  assert.equal(queued.at(-1).candidateId, secondId)
})
