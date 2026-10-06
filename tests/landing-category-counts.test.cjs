require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const load = Module._load
Module._load = function (name, ...args) {
  if (name === '@hugeicons/core-free-icons') return {}
  return load.call(this, name, ...args)
}
const { CATEGORIES_HOME } = require('../lib/data/home-data.ts')
const { CATEGORIAS_TRABAJOS } = require('../lib/data/trabajos-filtros-data.ts')
const { GET } = require('../app/api/landing/home/categories/route.ts')
Module._load = load

test('landing counts and links use the job category filter ids', async (t) => {
  const totals = {
    biotecnologia: 7,
    bioquimica: 3,
    quimica: 2,
    'ingenieria-quimica': 4,
    salud: 5,
    farmacia: 6,
  }
  const originalFetch = global.fetch
  t.after(() => { global.fetch = originalFetch })
  global.fetch = async (input) => {
    const url = new URL(input)
    assert.equal(url.pathname, '/api/v1/jobs')
    assert.equal(url.searchParams.get('status'), 'active')
    assert.equal(url.searchParams.get('limit'), '1')
    return Response.json({ data: [], total: totals[url.searchParams.get('category')] ?? 0 })
  }
  const response = await GET()
  assert.deepEqual((await response.json()).counts, totals)
  for (const category of CATEGORIES_HOME) {
    assert.ok(CATEGORIAS_TRABAJOS.some((filter) => filter.id === category.id))
  }
})
