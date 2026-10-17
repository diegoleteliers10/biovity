const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

require('./register-ts.cjs')

const { isPendingToolApproval } = require('../lib/ai/tool-approval.ts')
const { guardApprovedTools } = require('../lib/ai/tool-approval-guard.ts')
const { deriveToolApprovalSecret } = require('../lib/ai/tool-approval-store.ts')
const { Result } = require('better-result')
const { externalTools } = require('../lib/ai/tools/external.ts')
const { organizationTools } = require('../lib/ai/tools/organization.ts')

const MUTATING_TOOLS = [
  'closeJob',
  'createEvent',
  'createJob',
  'sendDirectMessage',
  'sendMessageToCandidate',
  'updateApplicationStatus',
  'updateCandidateStatus',
  'updateEvent',
  'updateJob',
]

const READ_ONLY_TOOLS = [
  'getApplicationDetail',
  'getApplicationDossier',
  'getCandidates',
  'getCandidateDetail',
  'getChatMessages',
  'getChatsByRecruiter',
  'getEventsByOrganization',
  'getJobApplicationsWithAnswers',
  'getJobOffer',
  'getJobOffers',
  'getJobViews',
  'getOrganizationStats',
  'getPipelineStages',
  'getSubscription',
  'listApplications',
  'searchCandidatesBySkills',
  'searchProfessionals',
]

const allTools = { ...organizationTools, ...externalTools }

test('all recruiter AI tools are classified and mutations require approval', () => {
  const registeredNames = Object.keys(allTools).sort()
  const classifiedNames = [...MUTATING_TOOLS, ...READ_ONLY_TOOLS].sort()

  assert.equal(new Set(classifiedNames).size, classifiedNames.length)
  assert.deepEqual(classifiedNames, registeredNames)

  for (const name of MUTATING_TOOLS) {
    assert.equal(allTools[name]?.needsApproval, true, name)
    assert.equal(typeof allTools[name]?.execute, 'function', name)
  }
})

test('every approved recruiter mutation passes through the replay guard', async () => {
  const consumedToolNames = []
  const executedToolNames = []
  const mutationTools = Object.fromEntries(
    MUTATING_TOOLS.map((name) => [
      name,
      {
        ...allTools[name],
        execute: async () => {
          executedToolNames.push(name)
          return name
        },
      },
    ])
  )
  const guarded = guardApprovedTools(
    mutationTools,
    'user-1',
    'org-1',
    async (_actorId, _organizationId, _toolCallId, toolName) => {
      consumedToolNames.push(toolName)
      return Result.ok(false)
    }
  )

  const results = await Promise.all(
    MUTATING_TOOLS.map((name) =>
      guarded[name].execute({}, { toolCallId: `call-${name}` })
    )
  )

  assert.deepEqual(consumedToolNames.sort(), [...MUTATING_TOOLS].sort())
  assert.deepEqual(executedToolNames, [])
  assert.deepEqual(results, MUTATING_TOOLS.map(() => ({ error: 'Esta aprobación ya se usó.' })))
})

test('approval UI depends on SDK approval state, not the tool name', () => {
  assert.equal(isPendingToolApproval({ id: 'approval-1' }, 'approval-requested'), true)
  assert.equal(isPendingToolApproval({ id: 'approval-1' }, 'output-available'), false)
  assert.equal(isPendingToolApproval(null, 'approval-requested'), false)
})

test('consumes approved tool calls at execution and blocks replay', async () => {
  const consumedCallIds = new Set()
  let executions = 0
  const guarded = guardApprovedTools(
    {
      sendDirectMessage: {
        needsApproval: true,
        execute: async (input) => {
          executions += 1
          return input
        },
      },
    },
    'user-1',
    'org-1',
    async (_actorId, _organizationId, toolCallId) => {
      if (consumedCallIds.has(toolCallId)) return Result.ok(false)
      consumedCallIds.add(toolCallId)
      return Result.ok(true)
    }
  )
  const options = { toolCallId: 'call-1' }

  assert.deepEqual(await guarded.sendDirectMessage.execute({ content: 'Hola' }, options), {
    content: 'Hola',
  })
  assert.deepEqual(await guarded.sendDirectMessage.execute({ content: 'Hola' }, options), {
    error: 'Esta aprobación ya se usó.',
  })
  assert.equal(executions, 1)
})

test('derives approval signatures per actor and organization', () => {
  const secret = deriveToolApprovalSecret('master-secret', 'user-1', 'org-1')

  assert.equal(secret, deriveToolApprovalSecret('master-secret', 'user-1', 'org-1'))
  assert.notEqual(secret, deriveToolApprovalSecret('master-secret', 'user-2', 'org-1'))
  assert.notEqual(secret, deriveToolApprovalSecret('master-secret', 'user-1', 'org-2'))
})

test('agent route signs approved tool calls with the server auth secret', () => {
  const source = fs.readFileSync(path.join(__dirname, '../app/api/ai/agent/route.ts'), 'utf8')
  assert.match(source, /experimental_toolApprovalSecret:\s*approvalSecret/)
  assert.match(source, /const masterApprovalSecret = process\.env\.BETTER_AUTH_SECRET/)
  assert.match(source, /const allTools = \{\s*\.\.\.organizationTools,\s*\.\.\.externalTools,\s*\}/)
  assert.match(source, /guardApprovedTools\(/)
  assert.match(source, /guardApprovedTools\(\s*allTools,/)
  assert.match(source, /if \(!masterApprovalSecret\)/)
})
