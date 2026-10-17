require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { after, test } = require('node:test')

const originalFetch = global.fetch
const calls = []
global.fetch = async (url, init) => {
  calls.push({ url: String(url), init })
  return {
    ok: true,
    json: async () => ({ data: { id: 'stage-id' } }),
  }
}

const { createPipelineStage } = require('../lib/api/use-pipeline-stages.ts')

after(() => {
  global.fetch = originalFetch
})

test('new custom stage sends its public status projection', async () => {
  calls.length = 0
  const result = await createPipelineStage('job-id', {
    name: 'Oferta aceptada',
    color: '#22c55e',
    order: 8,
    statusProjection: 'contratado',
  })

  assert.equal(result.isOk(), true)
  assert.match(calls[0].url, /\/pipeline-stages$/)
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    jobId: 'job-id',
    name: 'Oferta aceptada',
    color: '#22c55e',
    order: 8,
    statusProjection: 'contratado',
  })
})
