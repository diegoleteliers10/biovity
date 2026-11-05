require("./register-ts.cjs")
const assert = require("node:assert/strict")
const { test } = require("node:test")
const Module = require("node:module")

let session = null
let queryHandler = async () => ({ rows: [] })
const queries = []
const pool = {
  query: async (...args) => {
    queries.push(args)
    return queryHandler(...args)
  },
}

const originalLoad = Module._load
Module._load = function (name, parent, ...args) {
  if (name === "next/server") {
    return { NextResponse: { json: (body, init) => Response.json(body, init) } }
  }
  if (name === "@/lib/auth") {
    return {
      getServerSession: async () => session,
      isAdminSession: (value) => value?.user?.type === "admin",
    }
  }
  if (name === "@/lib/db") return { pool }
  return originalLoad.call(this, name, parent, ...args)
}

let userTopicRoute
let chatTopicRoute
try {
  userTopicRoute = require("../app/api/realtime/user-topic/route.ts")
  chatTopicRoute = require("../app/api/realtime/chat-topic/[chatId]/route.ts")
} finally {
  Module._load = originalLoad
}

const userId = "00000000-0000-4000-8000-000000000001"
const sessionId = "00000000-0000-4000-8000-000000000002"
const chatId = "00000000-0000-4000-8000-000000000003"
const requestUrl = "https://biovity.test/api/realtime/topic"

function reset() {
  session = { user: { id: userId, type: "professional" }, session: { id: sessionId } }
  queryHandler = async () => ({ rows: [] })
  queries.length = 0
}

function makeRequest(options = {}) {
  return new Request(requestUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: new URL(requestUrl).origin,
      ...options.headers,
    },
  })
}

const chatParams = (id = chatId) => ({ params: Promise.resolve({ chatId: id }) })

test("topic routes reject invalid request and session gates before querying", async () => {
  reset()
  const cases = [
    [makeRequest({ headers: { "content-type": "text/plain" } }), 415],
    [makeRequest({ headers: { origin: "https://other.test" } }), 403],
  ]
  const missingOrigin = makeRequest()
  missingOrigin.headers.delete("origin")
  cases.push([missingOrigin, 403])
  for (const [request, expectedStatus] of cases) {
    assert.equal((await userTopicRoute.POST(request)).status, expectedStatus)
    assert.equal((await chatTopicRoute.POST(request, chatParams())).status, expectedStatus)
  }

  for (const invalidSession of [null, { user: {}, session: { id: sessionId } }, {
    user: { id: userId, type: "professional" },
    session: {},
  }]) {
    session = invalidSession
    assert.equal((await userTopicRoute.POST(makeRequest())).status, 401)
    assert.equal((await chatTopicRoute.POST(makeRequest(), chatParams())).status, 401)
  }

  assert.equal(queries.length, 0)
})

test("chat topic rejects an invalid chat id before database access", async () => {
  reset()
  const response = await chatTopicRoute.POST(makeRequest(), chatParams("not-a-uuid"))
  assert.equal(response.status, 400)
  assert.equal(queries.length, 0)
})

test("user topic issues private no-store grants bound to the current session and admin status", async () => {
  reset()
  const expiresAt = new Date("2026-11-05T12:00:00.000Z")
  queryHandler = async () => ({ rows: [{ topic: "biovity:user:topic-id", expiresAt }] })

  const ordinaryUserResponse = await userTopicRoute.POST(makeRequest())

  assert.equal(ordinaryUserResponse.status, 200)
  assert.deepEqual(await ordinaryUserResponse.json(), {
    topic: "biovity:user:topic-id",
    expiresAt: expiresAt.toISOString(),
  })
  assert.equal(ordinaryUserResponse.headers.get("cache-control"), "private, no-store, max-age=0")
  assert.equal(queries.length, 1)
  assert.deepEqual(queries[0][1], [sessionId, userId, false])

  queries.length = 0
  session.user.type = "admin"
  const adminResponse = await userTopicRoute.POST(makeRequest())

  assert.equal(adminResponse.status, 200)
  assert.deepEqual(queries[0][1], [sessionId, userId, true])
})

test("user topic maps empty and failed grant queries to 503", async () => {
  reset()
  assert.equal((await userTopicRoute.POST(makeRequest())).status, 503)

  queries.length = 0
  queryHandler = async () => {
    throw new Error("database unavailable")
  }
  assert.equal((await userTopicRoute.POST(makeRequest())).status, 503)
  assert.equal(queries.length, 1)
})

test("chat topic binds chat and session parameters and returns a private no-store grant", async () => {
  reset()
  queryHandler = async () => ({ rows: [{ topic: "biovity:chat:topic-id" }] })

  const response = await chatTopicRoute.POST(makeRequest(), chatParams())

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { topic: "biovity:chat:topic-id" })
  assert.equal(response.headers.get("cache-control"), "private, no-store, max-age=0")
  assert.equal(queries.length, 3)
  assert.deepEqual(queries[2][1], [chatId, userId, sessionId])
})

test("chat topic maps an empty grant to 404 and lets database failures propagate", async () => {
  reset()
  assert.equal((await chatTopicRoute.POST(makeRequest(), chatParams())).status, 404)

  queries.length = 0
  queryHandler = async () => {
    if (queries.length === 3) throw new Error("database unavailable")
    return { rows: [] }
  }
  await assert.rejects(chatTopicRoute.POST(makeRequest(), chatParams()), /database unavailable/)
  assert.equal(queries.length, 3)
})
