import { TaggedError } from "better-result"

const PromptInjectionErrorFactory = TaggedError("PromptInjectionError")

const _PromptInjectionError = PromptInjectionErrorFactory<{
  code: string
  detectedPattern: string
  userId?: string
}>()

class PromptInjectionError extends _PromptInjectionError {
  constructor(args: { code: string; detectedPattern: string; userId?: string }) {
    super({
      code: args.code,
      detectedPattern: args.detectedPattern,
      userId: args.userId,
    })
  }
}

export { PromptInjectionError }

const UnauthorizedToolAccessErrorFactory = TaggedError("UnauthorizedToolAccessError")

const _UnauthorizedToolAccessError = UnauthorizedToolAccessErrorFactory<{
  toolName: string
  userId?: string
}>()

class UnauthorizedToolAccessError extends _UnauthorizedToolAccessError {
  constructor(args: { toolName: string; userId?: string }) {
    super({ toolName: args.toolName, userId: args.userId })
  }
}

export { UnauthorizedToolAccessError }
