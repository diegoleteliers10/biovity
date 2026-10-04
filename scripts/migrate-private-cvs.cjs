const { createClient } = require('@supabase/supabase-js')
const { Pool } = require('pg')
const { createHash } = require('node:crypto')
process.loadEnvFile('.env')

const mode = process.argv[2] ?? '--dry-run'
const source = process.env.SUPABASE_STORAGE_BUCKET ?? 'biovity_bucket'
const destination = process.env.SUPABASE_CV_BUCKET ?? 'biovity_cv'
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 5000 })

const fail = operation => { console.error(JSON.stringify({ failed: operation })); return false }
const hash = async blob => createHash('sha256').update(Buffer.from(await blob.arrayBuffer())).digest('hex')
function cvPath(url) {
  if (!url) return null
  const parsed = new URL(url, 'https://local.invalid')
  const query = parsed.searchParams.get('path')
  if (query?.startsWith('cv/')) return query
  const match = parsed.pathname.match(/\/object\/(?:public|sign)\/[^/]+\/(cv\/.*)$/)
  return match ? decodeURIComponent(match[1]) : null
}

async function migrate() {
  if (!['--dry-run', '--copy', '--finalize'].includes(mode) || source === destination) return fail('invalid_mode_or_bucket')
  if (mode === '--finalize' && !process.argv.includes('--readers-deployed')) return fail('deploy_private_cv_readers_before_finalize')
  const objects = await pool.query("SELECT name FROM storage.objects WHERE bucket_id = $1 AND name LIKE 'cv/%' ORDER BY name", [source])
  console.log(JSON.stringify({ mode, cvFiles: objects.rowCount }))
  if (mode === '--dry-run') return true
  const bucket = await client.storage.getBucket(destination)
  if (!bucket.data) {
    const created = await client.storage.createBucket(destination, { public: false, allowedMimeTypes: ['application/pdf'], fileSizeLimit: '20MB' })
    if (created.error) return fail('create_private_bucket')
  } else if (bucket.data.public) return fail('destination_bucket_is_public')
  const metadata = await pool.query('SELECT id, "cvFile" FROM public.resume WHERE "cvFile" IS NOT NULL')
  const applications = await pool.query('SELECT id, resume_url FROM public.application WHERE resume_url IS NOT NULL')
  let verified = 0
  for (const { name } of objects.rows) {
    const original = await client.storage.from(source).download(name)
    if (original.error || !original.data) return fail('read_original')
    const existing = await client.storage.from(destination).info(name)
    if (!existing.data) {
      if (mode === '--finalize') return fail('copy_is_missing')
      const copied = await client.storage.from(source).copy(name, name, { destinationBucket: destination })
      if (copied.error) return fail('copy_cv')
    }
    const copy = await client.storage.from(destination).download(name)
    if (copy.error || !copy.data || await hash(original.data) !== await hash(copy.data)) return fail('verify_copy')
    verified += 1
    if (mode !== '--finalize') continue
    const proxy = `/api/cv/signed-url?path=${encodeURIComponent(name)}`
    for (const resume of metadata.rows) {
      if ((resume.cvFile.path ?? cvPath(resume.cvFile.url)) !== name) continue
      await pool.query(`UPDATE public.resume SET "cvFile" = "cvFile" || $2::jsonb WHERE id = $1`, [resume.id, JSON.stringify({ path: name, url: proxy })])
    }
    for (const application of applications.rows) {
      if (cvPath(application.resume_url) === name) await pool.query('UPDATE public.application SET resume_url = $2 WHERE id = $1', [application.id, proxy])
    }
    const removed = await client.storage.from(source).remove([name])
    if (removed.error) return fail('remove_verified_public_copy')
  }
  console.log(JSON.stringify({ verified, publicCopiesRemoved: mode === '--finalize' ? verified : 0 }))
  return true
}

migrate().then(result => { if (!result) process.exitCode = 1 }, () => { fail('migration'); process.exitCode = 1 }).finally(() => pool.end())
