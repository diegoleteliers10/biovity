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

const createSignUpError = (
  message: string,
  code?: string,
  cause?: unknown
): SignUpError => ({
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
  createContextError,
  createSignUpError,
  createChartError,
  createHighlightError,
  type ContextError,
  type SignUpError,
  type ChartError,
  type HighlightError,
}
