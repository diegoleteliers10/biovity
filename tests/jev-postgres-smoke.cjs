require('./register-ts.cjs')
const { test } = require('node:test')
const assert = require('node:assert/strict')
const { randomBytes } = require('node:crypto')
process.loadEnvFile('.env')

test('Jev queue accepts a real PostgreSQL transaction and rolls it back', async (t) => {
  const { pool } = require('../lib/db/index.ts')
  const { enqueueCandidateAssessments } = require('../lib/db/application-ai-score.ts')
  t.after(() => pool.end())
  const fixture = await pool.query(`
    SELECT app.id AS "applicationId", app."candidateId" AS "candidateId", job.id AS "jobId",
      job."organizationId" AS "organizationId", owner.id AS "requestedBy"
    FROM application app JOIN job ON job.id = app."jobId"
    JOIN public."user" owner ON owner."organizationId" = job."organizationId"
    LIMIT 1
  `)
  assert.ok(fixture.rows[0], 'An application fixture is required')
  const connect = pool.connect.bind(pool)
  pool.connect = async () => {
    const client = await connect()
    const query = client.query.bind(client)
    client.query = (sql, ...args) => query(sql === 'COMMIT' ? 'ROLLBACK' : sql, ...args)
    return client
  }
  const assessment = {
    ...fixture.rows[0], fingerprint: randomBytes(32).toString('hex'),
    jobSnapshot: { title: 'Transaction probe' }, candidateSnapshot: { skills: [] },
  }
  const result = await enqueueCandidateAssessments(assessment.organizationId, [assessment])
  pool.connect = connect
  assert.equal(result.isOk(), true, result.isErr() ? `Queue failure: ${result.error.operation}` : '')
  assert.equal(result.value.queued, 1)
  const persisted = await pool.query('SELECT count(*)::integer AS count FROM application_ai_score WHERE fingerprint = $1', [assessment.fingerprint])
  assert.equal(persisted.rows[0].count, 0, 'The probe must leave no assessment or usage charge')
})
