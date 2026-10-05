require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
let options
let cached
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === '@tanstack/react-query') return {
    useQuery: (config) => { options = config; return { data: cached, error: null, isFetchedAfterMount: true } },
    useQueryClient: () => ({ getQueryData: () => cached }),
  }
  return load.call(this, name, parent, ...args)
}
const { useEvaluations, useEvaluationBatch } = require('../hooks/use-evaluations.ts')
const row = {
  id: 'evaluation', application_id: 'application', evaluator_id: 'evaluator', rating: 'positive',
  notes: null, skills_assessment: {}, created_at: '2026-01-01', updated_at: '2026-01-01',
}

test('failed refresh retains prior rows and reports error across repeat failures', async () => {
  cached = undefined
  global.fetch = async () => Response.json([row])
  useEvaluations('application')
  assert.equal(options.refetchOnMount, 'always')
  cached = await options.queryFn()
  assert.equal(cached.kind, 'ready')
  global.fetch = async () => Response.json({ error: 'No access' }, { status: 403 })
  cached = await options.queryFn()
  const result = useEvaluations('application')
  assert.deepEqual(result.data, [row])
  assert.equal(result.error.message, 'No access')
  assert.equal(result.isError, true)
  assert.equal(result.isFetchedAfterMount, true)
  cached = await options.queryFn()
  assert.deepEqual(cached.evaluations, [row])
})

test('failed first load has no rows and a failed batch preserves the complete prior list', async () => {
  cached = undefined
  global.fetch = async () => Response.json({ error: 'Failed' }, { status: 503 })
  useEvaluations('application')
  cached = await options.queryFn()
  assert.equal(useEvaluations('application').data, undefined)
  assert.equal(useEvaluations('application').isError, true)
  cached = { kind: 'ready', evaluations: [row] }
  let calls = 0
  global.fetch = async () => ++calls === 1
    ? Response.json([{ ...row, id: 'partial' }])
    : Response.json({ error: 'Batch failed' }, { status: 503 })
  useEvaluationBatch(Array.from({ length: 101 }, (_, index) => String(index)))
  cached = await options.queryFn()
  assert.equal(calls, 2)
  assert.equal(cached.kind, 'failed')
  assert.deepEqual(useEvaluationBatch(['application']).data, [row])
})
