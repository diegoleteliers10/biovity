require("./register-ts.cjs")
const assert = require("node:assert/strict")
const { test } = require("node:test")
const Module = require("node:module")
const { Result } = require("better-result")

let session = { user: { id: "admin-id", type: "admin" } }
let apiResult = Result.ok({ data: { status: "claimed" } })
const requests = []
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === "@/lib/admin/contact-inquiries") {
    return {
      ADMIN_API_BASE: "https://api.biovity.test",
      apiErrorResponse: (error) => Response.json({ error: error.message }, { status: 502 }),
      responsePayload: (value) => value?.data ?? value,
    }
  }
  if (name === "@/lib/auth") {
    return {
      auth: { api: { getSession: async () => session } },
      isAdminSession: (value) => Boolean(value?.user?.type === "admin"),
    }
  }
  if (name === "@/lib/result") {
    return {
      fetchJsonWithSession: async (...args) => {
        requests.push(args)
        return apiResult
      },
    }
  }
  return load.call(this, name, parent, ...args)
}

const { PATCH } = require("../app/api/admin/operations-queue/organizations/[organizationId]/assignment/route.ts")
const organizationId = "00000000-0000-4000-8000-000000000001"

function request(body) {
  return new Request("https://biovity.test/api/admin/operations-queue/organizations", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  })
}

function params(id = organizationId) {
  return { params: Promise.resolve({ organizationId: id }) }
}

test("validates admin assignment requests and forwards a complete follow-up plan", async () => {
  session = null
  requests.length = 0
  const unauthorized = await PATCH(request("{"), params())
  assert.equal(unauthorized.status, 403)
  assert.equal(requests.length, 0)

  session = { user: { id: "admin-id", type: "admin" } }
  const malformed = await PATCH(request("{"), params())
  const unsupported = await PATCH(request(JSON.stringify({ action: "steal" })), params())
  const missingPlan = await PATCH(request(JSON.stringify({ action: "claim" })), params())
  const invalidDate = await PATCH(request(JSON.stringify({
    action: "schedule_follow_up",
    nextAction: "Contactar empresa",
    targetDate: "20-10-2026",
  })), params())

  assert.equal(malformed.status, 400)
  assert.equal(unsupported.status, 400)
  assert.equal(missingPlan.status, 400)
  assert.equal(invalidDate.status, 400)
  requests.length = 0
  apiResult = Result.ok({ data: { status: "claimed" } })

  const plan = { action: "claim", nextAction: "Revisar antecedentes", targetDate: "2026-10-20" }
  const response = await PATCH(request(JSON.stringify(plan)), params())

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { status: "claimed" })
  assert.equal(requests[0][0], `https://api.biovity.test/api/v1/admin/operations-queue/${organizationId}/assignment`)
  assert.deepEqual(JSON.parse(requests[0][2].body), plan)
})
