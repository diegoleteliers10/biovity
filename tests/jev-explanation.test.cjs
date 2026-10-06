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
const audits = []
let auditFailure = false
let saveMode = "ready"
const explanation = { reason: 'El perfil acredita PCR, pero no secuenciación.', strengths: [{text:'Experiencia pertinente',evidenceId:'candidate.0'}], gaps: [{text:'No documenta secuenciación',evidenceId:'job.0'}], recommendation: 'Evaluar' }
process.env.ZAI_API_KEY = 'fixture-only'
global.fetch = async (url, options) => {
  if (options.signal?.aborted) return Promise.reject(new DOMException("Fixture aborted", "AbortError"))
  const body = JSON.parse(options.body)
  requests.push({ url, body })
  if (mode === 'balance') return Response.json({ error: { message: 'Insufficient balance or no resource package. Please recharge.' } }, {status:429})
  const object = mode === 'unsupported' ? { ...explanation, strengths: [{text:'Experiencia',evidenceId:'candidate.unknown'}] } : mode === 'wrong-role' ? { ...explanation, gaps: [{text:'Brecha',evidenceId:'candidate.0'}] } : mode === 'format' ? { ...explanation, reason: 'x'.repeat(1201) } : explanation
  return Response.json({ id:'fixture',object:'chat.completion',created:1,model:'glm-5.3-flash',choices:[{index:0,message:{role:'assistant',content:JSON.stringify(object)},finish_reason:'stop'}],usage:{prompt_tokens:10,completion_tokens:10,total_tokens:20} })
}
const load = Module._load
Module._load = function(name, parent, ...args) {
  if (name === '@/lib/ai/audit' || name.endsWith('/audit') || name === '../audit') return {AIAuditService:{hashInput:()=> 'fixture-hash'}, aiAuditService:{log:async(record)=>{audits.push(record);if(auditFailure) throw new Error('fixture write failed');return 'audit-id'}}}
  if (name === '@/lib/ai/provider') {const actual=load.call(this,name,parent,...args);return {...actual,resolveModel:(...values)=>mode === 'resolve' ? Promise.reject(new Error('fixture model resolution failed')) : actual.resolveModel(...values)}}
  if (name === 'next/headers') return { headers: async () => new Headers() }
  if (name === '@/lib/auth') return {auth:{api:{getSession:async()=>({user:{id:'recruiter'}})}}}
  if (name === '@/lib/api/jobs') return {getManagedJob:async()=>Result.ok({organizationId:'organization'})}
  if (name === '@/lib/api/ai-credentials') return {getActiveCredentialDecrypted:async()=>Result.err(new Error('No BYOK'))}
  if (name === '@/lib/db/application-ai-score') return {
    getStoredCandidateExplanation:async()=>Result.ok(stored),
    getCandidateAssessmentForExplanation:async()=>Result.ok(assessment),
    claimCandidateExplanation:async()=>Result.ok('lease'),
    failCandidateExplanation:async(...args)=>{failures.push(args);return Result.ok(true)},
    finishCandidateExplanation:async(...args)=>{saved.push(args);return saveMode === 'error' ? Result.err(new Error('fixture save failed')) : Result.ok(saveMode !== 'lease')},
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
  assert.equal(audits.at(-1).metadata.status, 'ready')
  assert.equal(audits.at(-1).metadata.inputTokens, 10)
  assert.equal(audits.at(-1).metadata.outputTokens, 10)
  assert.equal(audits.at(-1).metadata.modelId, 'glm-5.3-flash')
  assert.equal(audits.at(-1).userId, 'recruiter')
  assert.equal('model' in audits.at(-1).metadata, false)
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
  const auditCount=audits.length
  const body=await (await POST(request())).json()
  assert.match(body.error,/saldo/)
  assert.equal(requests.length,count)
  assert.equal(audits.length,auditCount)
})
test('invented evidence is rejected even with valid JSON',async()=>{
  stored={status:'pending',explanation:null,errorCode:null};mode='unsupported'
  const body=await (await POST(request())).json()
  assert.equal(body.status,'failed')
  assert.equal(failures.at(-1)[2],'unsupported_evidence')
  assert.equal(saved.length,1)
})

test('resolved evidence preserves exact source text',async()=>{
  mode='ready'
  const body=await (await POST(request(true))).json()
  assert.equal(body.status,'ready')
  assert.equal(body.explanation.strengths[0].evidence,'Experiencia en PCR')
  assert.equal(body.explanation.gaps[0].evidence,'Experiencia en PCR y secuenciación')
  assert.equal('evidenceId' in body.explanation.strengths[0],false)
})

test('schema failures have a distinct error code',async()=>{
  mode='format'
  const count=saved.length
  const body=await (await POST(request(true))).json()
  assert.equal(body.status,'failed')
  assert.equal(failures.at(-1)[2],'invalid_explanation_format')
  assert.equal(saved.length,count)
})
test('gaps cannot cite candidate evidence',async()=>{
  mode='wrong-role'
  const count=saved.length
  const body=await (await POST(request(true))).json()
  assert.equal(body.status,'failed')
  assert.equal(failures.at(-1)[2],'unsupported_evidence')
  assert.equal(saved.length,count)
})
test('long nested sources produce deterministic exact bounded excerpts',()=>{
  const {buildEvidenceCatalog,resolveExplanationEvidence}=require('../lib/ai/decision/explanation-evidence.ts')
  const source='PCR y secuenciación. '.repeat(100)+'z'.repeat(500)
  const catalog=buildEvidenceCatalog({}, {experience:[{description:source}]})
  assert.deepEqual([...catalog], [...buildEvidenceCatalog({}, {experience:[{description:source}]})])
  for(const [id,excerpt] of catalog){assert.match(id,/^candidate\./);assert.ok(excerpt.length<=240);assert.ok(source.includes(excerpt))}
  assert.equal(resolveExplanationEvidence({...explanation,strengths:[{text:'Experiencia',evidenceId:'job.0'}],gaps:[]},catalog),null)
  assert.equal(buildEvidenceCatalog({},{}).size,0)
})

test('a valid explanation longer than 400 characters remains usable',()=>{
  const {GeneratedExplanationSchema}=require('../lib/ai/decision/explanation-evidence.ts')
  assert.equal(GeneratedExplanationSchema.safeParse({...explanation,reason:'x'.repeat(650)}).success,true)
})

test('audit failures do not change a completed explanation',async()=>{
  mode='ready'; auditFailure=true
  const body=await (await POST(request(true))).json()
  auditFailure=false
  assert.equal(body.status,'ready')
})
test('persistence and stale lease failures have distinct audit causes',async()=>{
  mode='ready'
  for (const [value,code] of [['error','explanation_persistence_failed'],['lease','explanation_lease_lost']]) {
    saveMode=value
    const count=audits.length
    const response=await POST(request(true))
    assert.equal(response.status,500)
    assert.equal(audits.length,count+1)
    assert.equal(audits.at(-1).metadata.status,'failed')
    assert.equal(audits.at(-1).metadata.errorCode,code)
    assert.equal(audits.at(-1).metadata.inputTokens,10)
  }
  saveMode='ready'
})

test('model resolution failures release the lease and audit once',async()=>{
  mode='resolve'
  const count=audits.length
  const body=await (await POST(request(true))).json()
  assert.equal(body.status,'failed')
  assert.equal(failures.at(-1)[2],'explanation_failed')
  assert.equal(audits.length,count+1)
  assert.equal(audits.at(-1).metadata.status,'failed')
  assert.equal('provider' in audits.at(-1).metadata,false)
  mode='ready'
})
test('request cancellation records an aborted generation without invented usage',async()=>{
  mode='ready'
  const controller=new AbortController()
  controller.abort()
  const aborted=new Request('http://localhost/api/ai/score-explain',{method:'POST',body:JSON.stringify({jobId,revisionId,retry:true}),signal:controller.signal})
  const count=audits.length
  const body=await (await POST(aborted)).json()
  assert.equal(body.status,'failed')
  assert.equal(audits.length,count+1)
  assert.equal(audits.at(-1).metadata.status,'aborted')
  assert.equal('inputTokens' in audits.at(-1).metadata,false)
})
