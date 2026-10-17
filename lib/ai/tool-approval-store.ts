import { createHash, createHmac } from "node:crypto"
import { Result } from "better-result"
import { pool } from "@/lib/db"

export function deriveToolApprovalSecret(secret: string, actorId: string, organizationId: string) {
  return createHmac("sha256", secret)
    .update(`tool-approval:${JSON.stringify([actorId, organizationId])}`)
    .digest("hex")
}

export async function consumeApprovedToolCall(
  actorId: string,
  organizationId: string,
  toolCallId: string,
  toolName: string,
  input: unknown
) {
  return Result.tryPromise(() =>
    pool
      .query(
        `INSERT INTO ai_tool_approval_consumptions (
        tool_call_id, actor_id, organization_id, tool_name, input_hash
      ) VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (tool_call_id) DO NOTHING
      RETURNING tool_call_id`,
        [
          toolCallId,
          actorId,
          organizationId,
          toolName,
          createHash("sha256")
            .update(JSON.stringify(input ?? null))
            .digest("hex"),
        ]
      )
      .then((result) => result.rowCount === 1)
  )
}
