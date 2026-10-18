require("./register-ts.cjs")
const assert = require("node:assert/strict")
const { test } = require("node:test")
const Module = require("node:module")
const { Result } = require("better-result")

const organizationId = "00000000-0000-4000-8000-000000000001"
const otherOrganizationId = "00000000-0000-4000-8000-000000000002"
const professionalId = "00000000-0000-4000-8000-000000000003"
let session = { user: { id: "org-user", type: "organization", organizationId } }
const requests = []
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === "next/headers") return { headers: async () => new Headers() }
  if (name === "next/server") return { NextResponse: Response }
  if (name === "@/lib/auth") return { auth: { api: { getSession: async () => session } } }
  if (name === "@/lib/result") {
    return {
      fetchJsonWithSession: async (...request) => {
        requests.push(request)
        return Result.ok({
          id: "chat-1",
          recruiterId: "org-user",
          professionalId,
          organizationId,
          lastMessage: null,
          unreadCountRecruiter: 0,
          unreadCountProfessional: 0,
          createdAt: "2026-10-16T00:00:00.000Z",
        })
      },
    }
  }
  return load.call(this, name, parent, ...args)
}

const { POST } = require("../app/api/chats/create/route.ts")
Module._load = load
const makeRequest = (id) =>
  new Request("https://biovity.test/api/chats/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ professionalId, organizationId: id }),
  })

test("blocks an organization from creating a chat for another organization", async () => {
  requests.length = 0
  const response = await POST(makeRequest(otherOrganizationId))
  assert.equal(response.status, 403)
  assert.equal(requests.length, 0)
})

test("creates a chat for the session organization", async () => {
  requests.length = 0
  const response = await POST(makeRequest(organizationId))
  assert.equal(response.status, 201)
  assert.equal(JSON.parse(requests[0][2].body).organizationId, organizationId)
})
