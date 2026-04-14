import { TaggedError } from "better-result"

// Factory-based error classes using TaggedError pattern
const NetworkErrorFactory = TaggedError("NetworkError")
const ApiErrorFactory = TaggedError("ApiError")
const ParseErrorFactory = TaggedError("ParseError")
const NotFoundErrorFactory = TaggedError("NotFoundError")
const DbErrorFactory = TaggedError("DbError")

const _NetworkError = NetworkErrorFactory<{ message: string; cause?: unknown }>()
class NetworkError extends _NetworkError {
  constructor(args: { message: string; cause?: unknown }) {
    super({ message: args.message, cause: args.cause })
  }
}

const _ApiError = ApiErrorFactory<{
  status: number
  statusText?: string
  message: string
  body?: unknown
}>()
class ApiError extends _ApiError {
  constructor(args: {
    status: number
    statusText?: string
    message?: string
    body?: unknown
  }) {
    super({
      status: args.status,
      statusText: args.statusText,
      message:
        args.message ??
        (args.statusText
          ? `API error ${args.status} ${args.statusText}`
          : `API error ${args.status}`),
      body: args.body,
    })
  }
}

const _ParseError = ParseErrorFactory<{ message: string; cause?: unknown }>()
class ParseError extends _ParseError {
  constructor(args: { message: string; cause?: unknown }) {
    super({ message: args.message, cause: args.cause })
  }
}

const _NotFoundError = NotFoundErrorFactory<{ resource: string; id: string; message: string }>()
class NotFoundError extends _NotFoundError {
  constructor(args: { resource: string; id: string }) {
    super({
      resource: args.resource,
      id: args.id,
      message: `${args.resource} ${args.id} no encontrado`,
    })
  }
}

const _DbError = DbErrorFactory<{ operation: string; message: string; cause?: unknown }>()
class DbError extends _DbError {
  constructor(args: { operation: string; cause?: unknown }) {
    const msg = args.cause instanceof Error ? args.cause.message : String(args.cause ?? "unknown")
    super({
      operation: args.operation,
      message: `DB ${args.operation} failed: ${msg}`,
      cause: args.cause,
    })
  }
}

// Legacy plain-object error factories (used by existing call sites, not TaggedError-based)
type ContextError = {
  readonly name: "ContextError"
  readonly message: string
  readonly providerName?: string
}

const createContextError = (providerName?: string): ContextError => ({
  name: "ContextError",
  message: `useContext must be used within ${providerName ?? "a Provider"}`,
  providerName,
})

type SignUpError = {
  readonly name: "SignUpError"
  readonly message: string
  readonly code?: string
  readonly cause?: unknown
}

const createSignUpError = (message: string, code?: string, cause?: unknown): SignUpError => ({
  name: "SignUpError",
  message,
  code,
  cause,
})

type ChartError = {
  readonly name: "ChartError"
  readonly message: string
}

const createChartError = (message: string): ChartError => ({
  name: "ChartError",
  message,
})

type HighlightError = {
  readonly name: "HighlightError"
  readonly message: string
}

const createHighlightError = (message: string): HighlightError => ({
  name: "HighlightError",
  message,
})

export {
  ApiError,
  type ChartError,
  type ContextError,
  createChartError,
  createContextError,
  createHighlightError,
  createSignUpError,
  DbError,
  type HighlightError,
  NetworkError,
  NotFoundError,
  ParseError,
  type SignUpError,
}
