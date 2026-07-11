import type { RealtimeChannel } from "@supabase/supabase-js"
import { useCallback, useEffect, useRef, useState } from "react"
import { useMountEffect } from "@/hooks/use-mount-effect"
import { createClientBrowser } from "@/lib/supabase-browser"

export function useChatPresence(chatId: string | undefined, myId: string | undefined) {
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!chatId || !myId) return
    const supabase = createClientBrowser()
    if (!supabase) return

    const room = `chat-${chatId}`
    const channel = supabase.channel(room, {
      config: { presence: { key: myId } },
    })

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState()
        const otherTyping = Object.entries(state).some(
          ([key, value]) =>
            key !== myId &&
            Array.isArray(value) &&
            (value as { typing?: boolean }[]).some((v) => v.typing)
        )
        setIsTyping(otherTyping)
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ typing: false })
        }
      })

    channelRef.current = channel

    return () => {
      channel.untrack()
      supabase.removeChannel(channel)
      channelRef.current = null
      setIsTyping(false)
    }
  }, [chatId, myId])

  useMountEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  })

  const trackTyping = useCallback(() => {
    const channel = channelRef.current
    if (!channel) return
    channel.track({ typing: true })

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      channel.track({ typing: false })
    }, 2000)
  }, [])

  return { isTyping, trackTyping }
}
