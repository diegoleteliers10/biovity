"use client"

import ReactMarkdown from "react-markdown"

interface AIStreamOutputProps {
  text: string
  className?: string
}

export function AIStreamOutput({ text, className }: AIStreamOutputProps) {
  return (
    <div className={className}>
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  )
}
