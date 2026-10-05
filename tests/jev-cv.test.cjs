require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const Module = require('node:module')
const owner = '00000000-0000-4000-8000-000000000001'
const cvPath = `cv/resume_${owner}.pdf`
let blob
let storageError = null
const downloads = []
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === '@/lib/supabase') return {
    getSupabaseAdmin: () => ({ storage: { from: (bucket) => ({
      download: async (path) => {
        downloads.push({ bucket, path })
        return { data: blob, error: storageError }
      },
    }) } }),
  }
  return load.call(this, name, parent, ...args)
}
const { loadCandidateCvText, CandidateCvError } = require('../lib/ai/decision/cv.ts')
Module._load = load

function resume(path = cvPath) {
  return { userId: owner, cvFile: { path, url: 'https://untrusted.invalid/resume.pdf' } }
}

function pdfFixture(text, pages = 1) {
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${Array.from({ length: pages }, (_, i) => `${5 + i} 0 R`).join(' ')}] /Count ${pages} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
  const lines = text.match(/.{1,70}/g) ?? []
  const stream = text ? `BT /F1 12 Tf 14 TL 50 750 Td ${lines.map((line) => `(${line}) Tj T*`).join(' ')} ET` : ''
  objects.push(`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`)
  for (let page = 0; page < pages; page++) {
    objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents 4 0 R >>')
  }
  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(pdf))
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`
  }
  const xref = Buffer.byteLength(pdf)
  pdf += `xref\n0 ${offsets.length}\n0000000000 65535 f \n`
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')
  pdf += `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return new Blob([pdf], { type: 'application/pdf' })
}

test('missing CV needs no storage access', async () => {
  assert.equal((await loadCandidateCvText(null)).value, '')
  assert.equal((await loadCandidateCvText({ userId: owner, cvFile: null })).value, '')
  assert.equal(downloads.length, 0)
})

test('owner mismatch and unsafe paths fail before storage access', async () => {
  const count = downloads.length
  for (const path of ['cv/resume_other.pdf', `cv/../resume_${owner}.pdf`, `cv/a/b_${owner}.pdf`, `https://evil.invalid/cv/file_${owner}.pdf`]) {
    const result = await loadCandidateCvText(resume(path))
    assert.equal(result.isErr(), true)
    assert.ok(CandidateCvError.is(result.error))
    assert.equal(result.error.reason, "path")
  }
  assert.equal((await loadCandidateCvText({ userId: owner, cvFile: { url: "https://evil.invalid/a.pdf" } })).isErr(), true)
  assert.equal(downloads.length, count)
})

test('real selectable PDF text comes from candidate-owned storage', async () => {
  blob = pdfFixture('PCR laboratory experience and cell culture')
  const result = await loadCandidateCvText(resume())
  assert.equal(result.isOk(), true, result.isErr() ? result.error.message : '')
  assert.match(result.value, /PCR laboratory experience and cell culture/)
  assert.deepEqual(downloads.at(-1), { bucket: process.env.SUPABASE_CV_BUCKET ?? 'biovity_cv', path: cvPath })
})

test('malformed PDFs and PDFs without selectable text fail', async () => {
  for (const fixture of [new Blob(['not a PDF']), new Blob([]), pdfFixture('')]) {
    blob = fixture
    const result = await loadCandidateCvText(resume())
    assert.equal(result.isErr(), true)
  }
})

test('PDF size and page limits fail and text output stays bounded', async () => {
  for (const fixture of [new Blob([new Uint8Array(10 * 1024 * 1024 + 1)]), pdfFixture('PCR', 31)]) {
    blob = fixture
    assert.equal((await loadCandidateCvText(resume())).isErr(), true)
  }
  blob = pdfFixture('PCR '.repeat(300), 30)
  const result = await loadCandidateCvText(resume())
  assert.equal(result.isOk(), true, result.isErr() ? result.error.message : '')
  assert.ok(result.value.length <= 20_000)
  assert.ok(result.value.length > 19_000)
})

test('storage errors stay errors', async () => {
  storageError = { message: 'Not found' }
  assert.equal((await loadCandidateCvText(resume())).isErr(), true)
  storageError = null
})

 test('flat CV filenames accept internal dots', async () => {
  blob = pdfFixture('PCR experience')
  const result = await loadCandidateCvText(resume(`cv/CV..final.pdf_${owner}.pdf`))
  assert.equal(result.isOk(), true, result.isErr() ? result.error.message : '')
  assert.match(result.value, /PCR experience/)
})

test('CV errors identify extraction and storage failures', async () => {
  blob = new Blob(['invalid PDF'])
  const invalid = await loadCandidateCvText(resume())
  assert.ok(CandidateCvError.is(invalid.error))
  assert.equal(invalid.error.reason, 'invalid_pdf')
  blob = pdfFixture('')
  const empty = await loadCandidateCvText(resume())
  assert.ok(CandidateCvError.is(empty.error))
  assert.equal(empty.error.reason, 'no_text')
  storageError = { message: 'Not found' }
  const download = await loadCandidateCvText(resume())
  assert.ok(CandidateCvError.is(download.error))
  assert.equal(download.error.reason, 'download')
  storageError = null
})
