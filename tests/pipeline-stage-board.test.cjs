require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')

const { groupApplicantsByPipelineStage } = require('../lib/pipeline-stage-board.ts')

const stages = [
  {
    id: 'active-review',
    statusProjection: 'entrevista',
    isArchived: false,
  },
  {
    id: 'archived-review',
    statusProjection: 'entrevista',
    isArchived: true,
  },
]

test('groups applications by pipeline stage and keeps archived-stage applications visible', () => {
  const applicants = [
    { id: 'one', stage: 'entrevista', pipelineStageId: 'active-review' },
    { id: 'two', stage: 'entrevista', pipelineStageId: 'archived-review' },
    { id: 'three', stage: 'entrevista' },
  ]

  const grouped = groupApplicantsByPipelineStage(applicants, stages)

  assert.deepEqual(grouped.get('active-review')?.map((applicant) => applicant.id), ['one', 'three'])
  assert.deepEqual(grouped.get('archived-review')?.map((applicant) => applicant.id), ['two'])
})

test('keeps withdrawn applications visible in the default board', () => {
  const defaults = [
    {
      id: 'desistido',
      name: 'Desistido',
      statusProjection: 'desistido',
      isArchived: false,
    },
  ]

  const grouped = groupApplicantsByPipelineStage([{ id: 'withdrawn', stage: 'desistido' }], defaults)

  assert.deepEqual(grouped.get('desistido')?.map((applicant) => applicant.id), ['withdrawn'])
})
