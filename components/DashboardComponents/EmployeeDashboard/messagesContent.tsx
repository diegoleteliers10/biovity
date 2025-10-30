"use client"

import {
  AiPhone01Icon,
  Attachment01Icon,
  Briefcase01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  MoreHorizontalIcon,
  Search01Icon,
  Sent02Icon,
  SmileIcon,
  Video01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type * as React from "react"
import { useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MESSAGES_DATA } from "@/lib/data/messages-data"

export const MessagesContent = () => {
  const [selectedConversation, setSelectedConversation] = useState(MESSAGES_DATA.activeConversation)
  const [messageInput, setMessageInput] = useState("")

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Aquí iría la lógica para enviar el mensaje
      console.log("Enviando mensaje:", messageInput)
      setMessageInput("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-1">
      {/* Sidebar de conversaciones */}
      <div className="w-80 border-r-1 border-border flex flex-col">
        {/* Header del sidebar */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mensajes</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {MESSAGES_DATA.conversations.length} conversaciones activas
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
            </Button>
          </div>

          <div className="relative mb-6">
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Buscar conversaciones..."
              className="pl-10 h-10 bg-muted/50 border-muted focus:bg-background transition-colors"
            />
          </div>
        </div>

        {/* Lista de conversaciones */}
        <div className="flex-1 overflow-y-auto">
          {MESSAGES_DATA.conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedConversation.id === conversation.id ? "bg-muted" : ""
              }`}
              onClick={() => {
                const fullConversation = MESSAGES_DATA.conversations.find(
                  (c) => c.id === conversation.id
                );
                if (fullConversation) {
                  setSelectedConversation({
                    ...fullConversation,
                    messages: MESSAGES_DATA.activeConversation.messages,
                  });
                }
              }}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {conversation.recruiter.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                  </Avatar>
                  {conversation.recruiter.isOnline && (
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm truncate">
                      {conversation.recruiter.name}
                    </h3>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                      {conversation.lastMessage.time}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-1 truncate">
                    {conversation.recruiter.company}
                  </p>

                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm truncate flex-1 ${
                        !conversation.lastMessage.isRead
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {conversation.lastMessage.text}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${conversation.statusColor}`}
                    >
                      {conversation.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de chat principal */}
      <div className="flex-1 flex flex-col">
        {/* Header del chat */}
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {selectedConversation.recruiter.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                </Avatar>
                {selectedConversation.recruiter.isOnline && (
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full"></div>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg text-foreground">
                    {selectedConversation.recruiter.name}
                  </h2>
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                      MESSAGES_DATA.conversations.find(
                        (c) => c.id === selectedConversation.id
                      )?.statusColor || "bg-gray-100 text-gray-800"
                    } ml-3`}
                  >
                    {MESSAGES_DATA.conversations.find(
                      (c) => c.id === selectedConversation.id
                    )?.status || "Under Review"}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span className="font-medium">
                    {selectedConversation.recruiter.position}
                  </span>
                  <span className="text-muted-foreground/60">•</span>
                  <span>{selectedConversation.recruiter.company}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <HugeiconsIcon
                    icon={Briefcase01Icon}
                    size={14}
                    className="text-muted-foreground/70"
                  />
                  <span className="text-muted-foreground font-medium">
                    {selectedConversation.jobTitle}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 ml-4">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HugeiconsIcon icon={AiPhone01Icon} size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HugeiconsIcon icon={Video01Icon} size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HugeiconsIcon icon={MoreHorizontalIcon} size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          <div className="space-y-4">
            {selectedConversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-2 max-w-[70%] ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {message.sender === "recruiter" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {selectedConversation.recruiter.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    </Avatar>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <div
                      className={`flex items-center gap-1 mt-2 ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <span className="text-xs opacity-70">{message.time}</span>
                      {message.sender === "user" && (
                        <HugeiconsIcon
                          icon={
                            message.isRead ? CheckmarkCircle02Icon : Clock01Icon
                          }
                          size={12}
                          className="opacity-70"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input de mensaje */}
        <div className="p-4 border-t border-border bg-background">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <HugeiconsIcon icon={Attachment01Icon} size={20} />
            </Button>

            <div className="flex-1 relative">
              <textarea
                value={messageInput}
                onChange={(e) => {
                  setMessageInput(e.target.value);
                  // Auto-resize functionality
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyPress={handleKeyPress}
                placeholder="Escribe un mensaje..."
                className="w-full min-h-[36px] max-h-[120px] px-3 py-2 pr-12 border border-input rounded-md bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-none overflow-y-auto"
                rows={1}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              >
                <HugeiconsIcon icon={SmileIcon} size={18} />
              </Button>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              size="icon"
            >
              <HugeiconsIcon icon={Sent02Icon} size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
