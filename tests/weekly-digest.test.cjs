require("./register-ts.cjs")
const assert = require("node:assert/strict")
const { test, afterEach } = require("node:test")
const Module = require("node:module")

const load = Module._load
const queryCalls = []
const queued = []
const pool = {
  query: async (...args) => {
    queryCalls.push(args)
    return {
      rows: [
        {
          userId: "123e4567-e89b-42d3-a456-426614174000",
          email: "owner@example.com",
          name: "Ada",
          organizationId: "123e4567-e89b-42d3-a456-426614174001",
          organizationName: "Lab <North>",
          newApplications: 3,
          activeJobs: 2,
        },
      ],
    }
  },
}

Module._load = function (name, parent, ...args) {
  if (name === "@/lib/db") return { pool }
  if (name === "@/lib/errors") return { DbError: class DbError extends Error {} }
  if (name === "@/lib/email-outbox") {
    return { enqueueEmail: async (input) => (queued.push(input), true) }
  }
  return load.call(this, name, parent, ...args)
}

const digestModule = require(
  "../lib/organization-weekly-digest.ts"
)
const { enqueueOrganizationWeeklyDigests, escapeHtml, getWeeklyDigestWindow } = digestModule
const { GET } = require("../app/api/cron/weekly-digest/route.ts")

afterEach(() => {
  queryCalls.length = 0
  queued.length = 0
})

test("uses a seven-day UTC window and stable weekly key", () => {
  const window = getWeeklyDigestWindow(new Date("2026-10-19T12:00:00.000Z"))
  assert.equal(window.startsAt.toISOString(), "2026-10-12T12:00:00.000Z")
  assert.equal(window.endsAt.toISOString(), "2026-10-19T12:00:00.000Z")
  assert.equal(window.key, "2026-10-12")
})

test("escapes dynamic HTML values", () => {
  assert.equal(escapeHtml(`A&B <Lab> "North" 'unit'`), "A&amp;B &lt;Lab&gt; &quot;North&quot; &#39;unit&#39;")
})

test("queues one deduplicated summary per eligible user", async () => {
  const result = await enqueueOrganizationWeeklyDigests(new Date("2026-10-19T12:00:00.000Z"))

  assert.equal(result.kind, "ok")
  assert.equal(result.eligible, 1)
  assert.equal(result.queued, 1)
  assert.match(queryCalls[0][0], /digest' = 'weekly'/)
  assert.match(queryCalls[0][0], /channels'->>'email' = 'true'/)
  assert.equal(queued[0].idempotencyKey, "organization-weekly-digest:123e4567-e89b-42d3-a456-426614174000:2026-10-12")
  assert.equal(queued[0].recipientUserId, "123e4567-e89b-42d3-a456-426614174000")
  assert.match(queued[0].html, /Lab &lt;North&gt;/)
})

test("protects the weekly digest route and returns queued counts", async () => {
  process.env.CRON_SECRET = "cron-secret"
  const denied = await GET(new Request("https://biovity.test/api/cron/weekly-digest"))
  assert.equal(denied.status, 401)

  const accepted = await GET(
    new Request("https://biovity.test/api/cron/weekly-digest", {
      headers: { authorization: "Bearer cron-secret" },
    })
  )
  const body = await accepted.json()
  assert.equal(accepted.status, 200)
  assert.equal(body.queued, 1)
})
