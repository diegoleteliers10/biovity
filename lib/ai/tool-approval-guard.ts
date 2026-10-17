import type { Tool, ToolExecutionOptions, ToolSet } from "ai"
import type { Result } from "better-result"

export type ToolApprovalConsumer = (
  actorId: string,
  organizationId: string,
  toolCallId: string,
  toolName: string,
  input: unknown
) => Promise<Result<boolean, Error>>

export function guardApprovedTools<T extends ToolSet>(
  tools: T,
  actorId: string,
  organizationId: string,
  consume: ToolApprovalConsumer
): T {
  const guarded = Object.fromEntries(
    Object.entries(tools).map(([toolName, toolValue]) => {
      const currentTool = toolValue as Tool
      if (currentTool.needsApproval !== true || !currentTool.execute) {
        return [toolName, currentTool]
      }

      const execute = currentTool.execute
      return [
        toolName,
        {
          ...currentTool,
          execute: async (input: unknown, options: ToolExecutionOptions<unknown>) => {
            const consumed = await consume(
              actorId,
              organizationId,
              options.toolCallId,
              toolName,
              input
            )
            if (consumed.isErr()) return { error: "No se pudo validar la aprobación." }
            if (!consumed.value) return { error: "Esta aprobación ya se usó." }
            return execute(input, options)
          },
        },
      ]
    })
  )

  return guarded as T
}
