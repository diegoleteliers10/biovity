"use client"

import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RecentMessage } from "@/lib/types/dashboard"

interface RecentMessagesCardProps {
  messages: RecentMessage[]
}

export const RecentMessagesCard = memo(function RecentMessagesCard({
  messages,
}: RecentMessagesCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Mensajes Recientes</CardTitle>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Ver Todo
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.sender} className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{message.sender}</p>
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
