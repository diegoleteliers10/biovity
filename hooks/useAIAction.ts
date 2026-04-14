import { useCallback, useState } from "react"
import type { AIActionType } from "@/lib/ai/types"

interface Options {
  onChunk?: (text: string) => void
  onDone?: (fullText: string) => void
  onError?: (msg: string) => void
}

export function useAIAction({ onChunk, onDone, onError }: Options = {}) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(
    async (action: AIActionType, context: Record<string, unknown>) => {
      setIsStreaming(true)
      setOutput("")
      setError(null)
      let fullText = ""

      try {
        const res = await fetch("/api/ai/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, context }),
        })

        if (!res.ok) throw new Error("API error")

        const reader = res.body!.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          for (const line of decoder.decode(value).split("\n")) {
            if (!line.startsWith("data: ")) continue
            const data = line.slice(6)
            if (data === "[DONE]") break

            const parsed = JSON.parse(data)
            if (parsed.error) throw new Error(parsed.error)

            fullText += parsed.text
            setOutput((prev) => prev + parsed.text)
            onChunk?.(parsed.text)
          }
        }

        onDone?.(fullText)
      } catch {
        const msg = "Error al conectar con IA"
        setError(msg)
        onError?.(msg)
      } finally {
        setIsStreaming(false)
      }
    },
    [onChunk, onDone, onError]
  )

  const reset = useCallback(() => {
    setOutput("")
    setError(null)
  }, [])

  return { run, output, isStreaming, error, reset }
}
