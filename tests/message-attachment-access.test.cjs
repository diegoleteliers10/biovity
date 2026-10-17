require('./register-ts.cjs')
const assert = require('node:assert/strict')
const { test, afterEach } = require('node:test')
const Module = require('node:module')
const { Result } = require('better-result')

const chat = {
  id: 'chat-1',
  recruiterId: 'recruiter-1',
  professionalId: 'professional-1',
}
let session = { user: { id: 'recruiter-1' } }
let chatResult = Result.ok(chat)
let storageCalls = []
const load = Module._load

Module._load = function (name, parent, ...args) {
  if (name === 'next/headers') {
    return { headers: async () => new Headers({ cookie: 'session=valid' }) }
  }
  if (name === 'next/server') return { NextResponse: Response }
  if (name === '@/lib/auth') {
    return { auth: { api: { getSession: async () => session } } }
  }
  if (name === '@/lib/result') {
    return { fetchJsonWithSession: async () => chatResult }
  }
  if (name === '@/lib/api/chats') {
    return {
      parseChatResponse: (value) => {
        let parsed = value
        for (let depth = 0; depth < 2; depth++) {
          if (parsed && typeof parsed === 'object' && 'data' in parsed) parsed = parsed.data
        }
        return parsed && typeof parsed.id === 'string' ? parsed : null
      },
    }
  }
  if (name === '@/lib/supabase') {
    return {
      getSupabaseAdmin: () => ({
        storage: {
          from: () => ({
            upload: async (path) => {
              storageCalls.push({ operation: 'upload', path })
              return { data: { path }, error: null }
            },
            download: async (path) => {
              storageCalls.push({ operation: 'download', path })
              return { data: new Blob(['file'], { type: 'text/plain' }), error: null }
            },
          }),
        },
      }),
    }
  }
  return load.call(this, name, parent, ...args)
}

const { POST } = require('../app/api/upload/message-attachment/route.ts')
const { GET } = require('../app/api/messages/attachment/route.ts')

afterEach(() => {
  session = { user: { id: 'recruiter-1' } }
  chatResult = Result.ok(chat)
  storageCalls = []
})

function uploadRequest(chatId = 'chat-1') {
  const body = new FormData()
  body.set('file', new File(['document'], 'resume.pdf', { type: 'application/pdf' }))
  body.set('chatId', chatId)
  return new Request('http://localhost/api/upload/message-attachment', {
    method: 'POST',
    body,
  })
}

function downloadRequest(path) {
  return new Request(
    `http://localhost/api/messages/attachment?path=${encodeURIComponent(path)}`
  )
}

test('chat participants can upload message attachments', async () => {
  const response = await POST(uploadRequest())
  assert.equal(response.status, 200)
  assert.equal(storageCalls.length, 1)
  assert.equal(storageCalls[0].operation, 'upload')
  assert.match(storageCalls[0].path, /^messages\/chat-1\//)

  session = { user: { id: 'professional-1' } }
  const professionalUpload = await POST(uploadRequest())
  const professionalDownload = await GET(
    downloadRequest('messages/chat-1/professional-1_123_resume.pdf')
  )
  assert.equal(professionalUpload.status, 200)
  assert.equal(professionalDownload.status, 200)
})

test('nonparticipants cannot upload or download message attachments', async () => {
  session = { user: { id: 'other-user' } }

  const uploadResponse = await POST(uploadRequest())
  const downloadResponse = await GET(
    downloadRequest('messages/chat-1/recruiter-1_123_resume.pdf')
  )

  assert.equal(uploadResponse.status, 403)
  assert.equal(downloadResponse.status, 403)
  assert.deepEqual(storageCalls, [])
})

test('chat lookup failures deny upload and download before storage access', async () => {
  chatResult = Result.err(new Error('backend unavailable'))

  const uploadResponse = await POST(uploadRequest())
  const downloadResponse = await GET(
    downloadRequest('messages/chat-1/recruiter-1_123_resume.pdf')
  )

  assert.equal(uploadResponse.status, 502)
  assert.equal(downloadResponse.status, 502)
  assert.deepEqual(storageCalls, [])
})

test('downloads require an existing participant chat and exact single-file path', async () => {
  for (const path of ['messages/chat-1/subdir/file.pdf', 'messages/chat-1/']) {
    const response = await GET(downloadRequest(path))
    assert.equal(response.status, 400)
  }

  chatResult = Result.ok({ ...chat, id: 'chat-2', recruiterId: 'other-recruiter' })
  const crossChat = await GET(downloadRequest('messages/chat-2/recruiter-1_123_resume.pdf'))
  assert.equal(crossChat.status, 403)

  chatResult = Result.err({ _tag: 'ApiError', status: 404 })
  const missingChat = await GET(
    downloadRequest('messages/chat-1/recruiter-1_123_resume.pdf')
  )
  assert.equal(missingChat.status, 404)
  assert.deepEqual(storageCalls, [])
})

test('participants receive private no-store attachment responses', async () => {
  const response = await GET(
    downloadRequest('messages/chat-1/recruiter-1_123_resume.pdf')
  )

  assert.equal(response.status, 200)
  assert.equal(response.headers.get('cache-control'), 'private, no-store')
  assert.equal(storageCalls.length, 1)
  assert.equal(storageCalls[0].operation, 'download')
})
