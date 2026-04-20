import { createHash } from "crypto"
import { MAX_INPUT_LENGTH } from "./env"
import { PromptInjectionError, UnauthorizedToolAccessError } from "./errors"

const INJECTION_PATTERNS: { pattern: RegExp; name: string }[] = [
  {
    pattern:
      /\bignore\s+(all\s+)?(previous|prior|above)\s+(instructions?|rules?|prompts?|constraints?)\b/i,
    name: "ignore_instructions",
  },
  {
    pattern: /\b(you\s+are\s+now|you\s+are\s+a|act\s+as|pretend\s+to\s+be|roleplay\s+as)\b/i,
    name: "act_as",
  },
  {
    pattern: /\bforget\s+(everything|all\s+previous|your\s+instructions?|your\s+rules?)\b/i,
    name: "forget_everything",
  },
  { pattern: /\[SYSTEM\]|new\s+system\s+prompt|sys:/i, name: "system_prompt_override" },
  {
    pattern: /\b(jailbreak|bypass|override|disable)\s+(safety|security|filter|restriction)/i,
    name: "jailbreak_attempt",
  },
  { pattern: /\b(developer|dev)\s*:?\s*(mode|prompt|override)/i, name: "developer_mode" },
  { pattern: /\bstrip\s+(system|prompt|instruction)/i, name: "strip_prompt" },
  {
    pattern: /\b(malicious|harmful|unsafe)\s+(content|instruction|prompt)/i,
    name: "harmful_intent",
  },
]

export function sanitizeInput(input: string, userId?: string): string {
  if (!input || typeof input !== "string") {
    return ""
  }

  const trimmed = input.trim()

  for (const { pattern, name } of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      const hash = createHash("sha256").update(trimmed).digest("hex").slice(0, 16)
      console.warn(
        `[AI Security] Prompt injection detected: ${name} | userId: ${userId ?? "unknown"} | hash: ${hash}`
      )
      throw new PromptInjectionError({
        code: "ERR_PROMPT_INJECTION",
        detectedPattern: name,
        userId,
      })
    }
  }

  return trimmed.slice(0, MAX_INPUT_LENGTH)
}

export function hashInput(input: string): string {
  return createHash("sha256").update(input).digest("hex")
}

export function validateToolPermission(
  toolName: string,
  userContext: { userId: string; organizationId?: string }
): void {
  if (!toolName || !userContext.userId) {
    throw new UnauthorizedToolAccessError({
      toolName,
      userId: userContext.userId,
    })
  }
}

export type SanitizeResult =
  | { safe: true; input: string }
  | { safe: false; error: PromptInjectionError }
