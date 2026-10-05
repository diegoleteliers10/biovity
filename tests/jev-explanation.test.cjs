require('./register-ts.cjs')
const { test } = require('node:test')
const assert = require('node:assert/strict')
const Module = require('node:module')
const { Result } = require('better-result')
const jobId = '00000000-0000-4000-8000-000000000001'
const revisionId = '00000000-0000-4000-8000-000000000002'
const assessment = { score: 53, confidence: .8, sufficiency: .9, distribution: {}, perQuestion: {}, jobSnapshot: { description: 'Experiencia en PCR y secuenciación' }, candidateSnapshot: { summary: 'Experiencia en PCR' } }
let stored = { status: 'pending', explanation: null, errorCode: null }
let mode = 'ready'
const failures = []
const saved = []
const requests = []
const explanation = { reason: 'El perfil acredita PCR, pero no secuenciación.', strengths: [{text:'Experiencia pertinente',evidence:'Experiencia en PCR'}], gaps: [{text:'No documenta secuenciación',evidence:'PCR y secuenciación'}], recommendation: 'Evaluar' }
process.env.ZAI_API_KEY = 'fixture-only'
global.fetch = async (url, options) => {
  const body = JSON.parse(options.body)
  requests.push({ url, body })
  if (mode === 'balance') return Response.json({ error: { message: 'Insufficient balance or no resource package. Please recharge.' } }, {status:429})
  const object = mode === 'unsupported' ? { ...explanation, strengths: [{text:'Experiencia',evidence:'Diez años de experiencia'}] } : explanation
  return Response.json({ id:'fixture',object:'chat.completion',created:1,model:'glm-5.3-flash',choices:[{index:0,message:{role:'assistant',content:JSON.stringify(object)},finish_reason:'stop'}],usage:{prompt_tokens:10,completion_tokens:10,total_tokens:20} })
}
const load = Module._load
Module._load = function(name, parent, ...args) {
  if (name === 'next/headers') return { headers: async () => new Headers() }
  if (name === '@/lib/auth') return {auth:{api:{getSession:async()=>({user:{id:'recruiter'}})}}}
  if (name === '@/lib/api/jobs') return {getManagedJob:async()=>Result.ok({organizationId:'organization'})}
  if (name === '@/lib/api/ai-credentials') return {getActiveCredentialDecrypted:async()=>Result.err(new Error('No BYOK'))}
  if (name === '@/lib/db/application-ai-score') return {
    getStoredCandidateExplanation:async()=>Result.ok(stored),
    getCandidateAssessmentForExplanation:async()=>Result.ok(assessment),
    claimCandidateExplanation:async()=>Result.ok('lease'),
    failCandidateExplanation:async(...args)=>{failures.push(args);return Result.ok(true)},
    finishCandidateExplanation:async(...args)=>{saved.push(args);return Result.ok(true)},
  }
  return load.call(this,name,parent,...args)
}
const { POST } = require('../app/api/ai/score-explain/route.ts')
Module._load = load
function request(retry=false) {return new Request('http://localhost/api/ai/score-explain',{method:'POST',body:JSON.stringify({jobId,revisionId,retry})})}
test('explanation uses GLM 5.3 Flash, Coding Plan and JSON-object mode',async()=>{
  const response=await POST(request()); const body=await response.json()
  assert.equal(body.status,'ready')
  assert.match(requests.at(-1).url,/api\/coding\/paas\/v4\/chat\/completions$/)
  assert.equal(requests.at(-1).body.model,'glm-5.3-flash')
  assert.equal(requests.at(-1).body.response_format.type,'json_object')
  assert.equal(requests.at(-1).body.reasoning_effort,'low')
  assert.equal(saved.at(-1)[3],'glm-5.3-flash')
  assert.equal(assessment.score,53)
})
test('Z.ai balance failures persist a specific cause and keep the Jev score',async()=>{
  mode='balance'
  const body=await (await POST(request(true))).json()
  assert.equal(body.status,'failed')
  assert.match(body.error,/saldo/)
  assert.equal(failures.at(-1)[2],'provider_balance')
  assert.equal(assessment.score,53)
})
test('a stored balance failure keeps its clear error on reload',async()=>{
  stored={status:'failed',explanation:null,errorCode:'provider_balance'}
  const count=requests.length
  const body=await (await POST(request())).json()
  assert.match(body.error,/saldo/)
  assert.equal(requests.length,count)
})
test('invented evidence is rejected even with valid JSON',async()=>{
  stored={status:'pending',explanation:null,errorCode:null};mode='unsupported'
  const body=await (await POST(request())).json()
  assert.equal(body.status,'failed')
  assert.equal(failures.at(-1)[2],'unsupported_evidence')
  assert.equal(saved.length,1)
})
