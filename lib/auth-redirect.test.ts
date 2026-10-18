import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { getSafeCallbackURL } from "./auth-redirect"

describe("getSafeCallbackURL", () => {
  it("keeps a local job path and its tracked source", () => {
    assert.equal(getSafeCallbackURL("/jobs/job-1?sourceId=token-1"), "/jobs/job-1?sourceId=token-1")
  })

  it("uses the dashboard for external and protocol-relative URLs", () => {
    assert.equal(getSafeCallbackURL("https://evil.example"), "/dashboard")
    assert.equal(getSafeCallbackURL("//evil.example"), "/dashboard")
    assert.equal(getSafeCallbackURL("/\\evil.example"), "/dashboard")
  })

  it("uses the dashboard when no redirect exists", () => {
    assert.equal(getSafeCallbackURL(null), "/dashboard")
  })
})
