require("./register-ts.cjs")
const assert = require("node:assert/strict")
const { test } = require("node:test")
const { GET } = require("../app/api/cron/backend-dispatch/route.ts")

test("requires the cron token before calling backend", async () => {
  process.env.CRON_SECRET = "cron-secret"
  const response = await GET(new Request("https://biovity.test/api/cron/backend-dispatch"))

  assert.equal(response.status, 401)
})

test("forwards authorized cron calls to the backend internal dispatcher", async () => {
  process.env.CRON_SECRET = "cron-secret"
  process.env.API_URL = "https://api.biovity.test/"
  process.env.INTERNAL_API_KEY = "internal-key"
  const originalFetch = global.fetch
  let request
  global.fetch = async (url, options) => {
    request = { url, options }
    return Response.json({ dispatched: 4 })
  }

  const response = await GET(
    new Request("https://biovity.test/api/cron/backend-dispatch", {
      headers: { authorization: "Bearer cron-secret" },
    })
  )
  global.fetch = originalFetch
  const body = await response.json()

  assert.equal(response.status, 200)
  assert.equal(request.url, "https://api.biovity.test/api/v1/internal/cron/dispatch")
  assert.equal(request.options.method, "POST")
  assert.equal(request.options.headers["x-internal-key"], "internal-key")
  assert.deepEqual(body.data, { dispatched: 4 })
})

test("reports backend job failures to the scheduler", async () => {
  process.env.CRON_SECRET = "cron-secret"
  process.env.API_URL = "https://api.biovity.test"
  process.env.INTERNAL_API_KEY = "internal-key"
  const originalFetch = global.fetch
  global.fetch = async () => Response.json({ ok: false, jobs: [{ job: "email_outbox", status: "rejected" }] })

  const response = await GET(
    new Request("https://biovity.test/api/cron/backend-dispatch", {
      headers: { authorization: "Bearer cron-secret" },
    })
  )
  global.fetch = originalFetch

  assert.equal(response.status, 502)
})
