require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const { Result } = require('better-result')

const requests = []
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === '@/lib/result') {
    return {
      fetchJson: async (url, options) => {
        requests.push({ url, options })
        const search = {
            id: 'search-id',
            organizationId: 'organization-id',
            name: 'Lab roles',
            filters: { profession: 'biologist' },
            notifyEnabled: options?.body ? JSON.parse(options.body).notifyEnabled ?? false : false,
          }
        return Result.ok(options?.method ? { data: search } : [search])
      },
      fetchNoContent: async () => Result.ok(undefined),
      getResultErrorMessage: (error) => error.message,
    }
  }
  return load.call(this, name, parent, ...args)
}

const { createSavedSearch, getSavedSearches, updateSavedSearch } = require('../lib/api/use-saved-searches.ts')

test('loads saved searches from the organization route', async () => {
  const result = await getSavedSearches('organization-id')

  assert.equal(requests[0].url, 'http://localhost:3001/api/v1/saved-searches/organization/organization-id')
  assert.equal(result.isOk(), true)
  assert.equal(result.value[0].id, 'search-id')
})

test('saves alert consent and lets the organization pause alerts', async () => {
  const created = await createSavedSearch({
    organizationId: 'organization-id',
    name: 'Lab roles',
    filters: { profession: 'biologist' },
    notifyEnabled: true,
  })
  const updated = await updateSavedSearch('search-id', { notifyEnabled: false })

  assert.equal(requests[1].options.method, 'POST')
  assert.equal(JSON.parse(requests[1].options.body).notifyEnabled, true)
  assert.equal(created.value.notifyEnabled, true)
  assert.equal(requests[2].options.method, 'PUT')
  assert.equal(JSON.parse(requests[2].options.body).notifyEnabled, false)
  assert.equal(updated.value.notifyEnabled, false)
})
