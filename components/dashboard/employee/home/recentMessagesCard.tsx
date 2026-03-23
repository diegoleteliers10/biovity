"use client"

import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RecentMessage } from "@/lib/types/dashboard"

interface RecentMessagesCardProps {
  messages: RecentMessage[]
  onViewAll?: () => void
}

export const RecentMessagesCard = memo(function RecentMessagesCard({
  messages,
  onViewAll,
}: RecentMessagesCardProps) {
  return (
    <Card className="border border-border/80 bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Mensajes Recientes</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary"
            onClick={onViewAll}
          >
            Ver Todo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.sender} className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{message.sender}</p>
                <p className="text-xs text-muted-foreground">{message.time}</p>
              </div>
              <p className="text-xs text-muted-foreground">{message.preview}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})
