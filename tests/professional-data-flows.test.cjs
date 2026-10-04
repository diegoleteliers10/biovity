require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const { QueryClient } = require('@tanstack/react-query')
const actualQuery = require('@tanstack/react-query')
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === '@tanstack/react-query') return {
    ...actualQuery,
    useMutation: (options) => options,
    useQueryClient: () => queryClient,
  }
  return load.call(this, name, parent, ...args)
}
const resumes = require('../lib/api/resumes.ts')
const users = require('../lib/api/users.ts')
const profile = require('../lib/api/use-profile.ts')
const alerts = require('../lib/api/use-job-alerts.ts')
const saved = require('../lib/api/use-saved-jobs.ts')

test('resume updates unwrap the response and retain the storage path', async (t) => {
  const fetch = global.fetch
  t.after(() => { global.fetch = fetch })
  global.fetch = async () => Response.json({ data: { id: 'resume', userId: 'owner', cvFile: { url: '/api/cv/signed-url?path=cv/file_owner.pdf' } } })
  const result = await resumes.updateResume('resume', { summary: 'New' })
  assert.equal(result.isOk(), true)
  assert.equal(result.value.id, 'resume')
  assert.equal(result.value.cvFile.path, 'cv/file_owner.pdf')
})

test('server profile and CV changes forward the session cookie', async (t) => {
  const fetch = global.fetch
  t.after(() => { global.fetch = fetch })
  const requests = []
  global.fetch = async (_url, init) => {
    requests.push(init)
    return Response.json({ data: { id: 'owner', name: 'Owner', userId: 'owner' } })
  }
  const headers = new Headers({ cookie: 'better-auth.session_token=fixture' })
  await users.updateUser('owner', { avatar: '' }, headers)
  await resumes.updateResume('resume', { cvFile: null }, headers)
  assert.equal(requests[0].headers.get('cookie'), 'better-auth.session_token=fixture')
  assert.equal(requests[1].headers.get('cookie'), 'better-auth.session_token=fixture')
  assert.equal(JSON.parse(requests[1].body).cvFile, null)
})

test('profile mutations put the response into the visible cache', async () => {
  queryClient.clear()
  const user = { id: 'owner', name: 'New name' }
  await profile.useUpdateUserMutation('owner').onSuccess(user)
  assert.deepEqual(queryClient.getQueryData(profile.profileKeys.user('owner')), user)
  const resume = { id: 'resume', userId: 'owner', cvFile: null }
  await profile.useUpdateResumeMutation('resume', 'owner').onSuccess(resume)
  assert.deepEqual(queryClient.getQueryData(profile.profileKeys.resume('owner')), resume)
})

test('saved state and alerts change before a refetch', async () => {
  queryClient.clear()
  await saved.useSaveJobMutation().onSuccess({}, { userId: 'owner', jobId: 'job' })
  assert.deepEqual(queryClient.getQueryData(saved.savedJobsKeys.check('owner', 'job')), { isSaved: true })
  await saved.useRemoveSavedJobMutation().onSuccess({}, { userId: 'owner', jobId: 'job' })
  assert.deepEqual(queryClient.getQueryData(saved.savedJobsKeys.check('owner', 'job')), { isSaved: false })
  const alert = { id: 'alert', userId: 'owner' }
  await alerts.useCreateJobAlert().onSuccess(alert, { userId: 'owner' })
  assert.deepEqual(queryClient.getQueryData(alerts.jobAlertsKeys.byUser('owner')), [alert])
  await alerts.useDeleteJobAlert().onSuccess(undefined, { id: 'alert', userId: 'owner' })
  assert.deepEqual(queryClient.getQueryData(alerts.jobAlertsKeys.byUser('owner')), [])
})

test('saved removal updates finite and infinite lists and their counts', async () => {
  queryClient.clear()
  const page = { data: [{ id: 'saved', userId: 'owner', jobId: 'job' }], total: 1, page: 1, limit: 10, totalPages: 1 }
  const finiteKey = [...saved.savedJobsKeys.byUser('owner'), 1, 10]
  const infiniteKey = [...saved.savedJobsKeys.byUser('owner'), 'infinite', 10]
  queryClient.setQueryData(finiteKey, page)
  queryClient.setQueryData(infiniteKey, { pages: [page], pageParams: [1] })
  await saved.useRemoveSavedJobMutation().onSuccess({}, { userId: 'owner', jobId: 'job' })
  assert.deepEqual(queryClient.getQueryData(finiteKey).data, [])
  assert.equal(queryClient.getQueryData(finiteKey).total, 0)
  assert.deepEqual(queryClient.getQueryData(infiniteKey).pages[0].data, [])
  assert.equal(queryClient.getQueryData(infiniteKey).pages[0].total, 0)
})
