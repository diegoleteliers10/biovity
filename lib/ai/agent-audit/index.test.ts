import assert from "node:assert/strict"
import { test } from "node:test"
import { createAgentAudit } from "./index"
import type { AgentAuditRecord } from "./types"

function fixture() {
  const records: AgentAuditRecord[] = []
  let time = 100
  const audit = createAgentAudit(
    { userId: "actor", inputHash: "hash", startTime: 100 },
    async (record) => {
      records.push(record)
      return "id"
    },
    () => time
  )
  return {
    audit,
    records,
    advance(value: number) {
      time = value
    },
  }
}

test("records complete duration, actual tools and provider token counts once", async () => {
  const { audit, records, advance } = fixture()
  audit.setModel({ provider: "zai", modelId: "glm", source: "platform" })
  audit.recordTool("search")
  audit.recordTool("search")
  advance(350)
  await audit.finish("ready", { inputTokens: 0, outputTokens: 13 })
  await audit.finish("failed")
  assert.equal(records.length, 1)
  assert.equal(records[0].durationMs, 250)
  assert.deepEqual(records[0].toolsCalled, ["search"])
  assert.deepEqual(records[0].metadata, {
    auditVersion: 2,
    status: "ready",
    durationScope: "complete",
    toolsScope: "executed",
    organizationId: undefined,
    jobOfferId: undefined,
    provider: "zai",
    modelId: "glm",
    source: "platform",
    inputTokens: 0,
    outputTokens: 13,
  })
})

test("stream error remains failed and omits partial usage", async () => {
  const { audit, records } = fixture()
  audit.recordError()
  await audit.finish("ready", { inputTokens: 20, outputTokens: 4 })
  assert.equal(records[0].metadata?.status, "failed")
  assert.equal("inputTokens" in (records[0].metadata ?? {}), false)
})

test("blocked and aborted requests do not invent tokens", async () => {
  for (const status of ["blocked", "aborted"] as const) {
    const { audit, records } = fixture()
    await audit.finish(status)
    assert.equal(records[0].flagged, status === "blocked")
    assert.equal(records[0].metadata?.status, status)
    assert.equal("outputTokens" in (records[0].metadata ?? {}), false)
    assert.deepEqual(records[0].toolsCalled, [])
  }
})

test("invalid provider usage is omitted", async () => {
  const { audit, records } = fixture()
  await audit.finish("ready", { inputTokens: -1, outputTokens: Number.NaN })
  assert.equal("inputTokens" in (records[0].metadata ?? {}), false)
  assert.equal("outputTokens" in (records[0].metadata ?? {}), false)
})

test("model runtime fields cannot enter audit metadata", async () => {
  const { audit, records } = fixture()
  const resolved = {
    provider: "zai",
    modelId: "glm",
    source: "platform",
    model: { apiKey: "secret" },
  }
  audit.setModel(resolved)
  await audit.finish("ready")
  assert.equal("model" in (records[0].metadata ?? {}), false)
  assert.equal(JSON.stringify(records).includes("secret"), false)
})
