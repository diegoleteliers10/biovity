const { test } = require('node:test')
const assert = require('node:assert/strict')
const { randomUUID } = require('node:crypto')
const { Pool } = require('pg')
const { createClient } = require('@supabase/supabase-js')
process.loadEnvFile('.env')

test('private Realtime accepts a valid grant, broadcasts immediately, and rejects unknown grants', async (t) => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 5000 })
  let client
  let grantId
  t.after(async () => {
    if (client) await client.removeAllChannels()
    if (grantId) await pool.query('DELETE FROM private.realtime_user_channel WHERE id = $1', [grantId])
    await pool.end()
  })
  const grant = await pool.query(`
    INSERT INTO private.realtime_user_channel (session_id, user_id, topic_id, expires_at)
    SELECT session.id, session.user_id, gen_random_uuid(), now() + interval '1 minute'
    FROM public.session JOIN public."user" app_user ON app_user.id = session.user_id
    WHERE session.expires_at > now() AND app_user."isActive" IS TRUE
    LIMIT 1 RETURNING id, 'biovity:user:' || topic_id::text AS topic
  `)
  assert.ok(grant.rows[0], 'An active session is required for the isolated grant probe')
  grantId = grant.rows[0].id
  client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }, realtime: { logger() {} },
  })
  const topic = grant.rows[0].topic
  const channel = client.channel(topic, { config: { private: true } })
  const nonce = randomUUID()
  const received = new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(false), 10000)
    channel.on('broadcast', { event: 'diagnostic_probe' }, (event) => {
      if (event.payload?.nonce === nonce) { clearTimeout(timeout); resolve(true) }
    })
  })
  const status = await new Promise((resolve) => {
    const timeout = setTimeout(() => resolve('TIMEOUT'), 10000)
    channel.subscribe((state) => { if (state !== 'CLOSED') { clearTimeout(timeout); resolve(state) } })
  })
  assert.equal(status, 'SUBSCRIBED', 'A valid private grant must join')
  const emittedAt = performance.now()
  await pool.query('SELECT realtime.send($1::jsonb, $2, $3, true)', [JSON.stringify({ nonce }), 'diagnostic_probe', topic])
  assert.equal(await received, true)
  console.log(`Private broadcast delivery: ${Math.round(performance.now() - emittedAt)} ms`)
  const unknown = client.channel(`biovity:user:${randomUUID()}`, { config: { private: true } })
  const denied = await new Promise((resolve) => {
    const timeout = setTimeout(() => resolve('TIMEOUT'), 10000)
    unknown.subscribe((state) => { if (state !== 'CLOSED') { clearTimeout(timeout); resolve(state) } })
  })
  assert.equal(denied, 'CHANNEL_ERROR', 'An unknown private grant must be denied')
})
