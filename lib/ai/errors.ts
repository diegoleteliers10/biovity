import { TaggedError } from "better-result"

class PromptInjectionError extends TaggedError("PromptInjectionError")<{
  code: string
  detectedPattern: string
  userId?: string
}> {
  constructor(args: { code: string; detectedPattern: string; userId?: string }) {
    super({
      code: args.code,
      detectedPattern: args.detectedPattern,
      userId: args.userId,
    })
  }
}

export { PromptInjectionError }

class UnauthorizedToolAccessError extends TaggedError("UnauthorizedToolAccessError")<{
  toolName: string
  userId?: string
}> {
  constructor(args: { toolName: string; userId?: string }) {
    super({ toolName: args.toolName, userId: args.userId })
  }
}

export { UnauthorizedToolAccessError }
