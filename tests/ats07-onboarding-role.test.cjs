require("./register-ts.cjs")
const assert = require("node:assert/strict")
const { test } = require("node:test")
const Module = require("node:module")

let session = { user: { id: "org-user", type: "organization", organizationId: "org-1" } }
const queries = []
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === "next/headers") return { headers: async () => new Headers() }
  if (name === "next/server") return { NextResponse: Response }
  if (name === "@/lib/auth") return { getServerSession: async () => session }
  if (name === "@/lib/db") {
    return {
      pool: {
        query: async (...query) => {
          queries.push(query)
          if (query[0].startsWith("SELECT steps_completed")) {
            return { rows: [{ steps_completed: ["create_offer", "publish_offer", "complete_profile"], dismissed: false }] }
          }
          return { rows: [] }
        },
      },
    }
  }
  if (name === "@/lib/validations/onboarding") {
    return { updateOnboardingSchema: { safeParse: (data) => ({ success: true, data }) } }
  }
  return load.call(this, name, parent, ...args)
}

const { GET, PATCH } = require("../app/api/onboarding/route.ts")
Module._load = load

test("blocks non-organization users from reading onboarding", async () => {
  session = { user: { id: "candidate", type: "professional", organizationId: "org-1" } }
  const response = await GET()
  assert.equal(response.status, 403)
  assert.equal(queries.length, 0)
})

test("blocks non-organization users from changing onboarding", async () => {
  session = { user: { id: "candidate", type: "professional", organizationId: "org-1" } }
  const response = await PATCH(new Request("https://biovity.test", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dismiss: true }),
  }))
  assert.equal(response.status, 403)
  assert.equal(queries.length, 0)
})

test("allows an organization to read and change onboarding", async () => {
  session = { user: { id: "org-user", type: "organization", organizationId: "org-1" } }
  queries.length = 0
  const getResponse = await GET()
  const patchResponse = await PATCH(new Request("https://biovity.test", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dismiss: true }),
  }))
  assert.equal(getResponse.status, 200)
  assert.equal(patchResponse.status, 200)
  assert.ok(queries.length > 0)
})
