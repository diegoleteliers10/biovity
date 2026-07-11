import { useEffect } from "react"

export function useAutoScrollToBottom(
  chatId: string | undefined,
  messagesLoading: boolean,
  messagesLength: number,
  scrollToBottom: (behavior?: ScrollBehavior) => void
) {
  useEffect(() => {
    if (chatId && !messagesLoading && messagesLength > 0) {
      const timeout = setTimeout(() => scrollToBottom(), 50)
      return () => clearTimeout(timeout)
    }
  }, [chatId, messagesLoading, messagesLength, scrollToBottom])
}
