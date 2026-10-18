require("./register-ts.cjs")
const assert = require("node:assert/strict")
const { test } = require("node:test")
const Module = require("node:module")

let session = null
let rendered = 0
const load = Module._load
Module._load = function (name, parent, ...args) {
  if (name === "next/headers") return { headers: async () => new Headers() }
  if (name === "next/server") return { NextResponse: Response }
  if (name === "@/lib/auth") {
    return {
      auth: { api: { getSession: async () => session } },
      isAdminSession: (value) => value?.user?.type === "admin",
    }
  }
  if (name === "@/components/pdf/offer-letter-document") {
    return { defaultOfferLetterData: (data) => data }
  }
  if (name === "@/lib/offer-letter-pdf") {
    return { renderOfferLetterToPdf: async () => { rendered += 1; return new Uint8Array([1]) } }
  }
  return load.call(this, name, parent, ...args)
}

const { POST } = require("../app/api/offer-letters/pdf/route.tsx")
Module._load = load
const makeRequest = () => new Request("https://biovity.test/api/offer-letters/pdf", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ letterData: { companyName: "Biovity", candidateName: "A", jobTitle: "B" } }),
})

test("blocks a professional from generating an offer PDF", async () => {
  session = { user: { id: "candidate", type: "professional" } }
  rendered = 0
  const response = await POST(makeRequest())
  assert.equal(response.status, 403)
  assert.equal(rendered, 0)
})

test("allows an organization to generate an offer PDF", async () => {
  session = { user: { id: "org-user", type: "organization" } }
  const response = await POST(makeRequest())
  assert.equal(response.status, 200)
  assert.equal(rendered, 1)
})

test("allows an admin to generate an offer PDF", async () => {
  session = { user: { id: "admin", type: "admin" } }
  const response = await POST(makeRequest())
  assert.equal(response.status, 200)
  assert.equal(rendered, 2)
})
